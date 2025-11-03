import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Avatar, alpha } from '@mui/material';
import { appsConfig, AppConfig } from './appsConfig';

interface AppCarouselProps {
  onHoverStateChange?: (isHovering: boolean) => void;
  autoSlideInterval?: number; // milliseconds
  persistentIndex?: number;
  persistentProgress?: number;
  onStateChange?: (index: number, progress: number) => void;
}

export const AppCarousel: React.FC<AppCarouselProps> = ({
  onHoverStateChange,
  autoSlideInterval = 9000,
  persistentIndex = 0,
  persistentProgress = 0,
  onStateChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(persistentIndex);
  const [progress, setProgress] = useState(persistentProgress);
  const [isHovering, setIsHovering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentApp = appsConfig[currentIndex];

  // Preload all app icons to prevent loading delays in carousel
  useEffect(() => {
    appsConfig.forEach((app) => {
      const img = new Image();
      img.src = app.icon;
    });
  }, []); // Only run once on mount

  // Initialize from persistent state when component mounts (only once)
  useEffect(() => {
    setCurrentIndex(persistentIndex);
    setProgress(persistentProgress);
  }, []); // Only run once on mount

  // Report state changes to parent (without onStateChange in deps to prevent loops)
  useEffect(() => {
    onStateChange?.(currentIndex, progress);
  }, [currentIndex, progress]); // Removed onStateChange from deps

  // Handle auto-slide logic
  useEffect(() => {
    if (!isHovering) {
      // Capture current progress at the moment this effect runs
      const currentProgress = progress;
      let startTime = Date.now() - (currentProgress / 100 * autoSlideInterval);
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / autoSlideInterval) * 100;
        
        if (newProgress >= 100) {
          setProgress(100);
          clearInterval(progressIntervalRef.current!);
        } else {
          setProgress(newProgress);
        }
      }, 50);

      // Set timer for next slide based on remaining time (using captured progress)
      const remainingTime = autoSlideInterval - (currentProgress / 100 * autoSlideInterval);
      intervalRef.current = setTimeout(() => {
        setIsResetting(true);
        setCurrentIndex((prev) => (prev + 1) % appsConfig.length);
        // Reset progress immediately with no animation
        setProgress(0);
        // Turn off resetting flag after a brief delay
        setTimeout(() => {
          setIsResetting(false);
        }, 50);
      }, remainingTime);
    } else {
      // Pause progress and clear timers (but keep current progress)
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isHovering, autoSlideInterval]); // Removed progress from deps

  const handleMouseEnter = () => {
    setIsHovering(true);
    onHoverStateChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    onHoverStateChange?.(false);
  };

  const handleDotClick = (index: number) => {
    setIsResetting(true);
    setCurrentIndex(index);
    // Reset progress immediately with no animation for manual clicks
    setProgress(0);
    setTimeout(() => {
      setIsResetting(false);
    }, 50);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      {/* App Card */}
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        elevation={0}
        sx={(theme) => ({
          position: 'relative',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: '16px',
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
          mb: 2,
          transition: 'all 0.2s ease-in-out',
          cursor: 'default',
          backgroundColor: theme.palette.background.paper,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
          [theme.breakpoints.down('sm')]: {
            borderRadius: '12px',
          },
        })}
      >
        <CardContent
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            p: 2,
            '&:last-child': {
              pb: 2,
            },
            [theme.breakpoints.down('sm')]: {
              p: 1.5,
            },
          })}
        >
          {/* App Icon - vertically centered */}
          <Avatar
            src={currentApp.icon}
            alt={currentApp.name}
            sx={(theme) => ({
              width: 48,
              height: 48,
              mr: 2,
              flexShrink: 0,
              alignSelf: 'center',
              [theme.breakpoints.down('sm')]: {
                width: 40,
                height: 40,
                mr: 1.5,
              },
            })}
          />

          {/* App Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title and Subtitle on same line */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={(theme) => ({
                  fontWeight: 600,
                  color: 'text.primary',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.95rem',
                  },
                })}
              >
                {currentApp.name}
              </Typography>

              <Typography
                variant="caption"
                sx={(theme) => ({
                  color: 'primary.main',
                  fontWeight: 500,
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.7rem',
                  },
                })}
              >
                - {currentApp.subtitle}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={(theme) => ({
                color: 'text.secondary',
                lineHeight: 1.4,
                fontSize: '0.875rem',
                minHeight: '2.8em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '0.75rem',
                  minHeight: '2.1em',
                },
              })}
            >
              {currentApp.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={isHovering ? progress : progress}
          sx={(theme) => ({
            height: 4,
            borderRadius: '4px',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: '4px',
              backgroundColor: theme.palette.primary.main,
              transition: isResetting ? 'none' : (isHovering ? 'none' : 'transform 0.1s linear'),
            },
            [theme.breakpoints.down('sm')]: {
              height: 3,
            },
          })}
        />

        {/* Dots indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5, gap: 1 }}>
          {appsConfig.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={(theme) => ({
                width: index === currentIndex ? 10 : 6,
                height: index === currentIndex ? 10 : 6,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.25),
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: index === currentIndex ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.4),
                  transform: 'scale(1.15)',
                },
                [theme.breakpoints.down('sm')]: {
                  width: index === currentIndex ? 8 : 5,
                  height: index === currentIndex ? 8 : 5,
                },
              })}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};