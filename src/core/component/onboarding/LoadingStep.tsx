import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
  Alert,
  Chip,
} from '@mui/material';
import { CheckCircle, Settings } from '@mui/icons-material';

interface LoadingStepProps {
  title?: string;
  subtitle?: string;
  messages?: string[];
  onComplete?: () => void;
  developmentMode?: boolean; // When true, loading gets stuck and shows continue button
  duration?: number; // Duration in milliseconds for progress bar
  autoProgress?: boolean; // Whether to auto-progress or wait for external completion
}

export const LoadingStep: React.FC<LoadingStepProps> = ({
  title = "Setting up your environment...",
  subtitle = "This may take a moment while we prepare everything for you.",
  messages = [
    "Initializing secure connection...",
    "Preparing your personal cloud space...",
    "Configuring network settings...",
    "Almost ready..."
  ],
  onComplete,
  developmentMode = false,
  duration = 8000,
  autoProgress = true
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isStuck, setIsStuck] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!autoProgress) return;

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const increment = (100 / duration) * 200; // Update every 200ms
        const newProgress = Math.min(prevProgress + increment, 100);
        
        // Update message based on progress
        const messageProgress = Math.floor((newProgress / 100) * messages.length);
        setCurrentMessageIndex(Math.min(messageProgress, messages.length - 1));
        
        // In development mode, get stuck at 85%
        if (developmentMode && newProgress >= 85 && !isStuck) {
          setIsStuck(true);
          return 85;
        }
        
        // Complete loading if not in development mode or if user clicked continue
        if (newProgress >= 100 && !developmentMode) {
          setIsCompleted(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [duration, messages.length, onComplete, autoProgress, developmentMode, isStuck]);

  const handleContinue = () => {
    setIsStuck(false);
    setProgress(100);
    setIsCompleted(true);
    setTimeout(() => {
      onComplete?.();
    }, 500);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        p: 4,
        textAlign: 'center',
      }}
    >
      {/* Development Mode Indicator */}
      {developmentMode && (
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Chip
            icon={<Settings />}
            label="DEV MODE"
            color="warning"
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      <Stack spacing={4} alignItems="center" sx={{ width: '100%', maxWidth: '500px' }}>
        {/* Loading Animation */}
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isCompleted ? (
            <CheckCircle 
              sx={{ 
                fontSize: 80, 
                color: theme.palette.success.main,
                animation: 'fadeIn 0.5s ease-in-out'
              }} 
            />
          ) : (
            <CircularProgress 
              size={80} 
              thickness={3}
              sx={{ 
                color: theme.palette.primary.main,
                animationDuration: '2s'
              }}
            />
          )}
        </Box>

        {/* Title and Subtitle */}
        <Stack spacing={1} alignItems="center">
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              '@media (max-width: 600px)': {
                fontSize: '1.25rem',
              },
            }}
          >
            {isCompleted ? "Ready!" : title}
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              '@media (max-width: 600px)': {
                fontSize: '0.9rem',
              },
            }}
          >
            {isCompleted ? "Everything is set up and ready to go." : subtitle}
          </Typography>
        </Stack>

        {/* Progress Bar */}
        {!isCompleted && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
        )}

        {/* Loading Message */}
        {!isCompleted && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              minHeight: '1.5em',
              fontStyle: 'italic',
              '@media (max-width: 600px)': {
                fontSize: '0.8rem',
              },
            }}
          >
            {messages[currentMessageIndex]}
          </Typography>
        )}

        {/* Development Mode Alert and Continue Button */}
        {isStuck && developmentMode && (
          <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <Alert severity="info" sx={{ width: '100%' }}>
              <strong>Development Mode:</strong> Loading is paused at 85% for testing purposes.
            </Alert>
            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Continue to Next Step
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};