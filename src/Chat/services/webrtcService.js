export class WebRTCService {
    constructor(mediaStream, onStatusChange, onSpeechChange, onMessage, onError) {
        this.peerConnection = null;
        this.dataChannel = null;
        this.audioElement = document.createElement('audio');
        this.audioElement.autoplay = true;
        this.mediaStream = mediaStream;

        // Callbacks
        this.onStatusChange = onStatusChange;
        this.onSpeechChange = onSpeechChange;
        this.onMessage = onMessage;
        this.onError = onError || ((error) => console.error(error));

        // State management
        this.currentResponse = {
            text: '',
            role: null,
            responseId: null
        };

        // Add connection state tracking
        this.isConnecting = false;

        // Add system prompt tracking
        this.currentSystemPrompt = null;

        // Add voice tracking for voice switching
        this.currentVoice = null;

        // Connection timeout and retry settings
        this.CONNECTION_TIMEOUT = 30000; // 30 seconds
        this.MAX_RETRY_ATTEMPTS = 3;
        this.retryCount = 0;

        // Monitor connection state
        this.connectionCheckInterval = null;
    }

    async connect(apiKey, systemPrompt, voice = 'echo') {
        // Prevent multiple simultaneous connection attempts
        if (this.isConnecting) {
            console.log('Connection already in progress');
            return false;
        }

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout: Failed to connect within 30 seconds')), this.CONNECTION_TIMEOUT);
        });

        try {
            this.isConnecting = true;
            this.retryCount++;

            // Validate API key
            if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
                throw new Error('Invalid API key provided');
            }

            // Check browser compatibility
            this.checkBrowserCompatibility();

            // Ensure cleanup of any existing connection
            await this.disconnect();

            // Create and configure peer connection with error handling
            try {
                const RTCPeerConnectionClass = window.RTCPeerConnection || window.webkitRTCPeerConnection;
                if (!RTCPeerConnectionClass) {
                    throw new Error('WebRTC is not supported on this browser');
                }
                this.peerConnection = new RTCPeerConnectionClass();
            } catch (rtcError) {
                throw new Error(`Failed to create peer connection: ${rtcError.message}`);
            }

            // Monitor connection state changes
            this.setupConnectionMonitoring();

            // Handle remote audio stream with error handling
            this.peerConnection.ontrack = (event) => {
                try {
                    if (event.streams && event.streams[0]) {
                        this.audioElement.srcObject = event.streams[0];
                    }
                } catch (audioError) {
                    console.error('Error setting audio stream:', audioError);
                    this.onError?.(new Error('Failed to play remote audio'));
                }
            };

            // Set up data channel for events
            this.dataChannel = this.peerConnection.createDataChannel('oai-events');

            // Create a promise that resolves when the data channel opens
            const dataChannelReady = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Data channel failed to open within timeout'));
                }, 10000);

                this.dataChannel.onopen = () => {
                    clearTimeout(timeout);
                    console.log('Data channel opened');
                    resolve();
                };

                this.dataChannel.onerror = (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`Data channel error: ${error}`));
                };
            });

            this.setupDataChannel();

            // Add local audio track for microphone input
            if (!this.mediaStream || !this.mediaStream.getTracks().length) {
                throw new Error('No valid media stream available');
            }

            this.mediaStream.getTracks().forEach(track => {
                try {
                    this.peerConnection.addTrack(track, this.mediaStream);
                } catch (trackError) {
                    console.error('Error adding track:', trackError);
                    throw new Error('Failed to add audio track to connection');
                }
            });

            // Create and set local description
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);

            // Send offer to OpenAI's Realtime API with timeout
            const fetchPromise = fetch('https://api.openai.com/v1/realtime?model=gpt-realtime', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/sdp'
                },
                body: offer.sdp
            });

            const response = await Promise.race([fetchPromise, timeoutPromise]);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                if (response.status === 401) {
                    throw new Error('Invalid API key - please check your OpenAI API key');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded - please try again later');
                } else if (response.status >= 500) {
                    throw new Error('OpenAI service temporarily unavailable - please try again');
                }
                throw new Error(`Failed to connect to OpenAI (${response.status}): ${errorText}`);
            }

            // Set remote description from OpenAI's answer
            const answerText = await response.text();
            if (!answerText || answerText.trim().length === 0) {
                throw new Error('Received empty response from OpenAI');
            }

            const answer = {
                type: 'answer',
                sdp: answerText
            };

            try {
                await this.peerConnection.setRemoteDescription(answer);
            } catch (sdpError) {
                throw new Error(`Failed to set remote description: ${sdpError.message}`);
            }

            // Wait for data channel to be ready
            await Promise.race([dataChannelReady, timeoutPromise]);

            console.log("System Prompt:", systemPrompt);

            // Set system prompt after connection is ready
            if (systemPrompt) {
                try {
                    await this.setSystemPrompt(systemPrompt);
                } catch (promptError) {
                    console.warn('Failed to set system prompt:', promptError);
                    // Non-fatal, continue connection
                }
            }

            // Set voice after connection is ready
            if (voice) {
                try {
                    await this.setVoice(voice);
                } catch (voiceError) {
                    console.warn('Failed to set voice:', voiceError);
                    // Non-fatal, continue connection
                }
            }

            // Send session update to enable input audio transcription
            try {
                const sessionUpdate = {
                    type: 'session.update',
                    session: {
                        input_audio_transcription: {
                            model: 'whisper-1'
                        },
                        instructions: systemPrompt
                    }
                };
                this.dataChannel.send(JSON.stringify(sessionUpdate));
                console.log("Sent session update:", sessionUpdate);
            } catch (sessionError) {
                console.warn('Failed to send session update:', sessionError);
                // Non-fatal, connection is still usable
            }

            this.retryCount = 0; // Reset retry count on success
            this.onStatusChange(true);
            return true;

        } catch (error) {
            console.error('Connection error:', error);

            // Provide user-friendly error messages
            this.onError?.(this.getUserFriendlyError(error));

            await this.disconnect();

            // Retry logic for transient errors
            if (this.shouldRetry(error) && this.retryCount < this.MAX_RETRY_ATTEMPTS) {
                console.log(`Retrying connection (attempt ${this.retryCount}/${this.MAX_RETRY_ATTEMPTS})...`);
                await new Promise(resolve => setTimeout(resolve, 2000 * this.retryCount));
                return this.connect(apiKey, systemPrompt, voice);
            }

            throw error;
        } finally {
            this.isConnecting = false;
        }
    }

    checkBrowserCompatibility() {
        const errors = [];

        // Check for getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            errors.push('Microphone access is not supported');
        }

        // Check for RTCPeerConnection
        if (!window.RTCPeerConnection && !window.webkitRTCPeerConnection) {
            errors.push('WebRTC is not supported');
        }

        // Check for AudioContext
        if (!window.AudioContext && !window.webkitAudioContext) {
            errors.push('Web Audio API is not supported');
        }

        if (errors.length > 0) {
            throw new Error(`Browser compatibility issue: ${errors.join(', ')}. Please use a modern browser like Chrome, Firefox, Safari, or Edge.`);
        }
    }

    setupConnectionMonitoring() {
        if (!this.peerConnection) return;

        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection?.connectionState;
            console.log('Connection state changed:', state);

            switch (state) {
                case 'disconnected':
                    console.warn('WebRTC connection disconnected');
                    this.onError?.(new Error('Connection lost - please reconnect'));
                    break;
                case 'failed':
                    console.error('WebRTC connection failed');
                    this.onError?.(new Error('Connection failed - please try again'));
                    this.disconnect();
                    break;
                case 'closed':
                    console.log('WebRTC connection closed');
                    this.disconnect();
                    break;
                case 'connected':
                    console.log('WebRTC connection established successfully');
                    break;
                default:
                    console.log('WebRTC connection state:', state);
                    break;
            }
        };

        this.peerConnection.onicecandidateerror = (event) => {
            console.error('ICE candidate error:', event);
            // Non-fatal, but log for debugging
        };
    }

    shouldRetry(error) {
        const retryableErrors = [
            'timeout',
            'network',
            'temporarily unavailable',
            'rate limit',
            'failed to fetch'
        ];

        const errorMessage = (error.message || '').toLowerCase();
        return retryableErrors.some(msg => errorMessage.includes(msg));
    }

    getUserFriendlyError(error) {
        const message = error.message || '';

        if (message.includes('timeout')) {
            return new Error('Connection is taking too long. Please check your internet connection and try again.');
        }
        if (message.includes('API key') || message.includes('401')) {
            return new Error('Invalid API key. Please check your OpenAI API key in settings.');
        }
        if (message.includes('rate limit') || message.includes('429')) {
            return new Error('Too many requests. Please wait a moment and try again.');
        }
        if (message.includes('microphone') || message.includes('getUserMedia')) {
            return new Error('Cannot access microphone. Please grant microphone permissions and try again.');
        }
        if (message.includes('WebRTC') || message.includes('not supported')) {
            return new Error('Voice chat is not supported on this device or browser. Please try a newer browser.');
        }
        if (message.includes('500') || message.includes('unavailable')) {
            return new Error('Service temporarily unavailable. Please try again in a few moments.');
        }

        return error;
    }

    async setSystemPrompt(systemPrompt) {
        if (!this.dataChannel) return;
        
        // Don't update if the prompt hasn't changed
        if (this.currentSystemPrompt === systemPrompt) {
            console.log('System prompt unchanged, skipping update');
            return;
        }

        const sessionUpdate = {
            type: 'session.update',
            session: {
                instructions: systemPrompt
            }
        };

        this.dataChannel.send(JSON.stringify(sessionUpdate));
        this.currentSystemPrompt = systemPrompt;
    }

    // Add more detailed logging
    async setVoice(newVoice) {
        if (!this.dataChannel) {
            console.error('Data channel not initialized');
            return;
        }
        
        if (this.dataChannel.readyState !== 'open') {
            console.error('Data channel not open, current state:', this.dataChannel.readyState);
            return;
        }
        
        // Don't update if the voice hasn't changed
        if (this.currentVoice === newVoice) {
            console.log('Voice unchanged, skipping update');
            return;
        }
        
        // // Check if model has already responded with audio
        // if (this.hasModelResponded) {
        //     console.error('Cannot change voice after the model has responded with audio');
        //     return;
        // }

        const sessionUpdate = {
            type: 'session.update',
            session: {
                voice: newVoice
            }
        };

        this.dataChannel.send(JSON.stringify(sessionUpdate));
        console.log("Voice updated to:", newVoice);
        this.currentVoice = newVoice;
    }

    async disconnect() {
        try {
            // Clear connection monitoring interval
            if (this.connectionCheckInterval) {
                clearInterval(this.connectionCheckInterval);
                this.connectionCheckInterval = null;
            }

            // Close peer connection
            if (this.peerConnection) {
                try {
                    this.peerConnection.close();
                } catch (error) {
                    console.error('Error closing peer connection:', error);
                }
                this.peerConnection = null;
            }

            // Close data channel
            if (this.dataChannel) {
                try {
                    if (this.dataChannel.readyState === 'open') {
                        this.dataChannel.close();
                    }
                } catch (error) {
                    console.error('Error closing data channel:', error);
                }
                this.dataChannel = null;
            }

            // Clean up audio element
            try {
                if (this.audioElement.srcObject) {
                    this.audioElement.srcObject = null;
                }
            } catch (error) {
                console.error('Error cleaning up audio element:', error);
            }

            // Reset state
            this.currentResponse = {
                text: '',
                role: null,
                responseId: null
            };
            this.currentSystemPrompt = null;
            this.currentUserTranscript = "";
            this.isConnecting = false;
            this.currentVoice = null;

            this.onStatusChange(false);
        } catch (error) {
            console.error('Error during disconnect:', error);
            // Still update status even if cleanup fails
            this.onStatusChange(false);
        }
    }

    setupDataChannel() {
        if (!this.dataChannel) return;

        this.dataChannel.onmessage = (event) => {
            try {
                if (!event.data) {
                    console.warn('Received empty data channel message');
                    return;
                }

                const data = JSON.parse(event.data);
                console.log('Received WebRTC event:', data);
                this.handleEvent(data);
            } catch (parseError) {
                console.error('Error parsing data channel message:', parseError);
                console.error('Raw message:', event.data);
                // Don't crash on parse errors, just log and continue
            }
        };

        this.dataChannel.onclose = () => {
            console.log('Data channel closed');
            this.onStatusChange(false);
        };

        this.dataChannel.onerror = (error) => {
            console.error('Data channel error:', error);
            this.onError?.(new Error('Communication error with voice service'));
        };
    }

    handleEvent(event) {
        console.log('Processing event:', event.type, event);

        switch (event.type) {
            case 'conversation.item.created':
                // Handle new conversation items (user messages)
                const newItem = event.item;
                if (newItem.role === 'user' && newItem.content && newItem.content[0]) {
                    const transcript = newItem.content[0].transcript || "";
                    this.onMessage?.({
                        id: `user-${newItem.id}`,
                        text: transcript,
                        role: 'user',
                        timestamp: Date.now()
                    });
                }
                break;

            case 'response.created':
                // Reset current response state for new response
                this.currentResponse = {
                    text: '',
                    role: 'assistant',
                    responseId: event.response.id,
                    timestamp: Date.now() + 100
                };
                break;

            case 'response.audio_transcript.delta':
                const delta = event.delta;
                if (this.currentResponse.responseId === event.response_id) {
                    this.currentResponse.text += delta;
                }
                break;

            case 'response.audio_transcript.done':
                if (this.currentResponse.text.trim()) {
                    this.onMessage?.({
                        id: this.currentResponse.responseId,
                        text: this.currentResponse.text.trim(),
                        role: 'assistant',
                        timestamp: this.currentResponse.timestamp
                    });
                }
                // Reset for next response
                this.currentResponse = { 
                    text: '', 
                    role: null, 
                    responseId: null,
                    timestamp: null
                };
                break;

            case 'input_audio_buffer.speech_started':
                this.onSpeechChange(true);
                break;
            
            case 'input_audio_buffer.speech_stopped':
                this.onSpeechChange(false);
                break;
            
            case 'session.created':
            case 'session.updated':
            case 'conversation.item.input_audio_transcription.completed':
                const transcript = event.transcript;
                if (transcript) {
                    this.onMessage?.({
                        id: `user-${event.item_id}`,
                        text: transcript.trim(),
                        role: 'user',
                        timestamp: Date.now()
                    });
                }
                break;

            default:
                console.log('Unhandled event type:', event.type, event);
        }
    }

    handleTranscriptDelta(delta, responseId, itemId) {
        // Optional: Handle real-time transcript updates if needed
        console.log('Transcript delta:', delta);
    }

    handleNewResponse(response) {
        console.log('New response created:', response);
        // Initialize new response for the assistant
        this.currentResponse = {
            text: '',
            role: 'assistant',
            responseId: response.id
        };
    }

    setOnMessageCallback(cb) {
        this.onMessage = cb;
    }
}