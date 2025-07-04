import React from 'react';
import Box from '@mui/material/Box';
import { useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  type MenuProps,
  useSidebarState,
} from 'react-admin';
import type {PanelInterface} from "../PanelInterface";
import { NavigationItems } from "../component/NavigationItems";

const MenuPanel = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '32px',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: `-2px 2px 5px rgba(39,170,225,0.3), 2px 2px 5px ${theme.palette.primary.main}33`,
  minHeight: '200px', // Fixed minimum height to prevent height changes
  display: 'flex',
  flexDirection: 'column',
  overflow: 'clip',
  
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
  borderRadius: '50px',
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  boxShadow: `-2px 2px 5px rgba(39,170,225,0.3), 2px 2px 5px ${theme.palette.secondary.main}33`,
  minHeight: '80px', // Fixed minimum height for logout panel
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'clip',
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5),
    borderRadius: '40px',
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    borderRadius: '30px',
    borderWidth: '1px',
    boxShadow: `-1px 1px 3px rgba(39,170,225,0.2), 1px 1px 3px ${theme.palette.secondary.main}22`,
  },
}));


export const Menu = (panels: PanelInterface[]) => ({ dense = false }: MenuProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [collapsed] = useSidebarState();

    // Dynamically adjust content margin based on sidebar state
    React.useEffect(() => {
        const margin = collapsed ? '0.5em' : '1.75em';
        document.documentElement.style.setProperty('--sidebar-content-margin', margin);
    }, [collapsed]);

    // Mobile: Hide sidebar completely - navigation will be in Dashboard panels
    if (isMobile) {
        return null;
    }

    // Desktop sidebar behavior
    return (
        <Box
            sx={{
                width: collapsed ? 280 : 130,
                padding: 2, 
                margin: 0, 
                position: 'fixed', 
                left: 0, 
                top: 0, 
                height: '100vh', 
                zIndex: 1200,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <MenuPanel>
                <NavigationItems 
                    panels={panels} 
                    variant="sidebar" 
                    dense={dense} 
                />
            </MenuPanel>

            {/* Logout handled by NavigationItems, but keeping separate panel styling */}
            <LogoutPanel>
                <NavigationItems 
                    panels={[]} 
                    variant="sidebar-logout" 
                    dense={dense} 
                />
            </LogoutPanel>
        </Box>
    );
};

