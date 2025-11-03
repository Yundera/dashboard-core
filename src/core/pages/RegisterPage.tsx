import {Onboarding} from "../component/onboarding/Onboarding";
import {SignUpStep} from "../component/onboarding/SignUpStep";
import {GlobalLoadingProvider} from "../component/GlobalLoadingContext";
import {Box, Stack, Typography, useTheme} from "@mui/material";
import {useConfigurationContext} from "../configuration/ConfigurationContext";
import {Children, ReactElement} from "react";
import {OnboardingStepProps} from "../component/onboarding/OnboardingStep";

import PrimaryContainer from "../component/PrimaryContainer";
import { getConfig } from "../configuration/getConfigFrontEnd";

interface RegisterPageProps {
  children: ReactElement<OnboardingStepProps> | ReactElement<OnboardingStepProps>[];
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ children }) => {  // Add children prop here
  const {logo, title} = useConfigurationContext();
  const theme = useTheme();

  return (
    <GlobalLoadingProvider>
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
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          zIndex: -1000,
          '@media (max-width: 600px)': {
            position: 'relative',
            left: 'auto',
            transform: 'none',
            bottom: 'auto',
            marginTop: 3,
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1,
          },
        }}
      >
        <Box
          component="img"
          src={`${getConfig("BASE_PATH")}/yunderaLogo.svg`}
          alt="Logo"
          sx={{
            width: 120,
            height: 'auto',
            filter: 'drop-shadow(-1px 1px 2px rgba(0,0,0,0.3))',
            '@media (max-width: 600px)': {
              width: 80,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            '@media (max-width: 600px)': {
              alignItems: 'center',
              textAlign: 'center',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            Need help?
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.3,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              +33 6-44-69-69-15
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              contact@yundera.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Stack>
    </GlobalLoadingProvider>
  );
};

export const RegisterPagePath = '/register';