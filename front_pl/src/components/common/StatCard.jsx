import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';

// Componente de estadística reutilizable
const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.5,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    transform: 'translate(30px, -30px)',
  },
}));

const StatsAvatar = styled(Avatar)(({ theme, color }) => ({
  width: 56,
  height: 56,
  backgroundColor: `rgba(255, 255, 255, 0.2)`,
  color: 'white',
  marginRight: theme.spacing(2),
}));

const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up':
      return <TrendingUp />;
    case 'down':
      return <TrendingDown />;
    default:
      return <TrendingFlat />;
  }
};

const getTrendColor = (trend) => {
  switch (trend) {
    case 'up':
      return '#4caf50';
    case 'down':
      return '#f44336';
    default:
      return '#ff9800';
  }
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary',
  gradient,
}) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    error: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
    info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  };

  return (
    <StatsContainer
      sx={{
        background: gradient || gradients[color],
      }}
    >
      <StatsAvatar color={color}>
        {icon}
      </StatsAvatar>
      <Box sx={{ flex: 1, zIndex: 1 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
          {title}
        </Typography>
        {(trend || subtitle) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: getTrendColor(trend),
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 8px',
                  borderRadius: 1,
                }}
              >
                {getTrendIcon(trend)}
                {trendValue && (
                  <Typography variant="caption" sx={{ ml: 0.5, color: 'inherit' }}>
                    {trendValue}
                  </Typography>
                )}
              </Box>
            )}
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </StatsContainer>
  );
};

export default StatCard;
