import Box from '@mui/material/Box';

import {
  DashboardMenuItem,
  MenuItemLink,
  type MenuProps,
  useSidebarState,
  useTranslate,
} from 'react-admin';
import type {PanelInterface} from "../PanelInterface";

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
    const [open] = useSidebarState();

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem />
            {panels.map(value => {
                return MenuItem(value, dense,translate);
            })}
        </Box>
    );
};

