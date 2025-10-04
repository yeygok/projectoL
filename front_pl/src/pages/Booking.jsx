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

// Importar imágenes
import colchonImg from '../assets/img/colchon.jpg';
import sofaImg from '../assets/img/sofa.png';
import tapeteImg from '../assets/img/tapete.jpg';
import vehiculoImg from '../assets/img/vehiculo.jpg';

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
      setError('Error al cargar los datos. Por favor, recarga la página.');
      setLoading(false);
    }
  };

  // Función para obtener la imagen según el nombre de la categoría
  const getCategoriaImage = (nombreCategoria) => {
    const nombre = nombreCategoria.toLowerCase();
    if (nombre.includes('colchon')) return colchonImg;
    if (nombre.includes('mueble') || nombre.includes('sofá') || nombre.includes('sofa')) return sofaImg;
    if (nombre.includes('alfombra') || nombre.includes('tapete')) return tapeteImg;
    if (nombre.includes('vehículo') || nombre.includes('vehiculo') || nombre.includes('auto')) return vehiculoImg;
    return sofaImg; // Default
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
      
      const result = await agendamientoService.create(reservaData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/cliente/reservas');
      }, 2000);

    } catch (err) {
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
            <Typography 
              variant="h4" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                color: 'primary.main'
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
                      border: bookingData.categoria_id === categoria.id ? 3 : 2,
                      borderColor: bookingData.categoria_id === categoria.id ? 'primary.main' : 'grey.200',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      height: '100%',
                      boxShadow: bookingData.categoria_id === categoria.id 
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
                    onClick={() => handleCategoriaSelect(categoria.id)}
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
                      {bookingData.categoria_id === categoria.id && (
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
                        background: bookingData.categoria_id === categoria.id 
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
                          color: bookingData.categoria_id === categoria.id ? 'primary.main' : 'text.primary',
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
                      {bookingData.categoria_id === categoria.id && (
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
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh', 
        py: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: 0.1,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Agenda tu Servicio
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Sigue los pasos para completar tu reserva
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 5,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
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
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ mb: 5 }}>
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Atrás
            </Button>
            
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={loading}
              size="large"
              sx={{
                borderRadius: 2,
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
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
