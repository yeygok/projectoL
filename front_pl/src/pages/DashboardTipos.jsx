import React from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';
import {
  Star as StarIcon,
  RateReview as ReviewIcon,
  Construction as DevelopmentIcon,
} from '@mui/icons-material';

const DashboardTipos = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <DevelopmentIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Sistema de Calificaciones
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
          Módulo en Desarrollo
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
          Este módulo permitirá a los clientes calificar los servicios recibidos 
          y a los administradores gestionar las reseñas y valoraciones del sistema.
        </Typography>
      </Paper>

      <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #667eea' }}>
          <StarIcon sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Calificaciones por Estrellas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistema de valoración de 1 a 5 estrellas para cada servicio
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #764ba2' }}>
          <ReviewIcon sx={{ fontSize: 50, color: '#764ba2', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Reseñas de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comentarios y opiniones detalladas sobre la experiencia del servicio
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #f093fb' }}>
          <DevelopmentIcon sx={{ fontSize: 50, color: '#f093fb', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Análisis de Satisfacción
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reportes y estadísticas sobre la calidad del servicio
          </Typography>
        </Paper>
      </Box>

      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body1" fontWeight="bold">
          📋 Próximamente disponible
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          • Sistema de calificación inmediata post-servicio
        </Typography>
        <Typography variant="body2">
          • Dashboard de análisis de satisfacción del cliente
        </Typography>
        <Typography variant="body2">
          • Gestión de respuestas a reseñas
        </Typography>
        <Typography variant="body2">
          • Integración con notificaciones por email
        </Typography>
      </Alert>
    </Box>
  );
};

export default DashboardTipos;
