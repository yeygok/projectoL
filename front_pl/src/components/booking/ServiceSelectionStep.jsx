import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { getCategoriaImage } from './bookingUtils';

/**
 * Componente para el paso 1: Selección de Servicio.
 * Muestra las categorías disponibles en tarjetas interactivas.
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.categorias - Lista de categorías de servicio
 * @param {number|null} props.selectedCategoriaId - ID de la categoría seleccionada
 * @param {Function} props.onSelect - Función para seleccionar una categoría
 * @returns {JSX.Element} Componente del paso de selección
 */
export function ServiceSelectionStep({ categorias, selectedCategoriaId, onSelect }) {
  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: 'primary.main',
        }}
      >
        ¿Qué deseas limpiar?
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mb: 5 }}
      >
        Selecciona el servicio que necesitas
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {categorias.map((categoria) => (
          <Grid item xs={12} sm={6} md={6} key={categoria.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: selectedCategoriaId === categoria.id ? 3 : 2,
                borderColor: selectedCategoriaId === categoria.id ? 'primary.main' : 'grey.200',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                height: '100%',
                boxShadow: selectedCategoriaId === categoria.id
                  ? '0 12px 40px rgba(25, 118, 210, 0.3)'
                  : '0 4px 12px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-12px) scale(1.02)',
                  boxShadow: '0 20px 60px rgba(25, 118, 210, 0.25)',
                  borderColor: 'primary.main',
                  '& .categoria-image': {
                    transform: 'scale(1.1)',
                  },
                  '& .categoria-overlay': {
                    opacity: 0.15,
                  },
                },
              }}
              onClick={() => onSelect(categoria.id)}
            >
              {/* Imagen con Overlay */}
              <Box sx={{ position: 'relative', overflow: 'hidden', height: 280 }}>
                <CardMedia
                  className="categoria-image"
                  component="img"
                  height="280"
                  image={getCategoriaImage(categoria.nombre)}
                  alt={categoria.nombre}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                />
                {/* Overlay Gradient */}
                <Box
                  className="categoria-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
                    opacity: 0.3,
                    transition: 'opacity 0.4s ease',
                  }}
                />

                {/* Check de Selección */}
                {selectedCategoriaId === categoria.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      bgcolor: 'success.main',
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(46, 125, 50, 0.5)',
                      animation: 'checkPulse 1s ease-in-out',
                      '@keyframes checkPulse': {
                        '0%': { transform: 'scale(0)', opacity: 0 },
                        '50%': { transform: 'scale(1.1)' },
                        '100%': { transform: 'scale(1)', opacity: 1 },
                      },
                    }}
                  >
                    <CheckIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                )}
              </Box>

              {/* Contenido */}
              <CardContent
                sx={{
                  bgcolor: 'white',
                  p: 3,
                  background: selectedCategoriaId === categoria.id
                    ? 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
                    : 'white',
                  transition: 'background 0.3s ease',
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: selectedCategoriaId === categoria.id ? 'primary.main' : 'text.primary',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {categoria.nombre}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ lineHeight: 1.6 }}
                >
                  {categoria.descripcion}
                </Typography>

                {/* Badge de Seleccionado */}
                {selectedCategoriaId === categoria.id && (
                  <Chip
                    label="Seleccionado"
                    color="primary"
                    size="small"
                    sx={{
                      mt: 2,
                      display: 'flex',
                      width: 'fit-content',
                      mx: 'auto',
                      fontWeight: 600,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}