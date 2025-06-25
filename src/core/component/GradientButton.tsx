import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

// no custom props needed here, since we're always styling the same thing
const GradientButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: '36px',
  boxShadow: 'none',
  fontSize: '0.9rem',
  backgroundImage: `linear-gradient(
    150deg,
    ${theme.palette.primary.light},
    ${theme.palette.secondary.light} 100%
  )`,
  color: "#ffffff",
  '&:hover': {
    backgroundImage: `linear-gradient(
      150deg,
      ${theme.palette.primary.dark},
      ${theme.palette.secondary.dark} 100%
    )`,
  },
}));

export default GradientButton;
