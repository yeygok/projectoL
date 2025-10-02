import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CleaningServices as ServiceIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { serviceService, tipoServicioService, categoriaService, agendamientoService } from '../services';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import es from 'date-fns/locale/es';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Datos de los pasos
  const [categorias, setCategorias] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tiposServicio, setTiposServicio] = useState([]);
  const [bookingData, setBookingData] = useState({
    categoria_id: null, // Para saber qué servicio (Colchones, Vehículos, etc)
    servicio_id: null,
    tipo_servicio_id: null, // Sencillo, Premium, Gold
    fecha_servicio: null,
    direccion: '',
    barrio: '',
    localidad: '',
    zona: 'norte', // Default
    telefono: user?.telefono || '',
    observaciones: '',
    vehiculo_modelo: '', // Solo si es vehículo
    vehiculo_placa: '',
  });

  const steps = ['Seleccionar Servicio', 'Tipo de Servicio', 'Fecha y Hora', 'Datos de Ubicación', 'Confirmar'];

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadData();

    // Manejar pre-selección desde Home
    const { categoriaPreseleccionada, tipoPreseleccionado } = location.state || {};
    
    if (categoriaPreseleccionada) {
      setBookingData(prev => ({
        ...prev,
        categoria_id: categoriaPreseleccionada.id
      }));
      // Avanzar automáticamente si hay categoría pre-seleccionada
      if (activeStep === 0) {
        setActiveStep(1);
      }
    }

    if (tipoPreseleccionado) {
      setBookingData(prev => ({
        ...prev,
        tipo_servicio_id: tipoPreseleccionado.id
      }));
    }
  }, [isAuthenticated, navigate, location.state]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const categoriasData = await categoriaService.getAll();
      setCategorias(categoriasData || []);

      // Cargar servicios
      const serviciosData = await serviceService.getAll();
      setServicios(serviciosData || []);

      // Cargar tipos de servicio (Sencillo, Premium, Gold)
      const tiposData = await tipoServicioService.getAll();
      setTiposServicio(tiposData || []);

      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos. Por favor, recarga la página.');
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Validar antes de avanzar
    if (activeStep === 0 && !bookingData.categoria_id) {
      setError('Por favor, selecciona un servicio');
      return;
    }
    if (activeStep === 1 && !bookingData.tipo_servicio_id) {
      setError('Por favor, selecciona un tipo de servicio');
      return;
    }
    if (activeStep === 2 && !bookingData.fecha_servicio) {
      setError('Por favor, selecciona una fecha y hora');
      return;
    }
    if (activeStep === 3) {
      if (!bookingData.direccion || !bookingData.barrio || !bookingData.localidad) {
        setError('Por favor, completa todos los campos de ubicación');
        return;
      }
      // Si es vehículo, validar datos adicionales
      if (bookingData.categoria_id === 2 && (!bookingData.vehiculo_modelo || !bookingData.vehiculo_placa)) {
        setError('Por favor, completa los datos del vehículo');
        return;
      }
    }

    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleCategoriaSelect = (categoriaId) => {
    setBookingData({
      ...bookingData,
      categoria_id: categoriaId,
    });
  };

  const handleTipoSelect = (tipoId) => {
    setBookingData({
      ...bookingData,
      tipo_servicio_id: tipoId,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Preparar datos para el backend
      const reservaData = {
        cliente_id: user.id,
        servicio_tipo_id: bookingData.tipo_servicio_id,
        fecha_servicio: bookingData.fecha_servicio.toISOString(),
        precio_total: calculateTotal(),
        observaciones: bookingData.observaciones || null,
        // Ubicación (se creará automáticamente)
        ubicacion: {
          direccion: bookingData.direccion,
          barrio: bookingData.barrio,
          localidad: bookingData.localidad,
          zona: bookingData.zona,
        },
      };

      // Agregar vehículo solo si es categoría de vehículos y tiene datos
      if (bookingData.vehiculo_modelo && bookingData.vehiculo_placa) {
        reservaData.vehiculo = {
          modelo: bookingData.vehiculo_modelo,
          placa: bookingData.vehiculo_placa,
        };
      }
      
      console.log('Creating reserva:', reservaData);
      
      const result = await agendamientoService.create(reservaData);
      console.log('Reserva created:', result);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/cliente/reservas');
      }, 2000);

    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Error al crear la reserva. Por favor, intenta nuevamente.');
    } finally {
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

  const getSelectedCategoria = () => {
    return categorias.find(c => c.id === bookingData.categoria_id);
  };

  const getSelectedTipo = () => {
    return tiposServicio.find(t => t.id === bookingData.tipo_servicio_id);
  };

  const calculateTotal = () => {
    const tipo = getSelectedTipo();
    if (!tipo) return 0;
    
    const precioBase = 80000; // Precio base por ahora
    return precioBase * (tipo.multiplicador_precio || 1);
  };

  // Renderizar contenido según el paso activo
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
              ¿Qué deseas limpiar?
            </Typography>
            <Grid container spacing={3}>
              {categorias.map((categoria) => (
                <Grid item xs={12} sm={6} md={3} key={categoria.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: bookingData.categoria_id === categoria.id ? 3 : 1,
                      borderColor: bookingData.categoria_id === categoria.id ? 'primary.main' : 'grey.300',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleCategoriaSelect(categoria.id)}
                  >
                    <Box sx={{ 
                      height: 120, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'primary.light',
                      fontSize: '4rem',
                    }}>
                      {categoria.emoji}
                    </Box>
                    <CardContent>
                      <Typography variant="h6" align="center" gutterBottom>
                        {categoria.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {categoria.descripcion}
                      </Typography>
                      {bookingData.categoria_id === categoria.id && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <CheckIcon color="primary" />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
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
                      border: bookingData.tipo_servicio_id === tipo.id ? 3 : 1,
                      borderColor: bookingData.tipo_servicio_id === tipo.id ? 'primary.main' : 'grey.300',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleTipoSelect(tipo.id)}
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
                    {bookingData.tipo_servicio_id === tipo.id && (
                      <CheckIcon color="primary" sx={{ fontSize: 32 }} />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
              ¿Cuándo deseas el servicio?
            </Typography>
            <Paper sx={{ p: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DateTimePicker
                  label="Fecha y Hora del Servicio"
                  value={bookingData.fecha_servicio}
                  onChange={(newValue) => {
                    setBookingData({
                      ...bookingData,
                      fecha_servicio: newValue,
                    });
                  }}
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

              {bookingData.fecha_servicio && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    Servicio programado para: <strong>{bookingData.fecha_servicio.toLocaleString('es-ES')}</strong>
                  </Typography>
                </Alert>
              )}
            </Paper>
          </Box>
        );

      case 3:
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
                    value={bookingData.direccion}
                    onChange={(e) => setBookingData({ ...bookingData, direccion: e.target.value })}
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
                    value={bookingData.barrio}
                    onChange={(e) => setBookingData({ ...bookingData, barrio: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Localidad"
                    value={bookingData.localidad}
                    onChange={(e) => setBookingData({ ...bookingData, localidad: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teléfono de contacto"
                    value={bookingData.telefono}
                    onChange={(e) => setBookingData({ ...bookingData, telefono: e.target.value })}
                  />
                </Grid>

                {/* Datos adicionales si es vehículo */}
                {bookingData.categoria_id === 2 && (
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
                        value={bookingData.vehiculo_modelo}
                        onChange={(e) => setBookingData({ ...bookingData, vehiculo_modelo: e.target.value })}
                        placeholder="Ej: Toyota Corolla 2020"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Placa"
                        value={bookingData.vehiculo_placa}
                        onChange={(e) => setBookingData({ ...bookingData, vehiculo_placa: e.target.value })}
                        placeholder="ABC123"
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observaciones (opcional)"
                    value={bookingData.observaciones}
                    onChange={(e) => setBookingData({ ...bookingData, observaciones: e.target.value })}
                    multiline
                    rows={3}
                    placeholder="Notas adicionales sobre el servicio..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      case 4:
        const categoria = getSelectedCategoria();
        const tipo = getSelectedTipo();
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
                    {bookingData.fecha_servicio?.toLocaleString('es-ES', {
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
                    {bookingData.direccion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bookingData.barrio}, {bookingData.localidad}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tel: {bookingData.telefono}
                  </Typography>
                </Box>

                {bookingData.categoria_id === 2 && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Vehículo
                      </Typography>
                      <Typography variant="body1">
                        <CarIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                        {bookingData.vehiculo_modelo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placa: {bookingData.vehiculo_placa}
                      </Typography>
                    </Box>
                  </>
                )}

                {bookingData.observaciones && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Observaciones
                      </Typography>
                      <Typography variant="body2">
                        {bookingData.observaciones}
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

      default:
        return null;
    }
  };

  if (loading && servicios.length === 0) {
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Agenda tu Servicio
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sigue los pasos para completar tu reserva
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
            >
              Atrás
            </Button>
            
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                'Confirmar Reserva'
              ) : (
                'Siguiente'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Booking;
