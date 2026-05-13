import React from 'react';
import { Button, Divider, Stack, Box, Menu, MenuItem } from '@mui/material';
import {
  KeyboardTab,
  Start,
  PowerSettingsNew as PowerIcon,
  Dashboard as DashboardIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import {
  useSidebarState,
  useTranslate,
  LocalesMenuButton,
  useLogout,
  useLocaleState,
} from 'react-admin';
import { Link } from 'react-router-dom';
import type { PanelInterface } from '../PanelInterface';
import { UserProfileButton } from './UserProfileButton';
import { NavButton } from './NavButton';

interface NavigationItemsProps {
  panels: PanelInterface[];
  variant: 'sidebar' | 'sidebar-logout' | 'mobile';
  dense?: boolean;
}

export const NavigationItems: React.FC<NavigationItemsProps> = ({ panels, variant }) => {
  const translate = useTranslate();
  const [open, setOpen] = useSidebarState();
  const logout = useLogout();
  const [locale, setLocale] = useLocaleState();
  const [languageMenuAnchor, setLanguageMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [delayedOpen, setDelayedOpen] = React.useState(open);

  // Delay the open state change to match sidebar animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedOpen(open);
    }, open ? 0 : 200); // Delay when closing, immediate when opening

    return () => clearTimeout(timer);
  }, [open]);

  const handleToggleSidebar = () => setOpen(!open);
  const handleLogout = () => logout();
  const handleLanguageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };
  const handleLanguageMenuClose = () => setLanguageMenuAnchor(null);
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    handleLanguageMenuClose();
  };

  const navigationList = [
    { name: 'dashboard', icon: DashboardIcon, path: '/', displayName: translate('ra.page.dashboard') },
    ...panels.map(panel => ({
      name: panel.name,
      icon: panel.icon,
      path: `/${panel.name}`,
      displayName: translate(`resources.${panel.name}.name`, { smart_count: 2 }),
    })),
  ];

  if (variant === 'mobile') {
    return (
      <Box
        sx={{
          border: '2px solid currentColor',
          borderRadius: '32px',
          padding: 2,
          marginTop: 2,
          backgroundColor: 'background.paper',
          boxShadow: '-2px 2px 5px rgba(39,170,225,0.3), 2px 2px 5px currentColor33',
          borderColor: 'primary.main',
        }}
      >
        <Stack spacing={2}>
          <UserProfileButton variant="mobile" />

          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ width: '100%' }}>
            {navigationList.map(item => {
              const ItemIcon = item.icon;
              return (
                <Button
                  key={item.name}
                  startIcon={<ItemIcon />}
                  variant="outlined"
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: '16px',
                    textTransform: 'none',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '6px 12px', sm: '8px 16px' },
                    minWidth: { xs: 'auto', sm: '120px' },
                    flex: { xs: '1 1 auto', sm: '0 0 auto' },
                    maxWidth: { xs: 'calc(50% - 4px)', sm: 'none' },
                  }}
                >
                  {item.displayName}
                </Button>
              );
            })}
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <LocalesMenuButton />
            <Button
              startIcon={<PowerIcon />}
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{
                borderRadius: '50px',
                padding: '6px 12px',
                minWidth: 'auto',
                height: 'auto',
                fontSize: '0.75rem',
                fontWeight: '500',
                lineHeight: '1.2',
                '& .MuiButton-startIcon': {
                  marginRight: '4px',
                  marginLeft: '0',
                  '& .MuiSvgIcon-root': { fontSize: '1rem' },
                },
                '&.MuiButton-root': { textTransform: 'none' },
              }}
            >
              {translate('ra.auth.logout')}
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  if (variant === 'sidebar-logout') {
    return (
      <NavButton
        isOpen={delayedOpen}
        icon={<PowerIcon />}
        label={translate('ra.auth.logout')}
        variant="logout"
        color="error"
        onClick={handleLogout}
      />
    );
  }

  // Sidebar variant
  return (
    <Stack spacing={0}>
      <UserProfileButton variant="sidebar" delayedOpen={delayedOpen} />

      {navigationList.map(item => {
        const ItemIcon = item.icon;
        return (
          <NavButton
            key={item.name}
            isOpen={delayedOpen}
            icon={<ItemIcon />}
            label={item.displayName}
            component={Link}
            to={item.path}
          />
        );
      })}

      <Divider sx={{ my: 2 }} />

      <NavButton
        isOpen={delayedOpen}
        icon={<TranslateIcon />}
        label={locale === 'en' ? 'English' : locale}
        color="text"
        onClick={handleLanguageMenuClick}
      />

      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={() => handleLocaleChange('en')}>English</MenuItem>
      </Menu>

      <NavButton
        isOpen={delayedOpen}
        icon={
          delayedOpen
            ? <KeyboardTab sx={{ transform: 'rotate(180deg)' }} />
            : <Start />
        }
        label="Reduce"
        color="text"
        onClick={handleToggleSidebar}
      />
    </Stack>
  );
};
