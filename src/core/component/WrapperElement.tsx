import {Paper, useMediaQuery, useTheme} from '@mui/material';
import {NavigationItems} from './NavigationItems';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '1em',
        minHeight: '100%',
        minWidth: '100%',
    } as React.CSSProperties,
    paper: {
        padding: '2em',
        maxWidth: '800px',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
    } as React.CSSProperties,
};

interface DashboardContainerProps {
    children: React.ReactNode;
    panels?: any[];
}

export const PageContainer: React.FC<DashboardContainerProps> = ({ children, panels = [] }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div style={styles.container}>
            {isMobile && panels.length > 0 && (
                <NavigationItems panels={panels} variant="mobile" />
            )}
            <Paper style={styles.paper}>
                {children}
            </Paper>
        </div>
    );
};
