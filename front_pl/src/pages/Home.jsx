import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
  AppBar,
  Snackbar,
} from '@mui/material';
import {
  CleaningServices as CleanIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  WhatsApp as WhatsAppIcon,
  Speed as SpeedIcon,
  Nature as EcoIcon,
  VerifiedUser as VerifiedIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categoriaService, tipoServicioService } from '../services';

// Importar imágenes
import colchonImg from '../assets/img/colchon.jpg';
import sofaImg from '../assets/img/sofa.png';
import tapeteImg from '../assets/img/tapete.jpg';
import tapete2Img from '../assets/img/tapete2.jpg';
import vehiculoImg from '../assets/img/vehiculo.jpg';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  // Mostrar mensaje de bienvenida si viene del registro/login
  useEffect(() => {
    if (location.state?.welcomeMessage) {
      setWelcomeMessage(location.state.welcomeMessage);
      setShowWelcome(true);
      // Limpiar el estado para que no se muestre de nuevo
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Cargar datos reales de la BD
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriasData, tiposData] = await Promise.all([
          categoriaService.getAll(),
          tipoServicioService.getAll()
        ]);
        
        // El servicio ya maneja la estructura, devuelve el array directamente
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
        setTipos(Array.isArray(tiposData) ? tiposData : []);
        setError('');
      } catch (err) {
        setError('No se pudieron cargar los servicios. Mostrando datos de ejemplo.');
        // Datos de respaldo
        setCategorias([
          { nombre: 'Colchones', descripcion: 'Limpieza profunda con vapor', emoji: '🛏️' },
          { nombre: 'Tapetes', descripcion: 'Renovación completa', emoji: '🧺' },
          { nombre: 'Cortinas', descripcion: 'Limpieza especializada', emoji: '🪟' },
          { nombre: 'Vehículos', descripcion: 'Lavado y desinfección', emoji: '🚗' }
        ]);
        setTipos([
          { nombre: 'Sencillo', descripcion: 'Limpieza básica', multiplicador_precio: 1.0 },
          { nombre: 'Premium', descripcion: 'Limpieza profunda', multiplicador_precio: 1.6 },
          { nombre: 'Gold', descripcion: 'Servicio completo', multiplicador_precio: 2.4 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectService = (categoria) => {
    if (isAuthenticated) {
      // Si está autenticado, ir directo a reservar con categoría pre-seleccionada
      navigate('/cliente/reservar', { state: { categoriaPreseleccionada: categoria } });
    } else {
      // Si no está autenticado, ir al login con la categoría guardada
      navigate('/login', { state: { 
        from: '/cliente/reservar',
        categoriaPreseleccionada: categoria 
      }});
    }
  };

  // Mapeo de emojis para las categorías
  const getEmojiForCategoria = (nombre) => {
    const emojiMap = {
      'colchones': '🛏️',
      'tapetes': '🧺',
      'alfombras': '🧺',
      'cortinas': '🪟',
      'vehiculos': '🚗',
      'vehículos': '🚗',
      'muebles': '🛋️',
      'default': '✨'
    };
    
    const key = nombre.toLowerCase();
    return emojiMap[key] || emojiMap['default'];
  };

  // Mapeo de imágenes para las categorías
  const getImageForCategoria = (nombre) => {
    const imageMap = {
      'colchones': colchonImg,
      'tapetes': tapeteImg,
      'alfombras': tapete2Img,
      'cortinas': tapeteImg, // Usar tapete como placeholder
      'vehiculos': vehiculoImg,
      'vehículos': vehiculoImg,
      'muebles': sofaImg,
      'default': colchonImg
    };
    
    const key = nombre.toLowerCase();
    return imageMap[key] || imageMap['default'];
  };

  return (
    <Box>
      {/* Navbar fijo */}
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #fff 30%, #90caf9 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(1.2)',
                }
              }}
              onClick={() => navigate('/')}
            >
              💧 MEGA LAVADO
            </Typography>
            <Stack direction="row" spacing={2}>
              {isAuthenticated ? (
                <Button 
                  variant="outlined"
                  color="inherit" 
                  onClick={() => navigate(user?.rol?.nombre === 'admin' ? '/dashboard' : '/cliente')}
                  sx={{ 
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Mi Cuenta
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outlined"
                    color="inherit" 
                    onClick={() => navigate('/login')}
                    sx={{ 
                      fontWeight: 600,
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        borderColor: '#fff',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: '#fff',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      }
                    }}
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </AppBar>

      {/* Botón WhatsApp Flotante */}
      <Box
        component="a"
        href="https://wa.me/573001234567?text=Hola,%20quiero%20información%20sobre%20sus%20servicios"
        target="_blank"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          bgcolor: '#25D366',
          color: 'white',
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 6px 30px rgba(37, 211, 102, 0.7)',
          }
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Box>

      {/* Hero Section - MEJORADO */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        minHeight: { xs: '70vh', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              textShadow: '0 4px 12px rgba(0,0,0,0.2)',
              animation: 'fadeInUp 0.8s ease-out'
            }}
          >
            Lavado con Vapor Profesional
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 300,
              animation: 'fadeInUp 0.8s ease-out 0.2s both'
            }}
          >
            Limpieza profunda y ecológica para colchones, tapetes, cortinas y vehículos
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center" 
            sx={{ mb: 4, animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
          >
            <Chip 
              icon={<CheckIcon />} 
              label="Sin químicos tóxicos" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Chip 
              icon={<CheckIcon />} 
              label="100% Ecológico" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <Chip 
              icon={<CheckIcon />} 
              label="Secado rápido" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          </Stack>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(isAuthenticated ? '/cliente/reservar' : '/login')}
              startIcon={<CleanIcon />}
              sx={{ 
                px: 6, 
                py: 2.5, 
                fontSize: '1.25rem',
                fontWeight: 700,
                borderRadius: 50,
                bgcolor: '#fff',
                color: 'primary.main',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isAuthenticated ? 'Reservar Ahora' : 'Comienza Ya'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              component="a"
              href="https://wa.me/573001234567"
              target="_blank"
              startIcon={<WhatsAppIcon />}
              sx={{ 
                px: 5, 
                py: 2.5, 
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 50,
                borderColor: '#fff',
                color: '#fff',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-3px)',
                  borderWidth: 2,
                },
                transition: 'all 0.3s ease'
              }}
            >
              WhatsApp
            </Button>
          </Stack>
        </Container>

        {/* Animaciones CSS */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}</style>
      </Box>

      {/* ¿Por Qué Elegirnos? - MEJORADO */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ mb: 2, fontWeight: 800 }}
          >
            ¿Por Qué Elegirnos?
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 8, maxWidth: 700, mx: 'auto' }}
          >
            Somos expertos en limpieza con vapor. Tu satisfacción es nuestra prioridad
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                    }
                  }}
                >
                  <EcoIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  100% Ecológico
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Solo usamos vapor de agua. Sin químicos tóxicos
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)',
                    }
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Secado Rápido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Listo en pocas horas. Úsalo el mismo día
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: 'warning.main',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 24px rgba(237, 108, 2, 0.3)',
                    }
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Profesionales
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Personal capacitado con años de experiencia
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: 'info.main',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 24px rgba(2, 136, 209, 0.3)',
                    }
                  }}
                >
                  <ThumbUpIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Garantía 100%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Si no quedas feliz, volvemos sin costo
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Servicios */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 700 }}>
          Nuestros Servicios
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Ofrecemos diferentes tipos de limpieza para cada necesidad
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {categorias.map((categoria, index) => (
              <Grid item xs={12} sm={6} md={3} key={categoria.id || index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: 3,
                    position: 'relative',
                    '&:hover': { 
                      transform: 'translateY(-16px) scale(1.02)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                      '& .service-image': {
                        transform: 'scale(1.1)',
                      },
                      '& .service-overlay': {
                        opacity: 0.3,
                      },
                      '& .emoji-icon': {
                        transform: 'rotate(15deg) scale(1.15)',
                      }
                    }
                  }}
                  onClick={() => handleSelectService(categoria)}
                >
                  {/* Imagen del servicio con overlay */}
                  <Box 
                    sx={{ 
                      height: 220, 
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      className="service-image"
                      sx={{ 
                        height: '100%',
                        width: '100%',
                        backgroundImage: `url(${getImageForCategoria(categoria.nombre)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                    <Box 
                      className="service-overlay"
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
                        opacity: 0.5,
                        transition: 'opacity 0.4s ease',
                      }}
                    />
                    
                    {/* Emoji flotante en la esquina */}
                    <Box 
                      className="emoji-icon"
                      sx={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontSize: '2.5rem',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '50%',
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        zIndex: 2,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {getEmojiForCategoria(categoria.nombre)}
                    </Box>
                    
                    {/* Título sobre la imagen */}
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                        zIndex: 2
                      }}
                    >
                      {categoria.nombre}
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ mb: 3, minHeight: 48, lineHeight: 1.6 }}
                    >
                      {categoria.descripcion}
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth
                      size="large"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectService(categoria);
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isAuthenticated ? '✨ Reservar Ahora' : '🚀 Seleccionar'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Tipos de Servicio */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 700 }}>
            Planes de Servicio
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Elige el plan que mejor se adapte a tus necesidades
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {tipos.map((tipo, index) => {
                const precioBase = 50000;
                const precio = Math.round(precioBase * (tipo.multiplicador_precio || 1));
                const esPopular = tipo.nombre.toLowerCase() === 'premium';

                return (
                  <Grid item xs={12} md={4} key={tipo.id || index}>
                    <Paper sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      height: '100%',
                      border: esPopular ? 3 : 1,
                      borderColor: esPopular ? 'primary.main' : 'divider',
                      borderRadius: 3,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      transform: esPopular ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: esPopular ? '0 8px 32px rgba(102, 126, 234, 0.25)' : 'none',
                      '&:hover': {
                        transform: esPopular ? 'scale(1.08)' : 'scale(1.03)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      }
                    }}>
                      {esPopular && (
                        <Chip 
                          label="⭐ Más Popular" 
                          color="primary" 
                          sx={{ 
                            position: 'absolute', 
                            top: -14, 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            px: 2,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                          }} 
                        />
                      )}
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 800, 
                          mb: 1,
                          background: esPopular 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'inherit',
                          backgroundClip: esPopular ? 'text' : 'inherit',
                          WebkitBackgroundClip: esPopular ? 'text' : 'inherit',
                          WebkitTextFillColor: esPopular ? 'transparent' : 'inherit',
                        }}
                      >
                        {tipo.nombre}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        color="primary" 
                        sx={{ fontWeight: 700, mb: 2 }}
                      >
                        ${precio.toLocaleString('es-CO')}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 1 }}
                      >
                        Por servicio
                      </Typography>
                      <Typography 
                        color="text.secondary" 
                        sx={{ mb: 4, minHeight: 48, lineHeight: 1.6 }}
                      >
                        {tipo.descripcion}
                      </Typography>
                      
                      {/* Características incluidas */}
                      <Box sx={{ mb: 4, textAlign: 'left' }}>
                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                            <Typography variant="body2">Limpieza con vapor profesional</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                            <Typography variant="body2">Sin químicos tóxicos</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                            <Typography variant="body2">
                              {tipo.nombre === 'Gold' ? 'Tratamiento anti-ácaros incluido' : 
                               tipo.nombre === 'Premium' ? 'Desinfección profunda' : 
                               'Limpieza básica efectiva'}
                            </Typography>
                          </Box>
                          {esPopular && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Mejor relación calidad-precio
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      <Button 
                        variant={esPopular ? "contained" : "outlined"} 
                        fullWidth
                        size="large"
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate('/cliente/reservar', { state: { tipoPreseleccionado: tipo } });
                          } else {
                            navigate('/login', { state: { 
                              from: '/cliente/reservar',
                              tipoPreseleccionado: tipo 
                            }});
                          }
                        }}
                        sx={{
                          py: 1.5,
                          fontWeight: 700,
                          borderRadius: 2,
                          fontSize: '1rem',
                          background: esPopular ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          '&:hover': {
                            background: esPopular 
                              ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' 
                              : 'rgba(102, 126, 234, 0.08)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isAuthenticated ? 'Reservar Ahora' : 'Seleccionar Plan'}
                      </Button>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Nuestra Historia - NUEVA SECCIÓN CORPORATIVA */}
      <Box sx={{ bgcolor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ mb: 2, fontWeight: 800 }}
          >
            Mega Lavado
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 8, maxWidth: 800, mx: 'auto' }}
          >
            Expertos en limpieza con vapor desde 2015
          </Typography>

          <Grid container spacing={6}>
            {/* Historia */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(25, 118, 210, 0.2)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}
                >
                  📖 Nuestra Historia
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Fundada en 2015, Mega Lavado nació con una misión clara: revolucionar la limpieza en Bogotá 
                  utilizando tecnología de vapor 100% ecológica. Comenzamos como un pequeño emprendimiento familiar 
                  y hoy somos líderes en el sector, con más de 10,000 servicios realizados y miles de clientes 
                  satisfechos. Nuestro compromiso con el medio ambiente y la calidad nos ha posicionado como 
                  la opción preferida para hogares y empresas.
                </Typography>
              </Paper>
            </Grid>

            {/* Misión */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'success.main',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(46, 125, 50, 0.2)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ fontWeight: 700, mb: 3, color: 'success.main' }}
                >
                  🎯 Misión
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Proporcionar servicios de limpieza con vapor de la más alta calidad, utilizando tecnología 
                  eco-amigable que garantice ambientes saludables para nuestros clientes. Nos comprometemos 
                  a superar expectativas mediante un equipo profesional, capacitado y dedicado, mientras 
                  contribuimos al cuidado del medio ambiente eliminando el uso de químicos tóxicos.
                </Typography>
              </Paper>
            </Grid>

            {/* Visión */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'warning.main',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(237, 108, 2, 0.2)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ fontWeight: 700, mb: 3, color: 'warning.main' }}
                >
                  🔭 Visión
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Ser la empresa líder en limpieza con vapor en Colombia para 2030, reconocida por nuestra 
                  innovación, responsabilidad ambiental y excelencia en el servicio. Aspiramos a expandir 
                  nuestra presencia a nivel nacional, estableciendo nuevos estándares de calidad en la industria 
                  y siendo referentes en prácticas sostenibles de limpieza.
                </Typography>
              </Paper>
            </Grid>

            {/* Valores */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'info.main',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(2, 136, 209, 0.2)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ fontWeight: 700, mb: 3, color: 'info.main' }}
                >
                  💎 Nuestros Valores
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
                    <strong>Responsabilidad Ambiental:</strong> Cuidamos el planeta con cada servicio
                  </Typography>
                  <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
                    <strong>Excelencia:</strong> Buscamos la perfección en cada detalle
                  </Typography>
                  <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
                    <strong>Integridad:</strong> Actuamos con honestidad y transparencia
                  </Typography>
                  <Typography component="li" variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    <strong>Compromiso:</strong> Tu satisfacción es nuestra prioridad #1
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* CTA Final */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 6,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 4
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                ¿Listo para una Limpieza Profunda?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                Agenda tu servicio hoy y transforma tu hogar o vehículo
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(isAuthenticated ? '/cliente/reservar' : '/register')}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    bgcolor: '#fff',
                    color: 'primary.main',
                    borderRadius: 50,
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    }
                  }}
                >
                  Reservar Ahora
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href="https://wa.me/573001234567"
                  target="_blank"
                  startIcon={<WhatsAppIcon />}
                  sx={{ 
                    px: 5, 
                    py: 2, 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderColor: '#fff',
                    color: '#fff',
                    borderRadius: 50,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderWidth: 2,
                    }
                  }}
                >
                  Consultar por WhatsApp
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Contacto */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 700 }}>
          Contacto
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <PhoneIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Teléfono
              </Typography>
              <Typography color="text.secondary">
                +57 300 123 4567
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Email
              </Typography>
              <Typography color="text.secondary">
                info@megalavado.com
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Horarios
              </Typography>
              <Typography color="text.secondary">
                Lun - Sáb: 7AM - 6PM
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            MEGA LAVADO
          </Typography>
          <Typography variant="body2" color="grey.400">
            © 2025 Mega Lavado Vapor. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>

      {/* Snackbar para mensaje de bienvenida */}
      <Snackbar
        open={showWelcome}
        autoHideDuration={6000}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowWelcome(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {welcomeMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
