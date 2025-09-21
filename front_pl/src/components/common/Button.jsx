import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Botón personalizado con variantes adicionales
const StyledButton = styled(MuiButton)(({ theme, customvariant }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  padding: '10px 20px',
  transition: 'all 0.2s ease-in-out',
  
  ...(customvariant === 'gradient' && {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    color: 'white',
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4],
    },
  }),
  
  ...(customvariant === 'success' && {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  }),
  
  ...(customvariant === 'warning' && {
    backgroundColor: theme.palette.warning.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  }),
  
  ...(customvariant === 'error' && {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),
}));

const Button = ({ 
  children, 
  loading = false, 
  customvariant,
  startIcon,
  endIcon,
  ...props 
}) => {
  return (
    <StyledButton
      customvariant={customvariant}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      endIcon={!loading ? endIcon : null}
      disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
