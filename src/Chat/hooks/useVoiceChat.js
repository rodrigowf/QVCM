import { useState, useCallback, useRef, useEffect } from 'react';
import { WebRTCService } from '../services/webrtcService';

export function useVoiceChat(systemPrompt, voice = 'cove', shouldInit = true) {
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const webrtcRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const connectionTimeoutRef = useRef(null);
    const isInitializedRef = useRef(shouldInit);

    const handleStatusChange = useCallback((status) => {
        setIsConnected(status);
        if (!status) {
            setIsSpeaking(false);
        }
    }, []);

    const handleSpeechChange = useCallback((speaking) => {
        setIsSpeaking(speaking);
    }, []);

    const handleError = useCallback((error) => {
        console.error('Voice chat error:', error);
        setError(error.message || 'An error occurred');
    }, []);

    const handleMessage = useCallback((...args) => {
        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            const { role, text, id, timestamp } = args[0];
            
            setMessages(prev => {
                const newMessage = {
                    role,
                    content: text,
                    id,
                    timestamp: timestamp || Date.now()
                };

                // Sort messages by timestamp
                return [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp);
            });
        }
        // Legacy format handler
        else if (args.length === 2) {
            const [role, text] = args;
            setMessages(prev => [...prev, {
                role,
                content: text,
                timestamp: Date.now(),
                id: `legacy-${Date.now()}`
            }].sort((a, b) => a.timestamp - b.timestamp));
        }
    }, []);

    const setupAudioAnalyser = useCallback((stream) => {
        // Don't initialize if hook shouldn't init
        if (!isInitializedRef.current) {
            return;
        }

        try {
            if (!audioContextRef.current) {
                // Use fallback for older browsers
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) {
                    console.warn('Web Audio API not supported - audio level visualization disabled');
                    return;
                }

                try {
                    audioContextRef.current = new AudioContextClass();
                } catch (contextError) {
                    console.error('Failed to create AudioContext:', contextError);
                    setError('Audio visualization not supported on this device');
                    return;
                }

                if (!audioContextRef.current) {
                    console.warn('Failed to initialize audio context');
                    return;
                }

                try {
                    analyserRef.current = audioContextRef.current.createAnalyser();
                    analyserRef.current.fftSize = 256;

                    const source = audioContextRef.current.createMediaStreamSource(stream);
                    source.connect(analyserRef.current);
                } catch (analyserError) {
                    console.error('Failed to setup audio analyser:', analyserError);
                    // Clean up partial setup
                    if (audioContextRef.current) {
                        audioContextRef.current.close().catch(console.error);
                        audioContextRef.current = null;
                    }
                    return;
                }
            }

            const analyzeAudio = () => {
                try {
                    if (!analyserRef.current) {
                        return;
                    }

                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);

                    // Calculate average volume level (0-1)
                    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                    setAudioLevel(average / 255);

                    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
                } catch (analyzeError) {
                    console.error('Error analyzing audio:', analyzeError);
                    // Stop analyzing if there's an error
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                        animationFrameRef.current = null;
                    }
                }
            };

            analyzeAudio();
        } catch (setupError) {
            console.error('Error setting up audio analyser:', setupError);
            setError('Failed to initialize audio visualization');
        }
    }, []);

    const cleanupAudioAnalyser = useCallback(() => {
        try {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch((error) => {
                    console.error('Error closing audio context:', error);
                });
                audioContextRef.current = null;
            }
            analyserRef.current = null;
            setAudioLevel(0);
        } catch (cleanupError) {
            console.error('Error cleaning up audio analyser:', cleanupError);
        }
    }, []);

    const connect = useCallback(async (apiKey) => {
        // Don't allow connection if hook wasn't initialized properly
        if (!isInitializedRef.current) {
            const error = new Error('Voice chat is not available on this browser');
            setError(error.message);
            throw error;
        }

        try {
            setError(null);

            // Clear any existing connection timeout
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }

            // Validate API key
            if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
                throw new Error('Please provide a valid API key to use voice chat');
            }

            // Check for basic browser compatibility
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // Try legacy getUserMedia for older browsers
                const legacyGetUserMedia = navigator.getUserMedia ||
                                          navigator.webkitGetUserMedia ||
                                          navigator.mozGetUserMedia;

                if (!legacyGetUserMedia) {
                    throw new Error('Voice chat is not supported on this browser. Please use Chrome, Firefox, Safari, or Edge.');
                }
            }

            // Get media stream with proper error handling
            try {
                const constraints = {
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                };

                mediaStreamRef.current = await navigator.mediaDevices.getUserMedia(constraints);

                // Verify we got audio tracks
                const audioTracks = mediaStreamRef.current.getAudioTracks();
                if (!audioTracks || audioTracks.length === 0) {
                    throw new Error('No audio input detected. Please check your microphone.');
                }

                // Enable all audio tracks
                audioTracks.forEach(track => {
                    track.enabled = true;

                    // Monitor track state
                    track.onended = () => {
                        console.warn('Audio track ended unexpectedly');
                        setError('Microphone access was lost');
                    };

                    track.onmute = () => {
                        console.warn('Audio track muted');
                    };

                    track.onunmute = () => {
                        console.log('Audio track unmuted');
                    };
                });

                setIsMuted(false);
            } catch (mediaError) {
                console.error('Media error:', mediaError);

                // Provide specific error messages based on error type
                if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
                    throw new Error('Microphone access denied. Please allow microphone access in your browser settings and try again.');
                } else if (mediaError.name === 'NotFoundError' || mediaError.name === 'DevicesNotFoundError') {
                    throw new Error('No microphone found. Please connect a microphone and try again.');
                } else if (mediaError.name === 'NotReadableError' || mediaError.name === 'TrackStartError') {
                    throw new Error('Microphone is already in use by another application. Please close other apps using the microphone and try again.');
                } else if (mediaError.name === 'OverconstrainedError') {
                    throw new Error('Your microphone does not meet the required specifications.');
                } else if (mediaError.name === 'TypeError') {
                    throw new Error('Browser configuration error. Please try a different browser.');
                }

                throw new Error(`Failed to access microphone: ${mediaError.message || 'Unknown error'}`);
            }

            // Create WebRTC service if it doesn't exist
            if (!webrtcRef.current) {
                webrtcRef.current = new WebRTCService(
                    mediaStreamRef.current,
                    handleStatusChange,
                    handleSpeechChange,
                    handleMessage,
                    handleError
                );
            }

            // Connect with timeout monitoring
            const connectPromise = webrtcRef.current.connect(apiKey, systemPrompt, voice);

            // Set a connection timeout
            const timeoutPromise = new Promise((_, reject) => {
                connectionTimeoutRef.current = setTimeout(() => {
                    reject(new Error('Connection timeout. Please check your internet connection and try again.'));
                }, 45000); // 45 second total timeout
            });

            await Promise.race([connectPromise, timeoutPromise]);

            // Clear timeout on success
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }

            // Setup audio analyser (non-critical, don't fail on error)
            setupAudioAnalyser(mediaStreamRef.current);

        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Failed to connect:', error);

            // Clean up on error
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }

            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }

            throw error;
        }
    }, [handleStatusChange, handleSpeechChange, handleMessage, handleError, systemPrompt, voice, setupAudioAnalyser]);

    const disconnect = useCallback(async () => {
        try {
            // Clear connection timeout if any
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }

            // Disconnect WebRTC service
            if (webrtcRef.current) {
                try {
                    await webrtcRef.current.disconnect();
                } catch (disconnectError) {
                    console.error('Error disconnecting WebRTC service:', disconnectError);
                }
                webrtcRef.current = null;
            }

            // Clean up audio analyser
            cleanupAudioAnalyser();

            // Clean up media stream
            if (mediaStreamRef.current) {
                try {
                    mediaStreamRef.current.getTracks().forEach(track => {
                        try {
                            track.stop();
                        } catch (trackError) {
                            console.error('Error stopping track:', trackError);
                        }
                    });
                } catch (streamError) {
                    console.error('Error cleaning up media stream:', streamError);
                }
                mediaStreamRef.current = null;
            }

            // Reset state
            setIsMuted(false);
            setIsSpeaking(false);
            setError(null);
        } catch (error) {
            console.error('Failed to disconnect:', error);
            setError('Error during disconnect: ' + (error.message || 'Unknown error'));
        }
    }, [cleanupAudioAnalyser]);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
            }

            if (webrtcRef.current) {
                webrtcRef.current.disconnect().catch(console.error);
            }

            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => {
                    try {
                        track.stop();
                    } catch (error) {
                        console.error('Error stopping track on unmount:', error);
                    }
                });
            }

            cleanupAudioAnalyser();
        };
    }, [cleanupAudioAnalyser]);

    const updateSystemPrompt = useCallback(async (newPrompt) => {
        try {
            if (webrtcRef.current && isConnected) {
                await webrtcRef.current.setSystemPrompt(newPrompt);
            }
        } catch (error) {
            setError(error.message);
            console.error('Failed to update system prompt:', error);
        }
    }, [isConnected]);

    // useEffect(() => {
    //     const changeVoice = async (newVoice) => {
    //         try {
    //             await webrtcRef.current.setVoice(newVoice);
    //         } catch (error) {
    //             setError(error.message);
    //             console.error('Failed to change voice:', error);
    //         }
    //     };

    //     if (voice && webrtcRef.current && isConnected) {
    //         changeVoice(voice);
    //     }
    // }, [voice, isConnected]);

    const toggleMute = useCallback(() => {
        if (!mediaStreamRef.current) {
            return;
        }
        setIsMuted((prevMuted) => {
            const nextMuted = !prevMuted;
            mediaStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !nextMuted;
            });
            return nextMuted;
        });
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        isConnected,
        isSpeaking,
        messages,
        error,
        connect,
        disconnect,
        updateSystemPrompt,
        clearMessages,
        audioLevel,
        isMuted,
        toggleMute
    };
} 
