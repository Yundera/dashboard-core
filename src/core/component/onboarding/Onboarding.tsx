import { cloneElement, type ReactElement, type ReactNode, useState, useEffect } from 'react';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';

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
      <Typography variant="h4" align="center" gutterBottom>
        {title?title:"Getting Started"}
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mb: 2 }}>
        {cloneElement(children[activeStep] as ReactElement, {
          onNext: (direction: boolean) =>
            handleNext(direction, (children[activeStep] as StepElement).props?.stepName)
        })}
      </Box>
    </>
  );
};