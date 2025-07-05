import { cloneElement, type ReactElement, type ReactNode, useState, useEffect } from 'react';
import { Box, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material';

interface OnboardingProps {
  children: ReactNode[];
  title?: ReactNode;
}

interface StepElement extends ReactElement {
  props: {
    stepName: string;
    onNext?: (direction: boolean) => void;
  };
}

export const Onboarding = ({ children,title }: OnboardingProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepMap, setStepMap] = useState<Map<string, number>>(new Map());
  const theme = useTheme();

  // Validate step names and create step mapping
  useEffect(() => {
    const newStepMap = new Map<string, number>();
    const childArray = children as StepElement[];

    // Validate that all children have unique step names
    childArray.forEach((child, index) => {
      const stepName = child.props?.stepName;
      if (!stepName) {
        console.error(`Step at index ${index} is missing a stepName prop`);
        return;
      }
      if (newStepMap.has(stepName)) {
        console.error(`Duplicate step name found: ${stepName}`);
        return;
      }
      newStepMap.set(stepName, index);
    });

    setStepMap(newStepMap);
  }, [children]);

  const handleNext = (direction: boolean = true, stepName?: string) => {
    // Validate that the step name matches the current step
    if (stepName) {
      const currentStepName = (children[activeStep] as StepElement).props?.stepName;
      if (stepName !== currentStepName) {
        console.error(`Step mismatch: expected ${currentStepName}, got ${stepName}`);
        return;
      }
    }

    // Only proceed if we're within bounds
    const nextStep = activeStep + (direction ? 1 : -1);
    if (nextStep >= 0 && nextStep < children.length) {
      setActiveStep(nextStep);
    }
  };

  const steps = (children as StepElement[]).map(child => child.props?.stepName);

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom sx={{ 
        color: 'text.primary', 
        marginBottom: '4px',
        '@media (max-width: 600px)': {
          fontSize: '1.5rem',
          marginBottom: '2px',
        },
      }}>
        {title?title:"Let's set up your Private Cloud Server (PCS)"}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom sx={{ 
        color: 'text.primary', 
        marginBottom: '24px',
        '@media (max-width: 600px)': {
          fontSize: '0.9rem',
          marginBottom: '16px',
          px: 1,
        },
      }}>
        {title?title:"Just 4 steps to own your data and apps"}
      </Typography>
      <Box sx={{ 
        mb: 4,
        '@media (max-width: 600px)': {
          mb: 2,
        },
      }}>
        {/* Desktop Stepper */}
        <Stepper
          activeStep={activeStep}
          sx={{
            '@media (max-width: 600px)': {
              display: 'none',
            },
            // Hide the number
            '& .MuiStepIcon-text': {
              display: 'none',
            },
            // Base color for every step circle
            '& .MuiStepIcon-root': {
              color: 'text.secondary',
            },
            // Override for the active and completed steps
            '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': {
              color: 'primary.main',
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Mobile Step Indicator */}
        <Box sx={{
          display: 'none',
          '@media (max-width: 600px)': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            background: 'linear-gradient(98deg, rgba(39, 170, 225, 0.08), rgba(238, 42, 123, 0.08))',
            borderRadius: '16px',
            padding: '12px 16px',
            border: '1px solid',
            borderColor: 'rgba(39, 170, 225, 0.2)',
          },
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
            }} />
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}>
              STEP {activeStep + 1} OF {steps.length}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ 
            color: 'text.primary',
            fontSize: '0.95rem',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            {steps[activeStep]}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ 
        mb: 2,
        '@media (max-width: 600px)': {
          mb: 1,
        },
      }}>
        {cloneElement(children[activeStep] as ReactElement, {
          onNext: (direction: boolean) =>
            handleNext(direction, (children[activeStep] as StepElement).props?.stepName)
        })}
      </Box>
    </>
  );
};