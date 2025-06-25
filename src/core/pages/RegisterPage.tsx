import {Onboarding} from "../component/onboarding/Onboarding";
import {SignUpStep} from "../component/onboarding/SignUpStep";
import {Box, Stack, Typography} from "@mui/material";
import {useConfigurationContext} from "../configuration/ConfigurationContext";
import {Children, ReactElement} from "react";
import {OnboardingStepProps} from "../component/onboarding/OnboardingStep";

import PrimaryContainer from "../component/PrimaryContainer";

interface RegisterPageProps {
  children: ReactElement<OnboardingStepProps> | ReactElement<OnboardingStepProps>[];
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ children }) => {  // Add children prop here
  const {logo, title} = useConfigurationContext();

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        p: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{mb: 4}}>
        <img src={logo} alt={title} width={50}/>
        <Typography component="span" variant="h5">{title}</Typography>
      </Stack>
      <PrimaryContainer sx={{p: 4}}>
        <Onboarding>
          <SignUpStep stepName={'Account creation'}/>
          {...Children.toArray(children)}
        </Onboarding>
      </PrimaryContainer>
      <Box
          component="img"
          src="/yunderaLogo.svg"
          alt="Logo"
          sx={{
              position: 'absolute',
              bottom: 16,        // px from bottom
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 'auto',
              zIndex: -1000,
              filter: 'drop-shadow(-1px 1px 2px rgba(0,0,0,0.3))',
          }}
      />
    </Stack>
  );
};

export const RegisterPagePath = '/register';