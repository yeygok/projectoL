import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  showDivider = true,
  // Props adicionales para compatibilidad
  icon,
  onAdd,
  onRefresh,
  loading = false,
  addButtonText = "Nuevo",
  refreshButtonText = "Actualizar",
}) => {
  const navigate = useNavigate();

  // Crear actions automáticamente si se pasan los props individuales
  const computedActions = [
    ...actions,
    ...(onAdd ? [{
      label: addButtonText,
      variant: 'contained',
      color: 'primary',
      onClick: onAdd,
      disabled: loading
    }] : []),
    ...(onRefresh ? [{
      label: refreshButtonText,
      variant: 'outlined',
      onClick: onRefresh,
      disabled: loading
    }] : [])
  ];

  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => handleBreadcrumbClick('/dashboard')}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={index} color="text.primary">
                {breadcrumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {breadcrumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Header Content */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2 
      }}>
        {/* Title and Subtitle */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon && (
              <Box sx={{ color: 'primary.main' }}>
                {icon}
              </Box>
            )}
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                wordBreak: 'break-word',
                mb: 0
              }}
            >
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        {computedActions.length > 0 && (
          <Stack 
            direction="row" 
            spacing={1}
            sx={{ flexShrink: 0 }}
          >
            {computedActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outlined'}
                color={action.color || 'primary'}
                size={action.size || 'medium'}
                startIcon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
                sx={action.sx}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>

      {/* Divider */}
      {showDivider && (
        <Divider sx={{ mt: 3 }} />
      )}
    </Box>
  );
};

export default PageHeader;
