// ExampleStep.tsx
import {Button, Stack, Typography, useTheme} from '@mui/material';
import type {ReactNode} from 'react';
import { useGlobalLoading } from '../GlobalLoadingContext';
import { useEffect } from 'react';

export interface OnboardingStepProps {
  onNext?: (dir?:boolean) => void;
  stepName: string;
  backButton?: boolean;
  nextButton?: boolean;
  children?: ReactNode;
}

export const OnboardingStep = ({ onNext = () => {}, stepName, children , backButton=true,nextButton=true}: OnboardingStepProps) => {
  const theme = useTheme();
  const globalLoading = useGlobalLoading();

  // Hide global loading when final step mounts (no next button = final step)
  useEffect(() => {
    if (!nextButton && !backButton) {
      console.log('🎉 REGISTRATION COMPLETE - Final step reached');
      globalLoading.hideLoading();
    }
  }, [nextButton, backButton]);

  return (
    <Stack spacing={2} sx={{
      '@media (max-width: 600px)': {
        spacing: 1.5,
      },
    }}>
      {children}
      <Stack direction="row" spacing={2} sx={{
        '@media (max-width: 600px)': {
          flexDirection: 'column',
          spacing: 1,
        },
      }}>
        {nextButton && <Button variant="contained" onClick={()=>onNext(true)} sx={{
          '@media (max-width: 600px)': {
            order: 1,
            fontSize: '0.9rem',
            py: 1.5,
          },
        }}>Next</Button>}
        {backButton && <Button variant="text" onClick={()=>onNext(false)} sx={{
          '@media (max-width: 600px)': {
            order: 2,
            fontSize: '0.85rem',
            py: 1,
          },
        }}>Back</Button>}
      </Stack>
    </Stack>
  );
};
