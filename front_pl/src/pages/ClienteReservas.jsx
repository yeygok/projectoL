import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { agendamientoService } from '../services';

const ClienteReservas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      
      // Cargar reservas del cliente autenticado
      const data = await agendamientoService.getByCliente(user.id);
      console.log('Reservas cargadas:', data);
      
      // Transformar datos del backend al formato del componente
      const reservasFormateadas = data.map(reserva => ({
        id: reserva.id,
        servicio: reserva.tipo_servicio || 'Servicio',
        tipo: reserva.tipo_servicio || 'N/A',
        fecha_servicio: new Date(reserva.fecha_servicio),
        direccion: reserva.ubicacion_direccion || 'No especificada',
        barrio: reserva.ubicacion_barrio || '',
        localidad: reserva.ubicacion_localidad || '',
        estado: reserva.estado_nombre || 'pendiente',
        precio_total: reserva.precio_total || 0,
        observaciones: reserva.observaciones,
        vehiculo_modelo: reserva.vehiculo_modelo,
        vehiculo_placa: reserva.vehiculo_placa,
      }));
      
      setReservas(reservasFormateadas);
      setLoading(false);
    } catch (err) {
      console.error('Error loading reservas:', err);
      setError('Error al cargar las reservas');
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'error';
      case 'completada':
        return 'info';
      default:
        return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return <CheckIcon />;
      case 'pendiente':
        return <PendingIcon />;
      case 'cancelada':
        return <CancelIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '80vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Mis Reservas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Historial y estado de tus servicios
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/cliente/reservar')}
          >
            Nueva Reserva
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Reservas List */}
        {reservas.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <ScheduleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No tienes reservas aún
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Agenda tu primer servicio y aparecerá aquí
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/cliente/reservar')}
              >
                Crear Primera Reserva
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {reservas.map((reserva) => (
              <Grid item xs={12} md={6} key={reserva.id}>
                <Card sx={{ 
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}>
                  <CardContent>
                    {/* Estado */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="overline" color="text.secondary">
                          Reserva #{reserva.id}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {reserva.servicio}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getEstadoIcon(reserva.estado)}
                        label={reserva.estado.toUpperCase()}
                        color={getEstadoColor(reserva.estado)}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2}>
                      {/* Tipo */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, mr: 2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {reserva.tipo.charAt(0)}
                          </Typography>
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Tipo de Servicio
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {reserva.tipo}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Fecha */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Fecha y Hora
                          </Typography>
                          <Typography variant="body1">
                            {reserva.fecha_servicio.toLocaleString('es-ES', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Ubicación */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Ubicación
                          </Typography>
                          <Typography variant="body1">
                            {reserva.direccion}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reserva.barrio}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Precio */}
                      <Box sx={{ 
                        bgcolor: 'primary.light', 
                        p: 2, 
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                        <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 700 }}>
                          {formatPrice(reserva.precio_total)}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Actions */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => console.log('Ver detalles', reserva.id)}
                      >
                        Ver Detalles
                      </Button>
                      {reserva.estado === 'pendiente' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => console.log('Cancelar', reserva.id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ClienteReservas;
