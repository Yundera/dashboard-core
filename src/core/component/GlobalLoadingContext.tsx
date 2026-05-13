import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useRef, useEffect } from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { AppCarousel } from './AppCarousel';

interface LoadingOptions {
  title?: string;
  subtitle?: string;
}

interface GlobalLoadingContextType {
  showLoading: (options?: LoadingOptions) => void;
  hideLoading: () => void;
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

const DEFAULT_TITLE = 'Loading...';
const DEFAULT_SUBTITLE = 'Please wait while we process your request.';
const COMPLETE_AUTOHIDE_MS = 1000;

export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState<string | undefined>(DEFAULT_SUBTITLE);
  // Persistent carousel state across loading panels
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselProgress, setCarouselProgress] = useState(0);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();

  const clearAutoHide = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  };

  useEffect(() => clearAutoHide, []);

  const showLoading = useCallback((options: LoadingOptions = {}) => {
    clearAutoHide();
    setIsLoading(prev => {
      if (prev) return prev; // already loading — preserve existing state
      setTitle(options.title ?? DEFAULT_TITLE);
      setSubtitle(options.subtitle ?? DEFAULT_SUBTITLE);
      setIsComplete(false);
      return true;
    });
  }, []);

  const hideLoading = useCallback(() => {
    clearAutoHide();
    setIsLoading(false);
    setIsComplete(false);
  }, []);

  const markLoadingComplete = useCallback(() => {
    setIsComplete(true);
    clearAutoHide();
    autoHideTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setIsComplete(false);
      autoHideTimerRef.current = null;
    }, COMPLETE_AUTOHIDE_MS);
  }, []);

  const value: GlobalLoadingContextType = useMemo(() => ({
    showLoading,
    hideLoading,
    markLoadingComplete,
    isLoading,
  }), [showLoading, hideLoading, markLoadingComplete, isLoading]);

  return (
    <GlobalLoadingContext.Provider value={value}>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Box
          sx={{
            visibility: isLoading ? 'hidden' : 'visible',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          {children}
        </Box>

        {isLoading && (
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
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {title}
                </Typography>

                {subtitle && (
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.text.secondary, maxWidth: '600px', px: 2, mt: -1 }}
                  >
                    {subtitle}
                  </Typography>
                )}

                <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!isComplete && (
                    <CircularProgress size={60} thickness={3} sx={{ color: theme.palette.primary.main }} />
                  )}
                </Box>

                <AppCarousel
                  onHoverStateChange={() => {}}
                  autoSlideInterval={9000}
                  persistentIndex={carouselIndex}
                  persistentProgress={carouselProgress}
                  onStateChange={(index, progress) => {
                    setCarouselIndex(index);
                    setCarouselProgress(progress);
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </GlobalLoadingContext.Provider>
  );
};
