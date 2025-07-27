import {Onboarding} from "../component/onboarding/Onboarding";
import {SignUpStep} from "../component/onboarding/SignUpStep";
import {TryBeforeBuyStep} from "../component/onboarding/TryBeforeBuyStep";
import {Box, Stack, Typography, useTheme} from "@mui/material";
import {useConfigurationContext} from "../configuration/ConfigurationContext";
import {Children, ReactElement, useState} from "react";
import {OnboardingStepProps} from "../component/onboarding/OnboardingStep";

import PrimaryContainer from "../component/PrimaryContainer";
import { getConfig } from "../configuration/getConfigFrontEnd";

interface RegisterPageProps {
  children: ReactElement<OnboardingStepProps> | ReactElement<OnboardingStepProps>[];
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ children }) => {  // Add children prop here
  const {logo, title} = useConfigurationContext();
  const theme = useTheme();
  const [showTryBeforeBuy, setShowTryBeforeBuy] = useState(true);

  const handleTryDemo = () => {
    window.open('https://demo.nsl.sh', '_blank', 'noopener,noreferrer');
  };

  const handleBuyYundera = () => {
    setShowTryBeforeBuy(false);
  };

  return (
    <>
      <Stack
        sx={{
          minHeight: '100vh',
          p: 2,
          justifyContent: 'center',
          alignItems: 'center',
          '@media (max-width: 600px)': {
            p: 0,
            justifyContent: 'flex-start',
            paddingTop: '10vh',
          },
        }}
      >
      <Stack direction="row" alignItems="center" gap={1} sx={{
        mb: 4,
        '@media (max-width: 600px)': {
          mb: 3,
          flexDirection: 'column',
          gap: 0.5,
        },
      }}>
        <img src={logo} alt={title} width={50}/>
        <Typography component="span" variant="h5" sx={{
          '@media (max-width: 600px)': {
            fontSize: '1.1rem',
            fontWeight: 600,
            textAlign: 'center',
          },
        }}>{title}</Typography>
      </Stack>
      <PrimaryContainer sx={{
        p: 4,
        '@media (max-width: 600px)': {
          p: 1.5,
          width: '95%',
          maxWidth: '95%',
          margin: '0 auto',
          boxShadow: 'none',
        },
      }}>
        <Onboarding>
          <SignUpStep stepName={'Account creation'}/>
          {...Children.toArray(children)}
        </Onboarding>
      </PrimaryContainer>
      <Box
          component="img"
          src={`${getConfig("BASE_PATH")}/yunderaLogo.svg`}
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
              '@media (max-width: 600px)': {
                display: 'none',
              },
          }}
      />
    </Stack>
      <TryBeforeBuyStep
        open={showTryBeforeBuy}
        onTryDemo={handleTryDemo}
        onBuyYundera={handleBuyYundera}
      />
    </>
  );
};

export const RegisterPagePath = '/register';