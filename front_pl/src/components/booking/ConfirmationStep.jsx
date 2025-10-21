import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { Event as EventIcon, LocationOn as LocationIcon, DirectionsCar as CarIcon } from '@mui/icons-material';
import { getSelectedCategoria, getSelectedTipo, formatPrice } from './bookingUtils';

/**
 * Componente para el paso 5: Confirmación de Reserva.
 * Muestra un resumen de todos los datos seleccionados y el total.
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.state - Estado completo del booking
 * @param {Function} props.calculateTotal - Función para calcular el total
 * @param {boolean} props.success - Estado de éxito
 * @returns {JSX.Element} Componente del paso de confirmación
 */
export function ConfirmationStep({ state, calculateTotal, success }) {
  const categoria = getSelectedCategoria(state.categorias, state.categoria_id);
  const tipo = getSelectedTipo(state.tiposServicio, state.tipo_servicio_id);
  const total = calculateTotal();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        Confirmar Reserva
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Servicio
            </Typography>
            <Typography variant="h6">
              {categoria?.emoji} {categoria?.nombre}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" color="text.secondary">
              Tipo de Servicio
            </Typography>
            <Typography variant="h6">
              {tipo?.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tipo?.descripcion}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" color="text.secondary">
              Fecha y Hora
            </Typography>
            <Typography variant="body1">
              <EventIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
              {state.fecha_servicio?.toLocaleString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" color="text.secondary">
              Ubicación
            </Typography>
            <Typography variant="body1">
              <LocationIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
              {state.direccion}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {state.barrio}, {state.localidad}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tel: {state.telefono}
            </Typography>
          </Box>

          {state.categoria_id === 2 && (
            <>
              <Divider />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Vehículo
                </Typography>
                <Typography variant="body1">
                  <CarIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                  {state.vehiculo_modelo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placa: {state.vehiculo_placa}
                </Typography>
              </Box>
            </>
          )}

          {state.observaciones && (
            <>
              <Divider />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Observaciones
                </Typography>
                <Typography variant="body2">
                  {state.observaciones}
                </Typography>
              </Box>
            </>
          )}

          <Divider />

          <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Total a Pagar
            </Typography>
            <Typography variant="h4" color="primary.dark" sx={{ fontWeight: 700 }}>
              {formatPrice(total)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Precio aproximado (puede variar según el servicio final)
            </Typography>
          </Box>

          {success && (
            <Alert severity="success">
              ¡Reserva creada exitosamente! Redirigiendo...
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}