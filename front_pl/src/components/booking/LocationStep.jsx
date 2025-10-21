import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import { LocationOn as LocationIcon, DirectionsCar as CarIcon } from '@mui/icons-material';

/**
 * Componente para el paso 4: Datos de Ubicación.
 * Incluye campos para dirección, barrio, localidad, teléfono y datos del vehículo si aplica.
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.ubicacion - Datos de ubicación
 * @param {Function} props.onUbicacionChange - Función para cambiar ubicación
 * @param {Object} props.vehiculo - Datos del vehículo
 * @param {Function} props.onVehiculoChange - Función para cambiar vehículo
 * @param {string} props.observaciones - Observaciones
 * @param {Function} props.onObservacionesChange - Función para cambiar observaciones
 * @param {number|null} props.categoriaId - ID de la categoría para mostrar campos de vehículo
 * @returns {JSX.Element} Componente del paso de ubicación
 */
export function LocationStep({
  ubicacion,
  onUbicacionChange,
  vehiculo,
  onVehiculoChange,
  observaciones,
  onObservacionesChange,
  categoriaId,
}) {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        Datos de ubicación
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              value={ubicacion.direccion}
              onChange={(e) => onUbicacionChange({ ...ubicacion, direccion: e.target.value })}
              placeholder="Calle 123 # 45-67"
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Barrio"
              value={ubicacion.barrio}
              onChange={(e) => onUbicacionChange({ ...ubicacion, barrio: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Localidad"
              value={ubicacion.localidad}
              onChange={(e) => onUbicacionChange({ ...ubicacion, localidad: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Teléfono de contacto"
              value={ubicacion.telefono}
              onChange={(e) => onUbicacionChange({ ...ubicacion, telefono: e.target.value })}
            />
          </Grid>

          {/* Datos adicionales si es vehículo */}
          {categoriaId === 2 && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Datos del Vehículo" icon={<CarIcon />} />
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Modelo del Vehículo"
                  value={vehiculo.modelo}
                  onChange={(e) => onVehiculoChange({ ...vehiculo, modelo: e.target.value })}
                  placeholder="Ej: Toyota Corolla 2020"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Placa"
                  value={vehiculo.placa}
                  onChange={(e) => onVehiculoChange({ ...vehiculo, placa: e.target.value })}
                  placeholder="ABC123"
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones (opcional)"
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              multiline
              rows={3}
              placeholder="Notas adicionales sobre el servicio..."
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}