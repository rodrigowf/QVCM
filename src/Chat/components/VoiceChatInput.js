import React from 'react';
import {
  Box,
  IconButton,
  CircularProgress,
  keyframes,
  styled,
  useTheme,
  Tooltip,
  Alert,
  Typography,
} from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ChatInputContainer } from '../styled/ChatInput.styled';

// Keyframes for a glowing pulse around the button.
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 5px 0 rgba(244, 67, 54, 0.3);
  }
  50% {
    box-shadow: 0 0 15px 5px rgba(244, 67, 54, 0.5);
  }
  100% {
    box-shadow: 0 0 5px 0 rgba(244, 67, 54, 0.3);
  }
`;

// Wrapper to center the button across the available width.
const CenterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(2),
}));

// Container for the button and its animated rings.
const VoiceButtonContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

// A ring whose scale dynamically reflects the real-time audio input level.
const InputLevelRing = styled('div')(({ theme, isDarkMode, audioLevel }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  border: `2px solid ${isDarkMode ? theme.palette.primary.light : theme.palette.primary.main}`,
  transform: `scale(${1 + audioLevel * 0.5})`,
  opacity: 0.7,
  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
}));

// A pulsing glow effect that adds a modern, dynamic look.
const GlowRing = styled('div')(({ theme, isDarkMode }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  animation: `${pulseGlow} 2s infinite`,
}));

// The voice button with a modern gradient and smooth hover scale.
const VoiceButton = styled(IconButton)(({ theme, isConnected, isDarkMode }) => ({
  width: '72px',
  height: '72px',
  transition: 'all 0.3s ease',
  background: isConnected 
    ? `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
    : `linear-gradient(45deg, ${isDarkMode ? theme.palette.primary.main : theme.palette.primary.main}, ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.dark})`,
  color: '#fff',
  '&:hover': {
    background: isConnected 
      ? `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`
      : `linear-gradient(45deg, ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.dark}, ${isDarkMode ? theme.palette.primary.main : theme.palette.primary.main})`,
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    backgroundColor: isDarkMode ? '#404040' : '#e0e0e0',
  },
  boxShadow: isDarkMode 
    ? '0 4px 12px rgba(118, 182, 253, 0.3)' 
    : '0 4px 12px rgba(76, 103, 151, 0.3)',
}));

const ControlsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const MuteButton = styled(IconButton)(({ theme, isMuted, isDarkMode }) => ({
  width: '56px',
  height: '56px',
  transition: 'all 0.3s ease',
  background: isMuted
    ? `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`
    : `linear-gradient(45deg, ${isDarkMode ? theme.palette.primary.main : theme.palette.primary.light}, ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main})`,
  color: '#fff',
  '&:hover': {
    background: isMuted
      ? `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
      : `linear-gradient(45deg, ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main}, ${isDarkMode ? theme.palette.primary.main : theme.palette.primary.dark})`,
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    backgroundColor: isDarkMode ? '#404040' : '#e0e0e0',
  },
  boxShadow: isDarkMode
    ? '0 4px 12px rgba(118, 182, 253, 0.25)'
    : '0 4px 12px rgba(76, 103, 151, 0.25)',
}));

export const VoiceChatInput = ({
  isDarkMode,
  isConnected,
  isSpeaking,
  loading,
  apiKey,
  onConnect,
  onDisconnect,
  audioLevel = 0,
  isMuted = false,
  onToggleMute = () => {},
  error = null,
}) => {
  const theme = useTheme();
  const [connectionError, setConnectionError] = React.useState(null);

  // Update connection error when error prop changes
  React.useEffect(() => {
    if (error) {
      setConnectionError(error);
    }
  }, [error]);

  const handleToggleConnection = async () => {
    setConnectionError(null); // Clear previous errors

    if (isConnected) {
      try {
        await onDisconnect();
      } catch (error) {
        console.error('Failed to disconnect:', error);
        setConnectionError(error.message || 'Failed to disconnect');
      }
    } else {
      try {
        await onConnect(apiKey);
        setConnectionError(null); // Clear error on successful connection
      } catch (error) {
        console.error('Failed to connect:', error);
        setConnectionError(error.message || 'Failed to connect to voice chat');
      }
    }
  };

  return (
    <ChatInputContainer isDarkMode={isDarkMode} theme={theme}>
      <Box sx={{ width: '100%', p: 2 }}>
        {/* Error Display */}
        {connectionError && (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon />}
            onClose={() => setConnectionError(null)}
            sx={{
              mb: 2,
              backgroundColor: isDarkMode ? 'rgba(211, 47, 47, 0.1)' : undefined,
              color: isDarkMode ? '#ef5350' : undefined,
              '& .MuiAlert-icon': {
                color: isDarkMode ? '#ef5350' : undefined,
              }
            }}
          >
            <Typography variant="body2">{connectionError}</Typography>
          </Alert>
        )}

        {/* No API Key Warning */}
        {!apiKey && !connectionError && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              backgroundColor: isDarkMode ? 'rgba(255, 152, 0, 0.1)' : undefined,
              color: isDarkMode ? '#ffa726' : undefined,
            }}
          >
            <Typography variant="body2">
              Please set your API key to use voice chat
            </Typography>
          </Alert>
        )}

        <CenterContainer>
          <ControlsRow>
            <VoiceButtonContainer>
              {isConnected && isSpeaking && !isMuted && (
                <>
                  <InputLevelRing isDarkMode={isDarkMode} audioLevel={audioLevel} />
                  <GlowRing isDarkMode={isDarkMode} />
                </>
              )}
              <Tooltip
                title={
                  !apiKey
                    ? 'Set API key to enable voice chat'
                    : loading
                    ? 'Connecting...'
                    : isConnected
                    ? 'Disconnect from voice chat'
                    : 'Connect to voice chat'
                }
              >
                <span>
                  <VoiceButton
                    isConnected={isConnected}
                    isDarkMode={isDarkMode}
                    onClick={handleToggleConnection}
                    disabled={!apiKey || loading}
                  >
                    {loading ? (
                      <CircularProgress size={28} color="inherit" />
                    ) : isConnected ? (
                      <CallEndIcon fontSize="large" />
                    ) : (
                      <MicIcon fontSize="large" />
                    )}
                  </VoiceButton>
                </span>
              </Tooltip>
            </VoiceButtonContainer>
            {isConnected && (
              <Tooltip title={isMuted ? "Unmute microphone" : "Mute microphone"}>
                <MuteButton
                  isDarkMode={isDarkMode}
                  isMuted={isMuted}
                  onClick={onToggleMute}
                  disabled={!apiKey || loading}
                >
                  {isMuted ? (
                    <MicOffIcon fontSize="medium" />
                  ) : (
                    <MicIcon fontSize="medium" />
                  )}
                </MuteButton>
              </Tooltip>
            )}
          </ControlsRow>
        </CenterContainer>
      </Box>
    </ChatInputContainer>
  );
}; 
