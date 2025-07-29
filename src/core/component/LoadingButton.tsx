// LoadingButton.tsx
import {Button, type ButtonProps, CircularProgress} from '@mui/material';
import { useGlobalLoading } from './GlobalLoadingContext';
import { useEffect } from 'react';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  loadingTitle?: string;
  loadingSubtitle?: string;
  useGlobalOverlay?: boolean; // New prop to enable global loading
}

const LoadingButton = ({ 
  loading, 
  children, 
  disabled, 
  loadingTitle = "Processing...",
  loadingSubtitle = "Please wait while we complete your request.",
  useGlobalOverlay = false,
  ...props 
}: LoadingButtonProps) => {
  const globalLoading = useGlobalOverlay ? useGlobalLoading() : null;

  useEffect(() => {
    if (useGlobalOverlay && globalLoading) {
      if (loading) {
        // Show global loading overlay instead of button loading
        globalLoading.showLoading({
          title: loadingTitle,
          subtitle: loadingSubtitle,
          devMode: false,
        });
      } else {
        // Mark loading as complete instead of auto-hiding
        globalLoading.markLoadingComplete();
      }
    }
  }, [loading, useGlobalOverlay, globalLoading, loadingTitle, loadingSubtitle]);

  if (useGlobalOverlay) {
    // Don't show loading in button when using global overlay
    return (
      <Button
        {...props}
        disabled={disabled || loading}
      >
        {children}
      </Button>
    );
  }

  // Original behavior for backward compatibility
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : null}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

export default LoadingButton;
