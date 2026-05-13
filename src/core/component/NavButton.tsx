import React, { ReactNode } from 'react';
import { Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

type NavButtonColor = 'info' | 'text' | 'error';
type NavButtonVariant = 'default' | 'logout';

interface NavButtonProps {
  isOpen: boolean;
  icon: ReactNode;
  label: string;
  variant?: NavButtonVariant;
  color?: NavButtonColor;
  component?: React.ElementType;
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const colorSx = (color: NavButtonColor): SxProps<Theme> => ({
  color: theme =>
    color === 'info'
      ? theme.palette.info.main
      : color === 'error'
        ? theme.palette.error.main
        : theme.palette.text.primary,
});

export const NavButton: React.FC<NavButtonProps> = ({
  isOpen,
  icon,
  label,
  variant = 'default',
  color = 'info',
  component,
  to,
  onClick,
}) => {
  const isLogout = variant === 'logout';
  const height = isLogout ? '56px' : '64px';
  const borderRadius = isLogout ? '28px' : '16px';
  const padding = isOpen
    ? (isLogout ? '12px 12px' : '16px 12px')
    : (isLogout ? '0' : '16px 0');

  return (
    <Button
      component={component as React.ElementType}
      to={to}
      onClick={onClick}
      startIcon={isOpen ? icon : undefined}
      sx={{
        width: isOpen ? '100%' : '56px',
        height: `${height} !important`,
        justifyContent: isOpen ? 'flex-start' : 'center',
        textTransform: 'none',
        padding,
        borderRadius,
        fontSize: '1.2rem',
        lineHeight: '1 !important',
        marginBottom: isLogout ? undefined : '4px',
        marginLeft: isOpen ? undefined : 'auto',
        marginRight: isOpen ? undefined : 'auto',
        minWidth: 'auto',
        display: 'flex',
        alignItems: 'center',
        ...colorSx(color),
        '&:hover': {
          backgroundColor: theme => theme.palette.action.hover,
        },
        '& .MuiSvgIcon-root': { fontSize: '2.5rem' },
      }}
    >
      {isOpen ? label : icon}
    </Button>
  );
};
