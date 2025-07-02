import Box from '@mui/material/Box';
import { Button, IconButton, Divider, Stack } from '@mui/material';
import { Person as PersonIcon, Language as LanguageIcon, ChevronLeft, ChevronRight, Logout as LogoutIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import {
  DashboardMenuItem,
  MenuItemLink,
  type MenuProps,
  useSidebarState,
  useTranslate,
  LocalesMenuButton,
  useLogout,
} from 'react-admin';
import { Link } from 'react-router-dom';
import type {PanelInterface} from "../PanelInterface";

const MenuPanel = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '32px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: `-2px 2px 5px rgba(39,170,225,0.3), 2px 2px 5px ${theme.palette.primary.main}33`,
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5),
    borderRadius: '24px',
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    borderRadius: '20px',
    borderWidth: '1px',
    boxShadow: `-1px 1px 3px rgba(39,170,225,0.2), 1px 1px 3px ${theme.palette.primary.main}22`,
  },
}));

const LogoutPanel = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: `2px solid ${theme.palette.secondary.main}`,
  borderRadius: '32px',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: `-2px 2px 5px rgba(39,170,225,0.3), 2px 2px 5px ${theme.palette.secondary.main}33`,
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5),
    borderRadius: '24px',
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    borderRadius: '20px',
    borderWidth: '1px',
    boxShadow: `-1px 1px 3px rgba(39,170,225,0.2), 1px 1px 3px ${theme.palette.secondary.main}22`,
  },
}));

const MenuButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(0.5),
  borderRadius: '16px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child': {
    marginBottom: 0,
  }
}));

const MenuItem = (panel: PanelInterface, dense: boolean,translate:any) => {
    return <MenuItemLink
        key = {panel.name}
        to={{
            pathname: '/' + panel.name
        }}
        primaryText={translate(`resources.` + panel.name + `.name`, {
            smart_count: 2,
        })}
        leftIcon={<panel.icon/>}
        dense={dense}
    />
}

export const Menu = (panels: PanelInterface[]) => ({ dense = false }: MenuProps) => {
    const translate = useTranslate();
    const [open, setOpen] = useSidebarState();
    const logout = useLogout();

    const handleToggleSidebar = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            sx={{
                width: open ? 280 : 80,
                padding: 2,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <MenuPanel>
                <Stack spacing={0}>
                    {/* Profile Button */}
                    {open ? (
                        <Link to="/settings" style={{ textDecoration: 'none' }}>
                            <MenuButton
                                startIcon={<PersonIcon />}
                            >
                                {translate('ra.auth.user_menu')}
                            </MenuButton>
                        </Link>
                    ) : (
                        <Link to="/settings" style={{ textDecoration: 'none' }}>
                            <IconButton 
                                sx={{ width: '100%', height: '48px', mb: 0.5, borderRadius: '16px' }}
                            >
                                <PersonIcon />
                            </IconButton>
                        </Link>
                    )}

                    {/* Dashboard */}
                    <DashboardMenuItem />

                    {/* Dynamic Panel Items */}
                    {panels.map(value => {
                        return MenuItem(value, dense, translate);
                    })}

                    {/* Divider */}
                    <Divider sx={{ my: 2 }} />

                    {/* Language Selection */}
                    {open ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LanguageIcon sx={{ mr: 1 }} />
                            <LocalesMenuButton />
                        </Box>
                    ) : (
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                            <LocalesMenuButton />
                        </Box>
                    )}

                    {/* Expand/Collapse Button */}
                    {open ? (
                        <MenuButton
                            startIcon={<ChevronLeft />}
                            onClick={handleToggleSidebar}
                        >
                            {translate('ra.action.close', { _: 'Collapse' })}
                        </MenuButton>
                    ) : (
                        <IconButton 
                            onClick={handleToggleSidebar}
                            sx={{ width: '100%', height: '48px', borderRadius: '16px' }}
                        >
                            <ChevronRight />
                        </IconButton>
                    )}
                </Stack>
            </MenuPanel>

            {/* Logout Panel */}
            <LogoutPanel>
                {open ? (
                    <MenuButton
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        color="error"
                    >
                        {translate('ra.auth.logout')}
                    </MenuButton>
                ) : (
                    <IconButton 
                        onClick={handleLogout}
                        color="error"
                        sx={{ width: '100%', height: '48px', borderRadius: '16px' }}
                    >
                        <LogoutIcon />
                    </IconButton>
                )}
            </LogoutPanel>
        </Box>
    );
};

