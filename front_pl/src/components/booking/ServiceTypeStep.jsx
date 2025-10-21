import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { Star as StarIcon, CheckCircle as CheckIcon } from '@mui/icons-material';

/**
 * Componente para el paso 2: Selección del Tipo de Servicio.
 * Muestra los tipos disponibles (Sencillo, Premium, Gold) en tarjetas.
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.tiposServicio - Lista de tipos de servicio
 * @param {number|null} props.selectedTipoId - ID del tipo seleccionado
 * @param {Function} props.onSelect - Función para seleccionar un tipo
 * @returns {JSX.Element} Componente del paso de tipo de servicio
 */
export function ServiceTypeStep({ tiposServicio, selectedTipoId, onSelect }) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Selecciona el tipo de servicio
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {tiposServicio.map((tipo) => (
          <Grid item xs={12} md={4} key={tipo.id}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: selectedTipoId === tipo.id ? 3 : 1,
                borderColor: selectedTipoId === tipo.id ? 'primary.main' : 'grey.300',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => onSelect(tipo.id)}
            >
              {tipo.nombre.toLowerCase() === 'premium' && (
                <Chip
                  label="Más Popular"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {tipo.nombre}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                x{tipo.multiplicador_precio}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {tipo.descripcion}
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StarIcon color="warning" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">Calidad garantizada</Typography>
                </Box>
              </Stack>
              {selectedTipoId === tipo.id && (
                <CheckIcon color="primary" sx={{ fontSize: 32 }} />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}