import { styled } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';

const GradientCard = styled(Card)<CardProps>(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',           // allow the pseudo-element to show outside
  borderRadius: '30px',
  minWidth: 300,
  marginTop: '6em',
  boxShadow: '2px 2px 20px rgba(39,170,225,0.3)',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 'inherit',
    background: `linear-gradient(
      150deg,
      ${theme.palette.primary.light},
      ${theme.palette.secondary.light} 100%
    )`,
    zIndex: -1,
  },
}));

export default GradientCard;
