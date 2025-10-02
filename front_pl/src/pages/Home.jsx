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
} from '@mui/material';
import {
  CleaningServices as CleanIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  const { isAuthenticated, user } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos reales de la BD
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriasData, tiposData] = await Promise.all([
          categoriaService.getAll(),
          tipoServicioService.getAll()
        ]);
        
        console.log('Categorías recibidas:', categoriasData);
        console.log('Tipos recibidos:', tiposData);
        
        // El servicio ya maneja la estructura, devuelve el array directamente
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
        setTipos(Array.isArray(tiposData) ? tiposData : []);
        setError('');
      } catch (err) {
        console.error('Error cargando datos:', err);
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
                letterSpacing: 1
              }}
            >
              💧 MEGA MALVADO
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

      {/* Hero Section - Mejorado */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
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

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/cliente/reservar' : '/login')}
            sx={{ 
              px: 6, 
              py: 2, 
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 50,
              bgcolor: '#fff',
              color: 'primary.main',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              animation: 'fadeInUp 0.8s ease-out 0.6s both, pulse 2s infinite',
              '&:hover': {
                bgcolor: '#f5f5f5',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            🚀 {isAuthenticated ? 'Reservar Ahora' : 'Comienza Ya'}
          </Button>
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
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    '&:hover': { 
                      transform: 'translateY(-12px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                    }
                  }}
                  onClick={() => handleSelectService(categoria)}
                >
                  {/* Imagen del servicio */}
                  <Box 
                    sx={{ 
                      height: 200, 
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${getImageForCategoria(categoria.nombre)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                      }
                    }}
                  >
                    {/* Emoji flotante en la esquina */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontSize: '2.5rem',
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        zIndex: 1
                      }}
                    >
                      {getEmojiForCategoria(categoria.nombre)}
                    </Box>
                    
                    {/* Título sobre la imagen */}
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        mb: 2,
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {categoria.nombre}
                    </Typography>
                  </Box>
                  
                  <CardContent>
                    <Typography color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
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
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
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
                      border: esPopular ? 2 : 0,
                      borderColor: 'primary.main',
                      position: 'relative'
                    }}>
                      {esPopular && (
                        <Chip 
                          label="Más Popular" 
                          color="primary" 
                          sx={{ 
                            position: 'absolute', 
                            top: -12, 
                            left: '50%', 
                            transform: 'translateX(-50%)' 
                          }} 
                        />
                      )}
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {tipo.nombre}
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                        Desde ${precio.toLocaleString('es-CO')}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 3, minHeight: 48 }}>
                        {tipo.descripcion}
                      </Typography>
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
                info@megamalvado.com
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
            MEGA MALVADO
          </Typography>
          <Typography variant="body2" color="grey.400">
            © 2025 Mega Malvado Lavado Vapor. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
