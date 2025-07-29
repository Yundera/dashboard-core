import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Avatar } from '@mui/material';
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
  autoSlideInterval = 4000,
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
        sx={{
          mb: 2,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          cursor: 'default', // Remove pointer cursor
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
          {/* App Icon - vertically centered */}
          <Avatar
            src={currentApp.icon}
            alt={currentApp.name}
            sx={{
              width: 48,
              height: 48,
              mr: 3,
              flexShrink: 0,
              alignSelf: 'center',
            }}
          />
          
          {/* App Info */}
          <Box sx={{ flex: 1 }}>
            {/* Title and Subtitle on same line */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                {currentApp.name}
              </Typography>
              
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              >
                - {currentApp.subtitle}
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                lineHeight: 1.4,
                minHeight: '2.8em', // Fixed height for 2 lines
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
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
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              backgroundColor: 'primary.main',
              transition: isResetting ? 'none' : (isHovering ? 'none' : 'transform 0.1s linear'),
            },
          }}
        />
        
        {/* Dots indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
          {appsConfig.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.300',
                transition: 'background-color 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: index === currentIndex ? 'primary.dark' : 'grey.400',
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};