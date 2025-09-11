import React from 'react';
import { Button, IconButton, Avatar } from '@mui/material';
import { AccountCircle as PersonIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useGetIdentity } from './useGetIdentity';
import { useTranslate } from 'react-admin';

interface UserProfileButtonProps {
  variant: 'sidebar' | 'mobile';
  delayedOpen?: boolean;
}

export const UserProfileButton: React.FC<UserProfileButtonProps> = ({ 
  variant, 
  delayedOpen = true 
}) => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();
  
  const displayName = identity?.fullName || translate('ra.auth.user_menu');
  const avatarSrc = identity?.avatar;

  const renderAvatar = (size: number) => {
    if (avatarSrc) {
      return (
        <Avatar 
          src={avatarSrc} 
          sx={{ 
            width: size, 
            height: size,
            fontSize: `${size * 0.4}px`
          }}
        >
          {identity?.fullName?.charAt(0)?.toUpperCase()}
        </Avatar>
      );
    }
    return <PersonIcon sx={{ fontSize: `${size}px` }} />;
  };

  if (variant === 'mobile') {
    return (
      <Button
        startIcon={renderAvatar(24)}
        variant="outlined"
        component={Link}
        to="/settings"
        sx={{ borderRadius: '16px' }}
      >
        {displayName}
      </Button>
    );
  }

  // Sidebar variant
  return (
    <Button
      component={Link}
      to="/settings"
      startIcon={delayedOpen ? renderAvatar(40) : undefined}
      sx={{
        width: delayedOpen ? '100%' : '56px',
        height: '64px !important',
        justifyContent: delayedOpen ? 'flex-start' : 'center',
        textTransform: 'none',
        padding: delayedOpen ? '16px 12px' : '16px 0',
        borderRadius: '16px',
        fontSize: '1.2rem',
        lineHeight: '1 !important',
        marginBottom: '4px',
        marginLeft: delayedOpen ? undefined : 'auto',
        marginRight: delayedOpen ? undefined : 'auto',
        minWidth: 'auto',
        display: 'flex',
        alignItems: 'center',
        color: theme => theme.palette.info.main,
        '&:hover': {
          backgroundColor: theme => theme.palette.action.hover,
        },
        '& .MuiButton-startIcon': {
          '& .MuiSvgIcon-root': {
            fontSize: '2.5rem !important',
          },
        },
      }}
    >
      {delayedOpen ? displayName : renderAvatar(40)}
    </Button>
  );
};