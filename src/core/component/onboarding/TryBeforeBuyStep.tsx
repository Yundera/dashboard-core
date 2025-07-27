import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Portal,
} from '@mui/material';
import { getConfig } from '../../configuration/getConfigFrontEnd';

interface TryBeforeBuyStepProps {
  open: boolean;
  onTryDemo: () => void;
  onBuyYundera: () => void;
  demoImageSrc?: string;
}

export const TryBeforeBuyStep: React.FC<TryBeforeBuyStepProps> = ({
  open,
  onTryDemo,
  onBuyYundera,
  demoImageSrc = `${getConfig("BASE_PATH")}/demo-preview.jpg`
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 600px)');

  if (!open) return null;

  // Mobile version uses custom Portal for compatibility
  if (isMobile) {
    return (
      <Portal>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100vw',
              height: '100vh',
              backgroundColor: theme.palette.background.paper,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Mobile Image */}
            <Box
              component="img"
              src={demoImageSrc}
              alt="Yundera Demo Preview"
              sx={{
                width: '100%',
                height: '60%',
                objectFit: 'cover',
              }}
            />
            
            {/* Mobile Content */}
            <Box sx={{ 
              flex: 1,
              px: 3,
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}>
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '1.5rem',
                  color: theme.palette.primary.main,
                }}
              >
                Try before you buy !
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  fontSize: '1rem',
                  color: theme.palette.text.secondary,
                }}
              >
                Discover all possibilities offered by Yundera with our demo.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: theme.palette.text.disabled,
                }}
              >
                Login: demo | Password: demodemo
              </Typography>

              <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
                <Button
                  variant="outlined"
                  onClick={onTryDemo}
                  fullWidth
                  sx={{
                    borderRadius: '25px',
                    py: 1.5,
                    fontSize: '1rem',
                  }}
                >
                  Try the demo
                </Button>

                <Button
                  variant="contained"
                  onClick={onBuyYundera}
                  fullWidth
                  sx={{
                    borderRadius: '25px',
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: 'none',
                  }}
                >
                  Buy Yundera
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Portal>
    );
  }

  // Desktop version uses Dialog
  return (
    <Dialog
      open={open}
      maxWidth={false}
      sx={{
        '& .MuiPaper-root': {
          width: '1000px',
          maxWidth: '95vw',
          maxHeight: '95vh',
          borderRadius: '30px',
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: '2px 2px 20px rgba(39,170,225,0.3)',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Image Section */}
        <Box
          component="img"
          src={demoImageSrc}
          alt="Yundera Demo Preview"
          sx={{
            width: '100%',
            objectFit: 'cover', // Fill full width
            display: 'block',
          }}
        />
        
        {/* Content Section */}
        <Box sx={{ 
          px: 6,
          pt: 4, // Top padding from image
          pb: 3, // Bottom padding
          backgroundColor: 'white',
        }}>
          <Stack spacing={1.5} alignItems="center">
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              fontSize: isMobile ? '1.8rem' : '2.2rem',
              color: theme.palette.primary.main, // Blue color like template
              mb: 2,
            }}
          >
            Try before you buy !
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              fontSize: isMobile ? '1rem' : '1.2rem',
              color: theme.palette.text.secondary,
              mb: 1.5,
            }}
          >
            Discover all possibilities offered by Yundera with our demo.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              color: theme.palette.text.disabled,
              mb: 3,
            }}
          >
            Login: demo | Password: demodemo
          </Typography>

          <Stack 
            direction="row" 
            spacing={3}
            sx={{
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <Button
              variant="outlined"
              onClick={onTryDemo}
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1.2,
                fontSize: '1rem',
                minWidth: '140px',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Try the demo
            </Button>

            <Button
              variant="contained"
              onClick={onBuyYundera}
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1.2,
                fontSize: '1rem',
                minWidth: '140px',
                backgroundColor: theme.palette.primary.main,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: 'none',
                },
              }}
            >
              Buy Yundera
            </Button>
          </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};