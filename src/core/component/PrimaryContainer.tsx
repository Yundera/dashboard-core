// src/core/component/PrimaryContainer.tsx
import { styled } from '@mui/material/styles';
import Container, { ContainerProps } from '@mui/material/Container';

const PrimaryContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  borderRadius: '30px',
  boxShadow: '2px 2px 20px rgba(39,170,225,0.3)',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
}));

export default PrimaryContainer;
