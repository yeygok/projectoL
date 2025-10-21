import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import es from 'date-fns/locale/es';

/**
 * Componente para el paso 3: Selección de Fecha y Hora.
 * Permite elegir la fecha y hora del servicio con validación.
 * @param {Object} props - Propiedades del componente
 * @param {Date|null} props.fechaServicio - Fecha seleccionada
 * @param {Function} props.onFechaChange - Función para cambiar la fecha
 * @returns {JSX.Element} Componente del paso de fecha y hora
 */
export function DateTimeStep({ fechaServicio, onFechaChange }) {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        ¿Cuándo deseas el servicio?
      </Typography>
      <Paper sx={{ p: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DateTimePicker
            label="Fecha y Hora del Servicio"
            value={fechaServicio}
            onChange={onFechaChange}
            minDateTime={new Date()}
            ampm={true}
            slotProps={{
              textField: {
                fullWidth: true,
                helperText: 'Horario de atención: Lun - Sáb, 7:00 AM - 6:00 PM',
              },
            }}
          />
        </LocalizationProvider>

        {fechaServicio && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Servicio programado para: <strong>{fechaServicio.toLocaleString('es-ES')}</strong>
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
}