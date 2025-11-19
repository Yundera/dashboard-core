import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Box, CircularProgress, Button, Alert, Typography, useTheme } from '@mui/material';
import { AppCarousel } from './AppCarousel';

interface LoadingState {
  isLoading: boolean;
  title?: string;
  subtitle?: string;
  messages?: string[];
  canCancel?: boolean;
  devMode?: boolean;
  loadingComplete?: boolean;
}

interface GlobalLoadingContextType {
  showLoading: (options?: Partial<LoadingState>) => void;
  hideLoading: () => void;
  updateLoading: (options: Partial<LoadingState>) => void;
  markLoadingComplete: () => void;
  isLoading: boolean;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};

interface GlobalLoadingProviderProps {
  children: ReactNode;
}

export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    title: 'Loading...',
    subtitle: 'Please wait while we process your request.',
    messages: ['Initializing...'],
    canCancel: false,
    devMode: false,
    loadingComplete: false,
  });

  const [showContinue, setShowContinue] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  // Persistent carousel state across loading panels
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselProgress, setCarouselProgress] = useState(0);
  // Timer refs for proper cleanup
  const messageTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const cleanupTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearInterval(messageTimerRef.current);
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  const showLoading = useCallback((options: Partial<LoadingState> = {}) => {
    // Prevent multiple calls when already loading
    setLoadingState(prev => {
      if (prev.isLoading) {
        return prev;
      }
      return {
        ...prev,
        isLoading: true,
        loadingComplete: false,
        ...options,
      };
    });
    setShowContinue(false);
    setCurrentMessageIndex(0);

    // In dev mode, show continue button after delay
    if (options.devMode) {
      setTimeout(() => {
        setShowContinue(true);
      }, 2000);
    }

    // Clear existing timers
    if (messageTimerRef.current) clearInterval(messageTimerRef.current);
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);

    // Cycle through messages
    if (options.messages && options.messages.length > 1) {
      messageTimerRef.current = setInterval(() => {
        setCurrentMessageIndex(prev => {
          const next = (prev + 1) % (options.messages?.length || 1);
          return next;
        });
      }, 1500);

      cleanupTimerRef.current = setTimeout(() => {
        if (messageTimerRef.current) {
          clearInterval(messageTimerRef.current);
          messageTimerRef.current = null;
        }
      }, 10000);
    }
  }, []);

  const hideLoading = useCallback(() => {
    // Clear any running timers
    if (messageTimerRef.current) {
      clearInterval(messageTimerRef.current);
      messageTimerRef.current = null;
    }
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }

    setLoadingState(prev => ({ ...prev, isLoading: false }));
    setShowContinue(false);
  }, []);

  const markLoadingComplete = useCallback(() => {
    setLoadingState(prev => ({ ...prev, loadingComplete: true }));
  }, []);

  // Auto-hide when loading completes
  React.useEffect(() => {
    if (loadingState.loadingComplete && !loadingState.devMode) {
      const autoHideTimer = setTimeout(() => {
        hideLoading();
      }, 1000); // Auto-hide after 1 second

      return () => clearTimeout(autoHideTimer);
    }
  }, [loadingState.loadingComplete, loadingState.devMode]);

  const updateLoading = useCallback((options: Partial<LoadingState>) => {
    setLoadingState(prev => ({ ...prev, ...options }));
  }, []);

  const handleDevContinue = useCallback(() => {
    hideLoading();
  }, [hideLoading]);

  const value: GlobalLoadingContextType = useMemo(() => ({
    showLoading,
    hideLoading,
    updateLoading,
    markLoadingComplete,
    isLoading: loadingState.isLoading,
  }), [showLoading, hideLoading, updateLoading, markLoadingComplete, loadingState.isLoading]);

  return (
    <GlobalLoadingContext.Provider value={value}>
      {/* Container with relative positioning for overlay */}
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* Children - always rendered but hidden when loading */}
        <Box
          sx={{
            visibility: loadingState.isLoading ? 'hidden' : 'visible',
            opacity: loadingState.isLoading ? 0 : 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          {children}
        </Box>
        
        {/* Loading Overlay - positioned absolutely to cover children */}
        {loadingState.isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.background.default,
              zIndex: 9999,
              minHeight: '100vh',
              p: 2,
              '@media (max-width: 600px)': {
                p: 0,
                paddingTop: '10vh',
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '30px',
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: '2px 2px 20px rgba(39,170,225,0.3)',
                p: 4,
                width: '100%',
                maxWidth: '1280px',
                textAlign: 'center',
                position: 'relative',
                '@media (max-width: 600px)': {
                  p: 1.5,
                  width: '95%',
                  maxWidth: '95%',
                  margin: '0 auto',
                  boxShadow: 'none',
                  border: `1px solid ${theme.palette.primary.light}`,
                },
              }}
            >
              {/* Dev Mode Indicator */}
              {loadingState.devMode && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'warning.main',
                    color: 'warning.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                  }}
                >
                  DEV MODE
                </Typography>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {/* Title - moved to top */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {loadingState.title}
                </Typography>

                {/* Spinner - consistent space */}
                <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!loadingState.loadingComplete && (
                    <CircularProgress
                      size={60}
                      thickness={3}
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                    />
                  )}
                </Box>

                {/* App Carousel - below spinner */}
                <AppCarousel
                  onHoverStateChange={(hovering: boolean) => {}} // No longer needed, using panel hover
                  autoSlideInterval={9000}
                  persistentIndex={carouselIndex}
                  persistentProgress={carouselProgress}
                  onStateChange={(index, progress) => {
                    setCarouselIndex(index);
                    setCarouselProgress(progress);
                  }}
                />

                {/* Dev Mode Continue Button - separate from main continue button */}
                {(loadingState.devMode && showContinue) && (
                  <>
                    <Alert severity="info" sx={{ width: '100%' }}>
                      <Typography variant="body2">
                        <strong>Development Mode:</strong> Loading paused for testing.
                      </Typography>
                    </Alert>
                    <Button
                      variant="contained"
                      onClick={handleDevContinue}
                      sx={{
                        borderRadius: '25px',
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Continue
                    </Button>
                  </>
                )}

                {/* Cancel Button */}
                {loadingState.canCancel && (
                  <Button
                    variant="outlined"
                    onClick={hideLoading}
                    sx={{
                      borderRadius: '25px',
                      px: 3,
                      py: 1,
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </GlobalLoadingContext.Provider>
  );
};