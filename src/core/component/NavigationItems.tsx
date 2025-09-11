import React from 'react';
import { Button, IconButton, Divider, Stack, Box, Menu, MenuItem } from '@mui/material';
import { 
  Language as LanguageIcon, 
  KeyboardTab, 
  Start, 
  PowerSettingsNew as PowerIcon,
  Dashboard as DashboardIcon,
  Translate as TranslateIcon
} from '@mui/icons-material';
import {
  DashboardMenuItem,
  MenuItemLink,
  useSidebarState,
  useTranslate,
  LocalesMenuButton,
  useLogout,
  useLocaleState,
} from 'react-admin';
import { Link } from 'react-router-dom';
import type { PanelInterface } from "../PanelInterface";
import { UserProfileButton } from './UserProfileButton';

interface NavigationItemsProps {
  panels: PanelInterface[];
  variant: 'sidebar' | 'sidebar-logout' | 'mobile';
  dense?: boolean;
}

export const NavigationItems: React.FC<NavigationItemsProps> = ({ 
  panels, 
  variant, 
  dense = false 
}) => {
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

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLanguageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    handleLanguageMenuClose();
  };

  // Use the actual Material-UI Translate icon (the proper translation symbol)
  const CustomTranslationIcon = () => (
    <TranslateIcon sx={{ fontSize: '2.5rem' }} />
  );

  // Create shared navigation list: Dashboard + all panels
  const createSharedNavigationList = () => {
    const dashboardItem = {
      name: 'dashboard',
      icon: DashboardIcon,
      path: '/',
      displayName: translate('ra.page.dashboard')
    };

    const panelItems = panels.map(panel => ({
      name: panel.name,
      icon: panel.icon,
      path: `/${panel.name}`,
      displayName: translate(`resources.${panel.name}.name`, { smart_count: 2 })
    }));
    return [dashboardItem, ...panelItems];
  };

  // Render individual navigation item with consistent styling
  const renderNavigationItem = (item: any) => {
    const ItemIcon = item.icon;

    if (variant === 'mobile') {
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
            fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller text on very small screens
            padding: { xs: '6px 12px', sm: '8px 16px' }, // Smaller padding on very small screens
            minWidth: { xs: 'auto', sm: '120px' }, // Flexible width on small screens
            flex: { xs: '1 1 auto', sm: '0 0 auto' }, // Flex on small screens to distribute evenly
            maxWidth: { xs: 'calc(50% - 4px)', sm: 'none' } // Max 2 per row on very small screens
          }}
        >
          {item.displayName}
        </Button>
      );
    }

    // Single renderer for both collapsed and expanded states
    return (
      <Button
        key={item.name}
        component={Link}
        to={item.path}
        startIcon={delayedOpen ? <ItemIcon sx={{ fontSize: '2.5rem' }} /> : undefined}
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
        {delayedOpen ? item.displayName : <ItemIcon sx={{ fontSize: '2.5rem' }} />}
      </Button>
    );
  };

  if (variant === 'mobile') {
    const navigationList = createSharedNavigationList();
    
    return (
      <>
        {/* Main Navigation Panel */}
        <Box sx={{ 
          border: `2px solid currentColor`,
          borderRadius: '32px',
          padding: 2,
          marginTop: 2,
          backgroundColor: 'background.paper',
          boxShadow: `-2px 2px 5px rgba(39,170,225,0.3), 2px 2px 5px currentColor33`,
          borderColor: 'primary.main',
        }}>
          <Stack spacing={2}>
            {/* Profile Button */}
            <UserProfileButton variant="mobile" />
            
            {/* Shared Navigation List (Dashboard + Panels) */}
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ width: '100%' }}>
              {navigationList.map(item => renderNavigationItem(item))}
            </Stack>

            <Divider />

            {/* Language Selection and Logout */}
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
                    '& .MuiSvgIcon-root': {
                      fontSize: '1rem',
                    }
                  },
                  '&.MuiButton-root': {
                    textTransform: 'none',
                  }
                }}
              >
                {translate('ra.auth.logout')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </>
    );
  }

  // Sidebar logout variant - only show logout button
  if (variant === 'sidebar-logout') {
    return delayedOpen ? (
      <Button
        startIcon={<PowerIcon sx={{ fontSize: '2.5rem !important' }} />}
        onClick={handleLogout}
        color="error"
        sx={{
          width: '100%',
          height: '56px',
          justifyContent: 'flex-start',
          textTransform: 'none',
          padding: '12px 12px', // Reduced padding to minimize white space
          borderRadius: '28px', // 28px border radius
          fontSize: '1.2rem',
          lineHeight: '1 !important',
          minWidth: 'auto', // Remove default minimum width
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
        {translate('ra.auth.logout')}
      </Button>
    ) : (
      <IconButton 
        onClick={handleLogout}
        color="error"
        sx={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '28px', // 28px border radius
          margin: '0 auto', // Center the button
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: theme => theme.palette.error.main + '22',
          },
        }}
      >
        <PowerIcon sx={{ fontSize: '2.5rem !important' }} />
      </IconButton>
    );
  }

  // Sidebar variant
  const navigationList = createSharedNavigationList();
  
  return (
    <Stack spacing={0}>
      {/* Profile Button */}
      <UserProfileButton variant="sidebar" delayedOpen={delayedOpen} />

      {/* Shared Navigation List (Dashboard + Panels) */}
      {navigationList.map(item => renderNavigationItem(item))}

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Language Selection */}
      <Button
        onClick={handleLanguageMenuClick}
        startIcon={delayedOpen ? <CustomTranslationIcon /> : undefined}
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
          color: theme => theme.palette.text.primary,
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
        {delayedOpen ? (locale === 'en' ? 'English' : locale) : <CustomTranslationIcon />}
      </Button>
      
      {/* Language Menu */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={() => handleLocaleChange('en')}>English</MenuItem>
        {/* Add more languages as needed */}
      </Menu>

      {/* Expand/Collapse Button */}
      <Button
        startIcon={delayedOpen ? <KeyboardTab sx={{ fontSize: '2.5rem', transform: 'rotate(180deg)' }} /> : undefined}
        onClick={handleToggleSidebar}
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
          color: theme => theme.palette.text.primary,
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
        {delayedOpen ? 'Reduce' : <Start sx={{ fontSize: '2.5rem' }} />}
      </Button>
    </Stack>
  );
};