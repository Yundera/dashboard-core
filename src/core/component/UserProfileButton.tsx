import React from 'react';
import { Button, Avatar } from '@mui/material';
import { AccountCircle as PersonIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useGetIdentity } from './useGetIdentity';
import { useTranslate } from 'react-admin';
import { NavButton } from './NavButton';

interface UserProfileButtonProps {
  variant: 'sidebar' | 'mobile';
  delayedOpen?: boolean;
}

export const UserProfileButton: React.FC<UserProfileButtonProps> = ({
  variant,
  delayedOpen = true,
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
          sx={{ width: size, height: size, fontSize: `${size * 0.4}px` }}
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

  return (
    <NavButton
      isOpen={delayedOpen}
      icon={renderAvatar(40)}
      label={displayName}
      component={Link}
      to="/settings"
    />
  );
};
