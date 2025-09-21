import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';

// Card personalizado con estilos mejorados
const StyledCard = styled(MuiCard)(({ theme, variant }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'all 0.3s ease-in-out',
  ...(variant === 'elevated' && {
    boxShadow: theme.shadows[4],
    '&:hover': {
      boxShadow: theme.shadows[8],
      transform: 'translateY(-2px)',
    },
  }),
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: theme.shadows[2],
    },
  }),
}));

const Card = ({ 
  children, 
  title, 
  subtitle, 
  action, 
  variant = 'default',
  sx = {},
  ...props 
}) => {
  return (
    <StyledCard variant={variant} sx={sx} {...props}>
      {(title || subtitle || action) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={action}
          titleTypographyProps={{
            variant: 'h6',
            fontWeight: 600,
          }}
          subheaderTypographyProps={{
            variant: 'body2',
            color: 'text.secondary',
          }}
        />
      )}
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
};

export default Card;
