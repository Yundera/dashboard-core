// SignUpStep.tsx
import {Box, CircularProgress, Stack, TextField, Typography, IconButton, InputAdornment, Checkbox, FormControlLabel, Link, Button, Alert} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useNotify} from 'react-admin';
import {useAuthProvider} from '../useAuthProvider';
import LoadingButton from '../LoadingButton';
import { useGlobalLoading } from '../GlobalLoadingContext';
import React, {useEffect, useState, useRef} from 'react';
import {notifyError} from "../NotifyError";
import {Visibility, VisibilityOff} from '@mui/icons-material';

interface UserInput {
  email: string;
  password: string;
  termsAccepted: boolean;
}

interface SignUpStepProps {
  onNext?: () => void;
  stepName?: string;
}

export const SignUpStep = ({ onNext = (() => {}) }: SignUpStepProps) => {

  const { register, handleSubmit, formState: { isValid } } = useForm<UserInput>({ 
    mode: 'onChange',
    defaultValues: { termsAccepted: false }
  });
  const authProvider = useAuthProvider();
  const notify = useNotify();
  const globalLoading = useGlobalLoading();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const prevGlobalLoadingRef = useRef(false);

  const handleNext = async (data: UserInput) => {
    setLoading(true);
    try {
      await authProvider.registerUser(data.email, data.password);
      await authProvider.login({ username: data.email, password: data.password });
      onNext?.();
    } catch (error) {
      console.error("Account creation error:", error);
      notifyError(error, 'Sign-up failed', notify);
      setLoading(false); // This triggers LoadingButton to hide global loading
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    //auto next if already logged in
    (async () => {
      let identity = await authProvider.getIdToken();
      if(identity && identity !== "anonymous") {
        onNext();
      } else {
        setInitialLoading(false);
      }
    })();
  }, []);

  // Handle continue click from global loading context
  React.useEffect(() => {
    // Only proceed if loading transitioned from true to false (user clicked Continue)
    const wasGlobalLoading = prevGlobalLoadingRef.current;
    const isCurrentlyLoading = globalLoading.isLoading;
    
    // Update ref for next render
    prevGlobalLoadingRef.current = isCurrentlyLoading;
    
    // Detect transition: was loading -> now not loading (user clicked Continue)
    if (wasGlobalLoading && !isCurrentlyLoading && !loading && !initialLoading) {
      onNext();
    }
  }, [globalLoading.isLoading, loading, initialLoading]);

  if(initialLoading) {
    return <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh"
      >
        <CircularProgress />
      </Box>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create your account</Typography>
      <form onSubmit={handleSubmit(handleNext)}>
        <TextField
          {...register('email', {required: true})}
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
        />
        <br/>
        <br/>
        <TextField
          {...register('password', {required: true})}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <br/>
        <FormControlLabel
          control={
            <Checkbox
              {...register('termsAccepted', { required: true })}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <Link
                href="http://yundera.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                Terms and Conditions
              </Link>
            </Typography>
          }
        />
        <Stack direction="row" spacing={2} mt={2}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            disabled={!isValid}
            fullWidth
            useGlobalOverlay={true}
            loadingTitle="Creating your account..."
            loadingSubtitle="Setting up your secure authentication and preparing your dashboard."
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              borderRadius: '36px',
              boxShadow: 'none',
            }}
          >
            Next
          </LoadingButton>
        </Stack>
      </form>
    </Stack>
  );
};
