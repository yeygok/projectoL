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
  Avatar,
  Rating,
  Divider,
  IconButton,
  Fade,
  Zoom,
  Slide,
  Grow,
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
  LocalShipping as ShippingIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
  Groups as GroupsIcon,
  EmojiEvents as TrophyIcon,
  AutoAwesome as SparklesIcon,
  Favorite as HeartIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  FiberManualRecord as DotIcon,
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
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Estados para carruseles
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [isPlanAutoPlay, setIsPlanAutoPlay] = useState(true);
  const [isServiceAutoPlay, setIsServiceAutoPlay] = useState(true);

  // Mostrar mensaje de bienvenida si viene del registro/login
  useEffect(() => {
    if (location.state?.welcomeMessage) {
      setWelcomeMessage(location.state.welcomeMessage);
      setShowWelcome(true);
      // Limpiar el estado para que no se muestre de nuevo
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Effect para animaciones al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Detectar cuando las estadísticas son visibles
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible && !statsVisible) {
          setStatsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [statsVisible]);

  // Auto-play para carrusel de planes
  useEffect(() => {
    if (!isPlanAutoPlay || !tipos || tipos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPlanIndex((prev) => (prev + 1) % tipos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlanAutoPlay, tipos]);

  // Auto-play para carrusel de servicios
  useEffect(() => {
    if (!isServiceAutoPlay || !categorias || categorias.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % categorias.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isServiceAutoPlay, categorias]);

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

  // Testimonios de clientes (solo 2)
  const testimonios = [
    {
      nombre: 'María González',
      rating: 5,
      comentario: '¡Increíble servicio! Mi colchón quedó como nuevo y sin olores. El equipo fue muy profesional y el resultado superó mis expectativas. Súper recomendado.',
      avatar: 'M',
      servicio: 'Limpieza de Colchones',
      cargo: 'Cliente Frecuente'
    },
    {
      nombre: 'Carlos Rodríguez',
      rating: 5,
      comentario: 'Excelente trabajo en mi vehículo. Quedó impecable y el proceso fue rápido. La atención al cliente es de primera y los resultados hablan por sí solos.',
      avatar: 'C',
      servicio: 'Lavado de Vehículo',
      cargo: 'Empresario'
    },
  ];

  // Estadísticas impresionantes
  const estadisticas = [
    { numero: '10,000+', texto: 'Servicios Realizados', icon: <CleanIcon /> },
    { numero: '5,000+', texto: 'Clientes Felices', icon: <GroupsIcon /> },
    { numero: '8+', texto: 'Años de Experiencia', icon: <TrophyIcon /> },
    { numero: '98%', texto: 'Satisfacción', icon: <StarIcon /> },
  ];

  // Componente de contador animado
  const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsVisible) return;

      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));
          setCount(Math.floor(numericEnd * progress));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }, [statsVisible, end, duration]);

    return <span>{typeof count === 'number' && !end.includes('%') ? `${count.toLocaleString()}+` : count}</span>;
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
    <Box sx={{ overflow: 'hidden' }}>
      {/* Estilos globales y animaciones CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-text {
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 3s ease infinite;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
      {/* Navbar fijo mejorado con efecto glassmorphism */}
      <AppBar 
        position="sticky" 
        elevation={scrollY > 50 ? 4 : 0}
        sx={{ 
          background: scrollY > 50 
            ? 'rgba(25, 118, 210, 0.95)' 
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
          borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'brightness(1.2)',
                  }
                }}
                onClick={() => navigate('/')}
              >
                <SparklesIcon sx={{ fontSize: 32 }} />
                MEGA LAVADO
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              {isAuthenticated ? (
                <Button 
                  variant="contained"
                  onClick={() => navigate(user?.rol?.nombre === 'admin' ? '/dashboard' : '/cliente')}
                  startIcon={<VerifiedIcon />}
                  sx={{ 
                    fontWeight: 700,
                    bgcolor: '#fff',
                    color: 'primary.main',
                    px: 3,
                    borderRadius: 50,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease'
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
                      borderColor: 'rgba(255,255,255,0.7)',
                      color: '#fff',
                      px: 3,
                      borderRadius: 50,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#fff',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="contained"
                    onClick={() => navigate('/register')}
                    startIcon={<SparklesIcon />}
                    sx={{ 
                      fontWeight: 700,
                      bgcolor: '#fff',
                      color: 'primary.main',
                      px: 3,
                      borderRadius: 50,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Registrarse Gratis
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </AppBar>

      {/* Botón WhatsApp Flotante Mejorado */}
      <Box
        component="a"
        href="https://wa.me/573001234567?text=¡Hola!%20Quiero%20información%20sobre%20Mega%20Lavado%20✨"
        target="_blank"
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 32 },
          right: { xs: 20, md: 32 },
          zIndex: 9999,
          bgcolor: '#25D366',
          color: 'white',
          borderRadius: '50%',
          width: { xs: 60, md: 70 },
          height: { xs: 60, md: 70 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.6)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'pulse 2s infinite',
          textDecoration: 'none',
          '&:hover': {
            transform: 'scale(1.15) rotate(5deg)',
            boxShadow: '0 12px 40px rgba(37, 211, 102, 0.8)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -5,
            right: -5,
            bottom: -5,
            left: -5,
            background: '#25D366',
            borderRadius: '50%',
            opacity: 0.3,
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          },
          '@keyframes ping': {
            '75%, 100%': {
              transform: 'scale(1.5)',
              opacity: 0,
            }
          }
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: 32, md: 38 }, position: 'relative', zIndex: 1 }} />
      </Box>

      {/* Hero Section - ULTRA MEJORADO con parallax */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        color: 'white',
        minHeight: { xs: '75vh', md: '90vh' },
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
          background: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          animation: 'pulse 4s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3,
        }
      }}>
        {/* Elementos flotantes decorativos */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          animation: 'float 6s ease-in-out infinite',
          opacity: 0.3,
        }}>
          <CleanIcon sx={{ fontSize: 80, transform: 'rotate(-15deg)' }} />
        </Box>
        <Box sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '1s',
          opacity: 0.3,
        }}>
          <EcoIcon sx={{ fontSize: 100, transform: 'rotate(20deg)' }} />
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: '10%',
          left: '15%',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '2s',
          opacity: 0.3,
        }}>
          <SpeedIcon sx={{ fontSize: 70, transform: 'rotate(25deg)' }} />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Zoom in timeout={800}>
            <Box>
              <Box sx={{ mb: 3, display: 'inline-block' }}>
                <Chip 
                  label="🏆 #1 en Limpieza con Vapor"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 2,
                    py: 3,
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  }}
                />
              </Box>
              
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 900, 
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                  lineHeight: 1.2,
                  letterSpacing: -1,
                }}
              >
                Transformamos Tu Hogar
                <br />
                <span className="gradient-text" style={{ 
                  background: 'linear-gradient(45deg, #fff, #ffd700)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Con Vapor Mágico ✨
                </span>
              </Typography>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 5, 
                  opacity: 0.95,
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' },
                  fontWeight: 400,
                  maxWidth: 800,
                  mx: 'auto',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                Limpieza 100% ecológica y profunda para colchones, tapetes, cortinas y vehículos.
                <br />
                <strong>Sin químicos. Solo vapor puro.</strong>
              </Typography>
              
              {/* Chips de beneficios */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center" 
                sx={{ mb: 5 }}
                flexWrap="wrap"
              >
                {[
                  { icon: '🌿', text: '100% Ecológico' },
                  { icon: '⚡', text: 'Secado en 2 Horas' },
                  { icon: '🛡️', text: 'Elimina el 99.9% de Gérmenes' },
                  { icon: '💚', text: 'Pet-Friendly' },
                ].map((item, index) => (
                  <Grow in timeout={1000 + (index * 200)} key={index}>
                    <Chip 
                      label={`${item.icon} ${item.text}`}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: { xs: '0.85rem', sm: '1rem' },
                        py: 3,
                        px: 2,
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Grow>
                ))}
              </Stack>

              {/* CTAs principales */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <Slide direction="up" in timeout={1200}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(isAuthenticated ? '/cliente/reservar' : '/register')}
                    startIcon={<SparklesIcon />}
                    sx={{ 
                      px: 6, 
                      py: 2.5, 
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      borderRadius: 50,
                      bgcolor: '#fff',
                      color: 'primary.main',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.35)',
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {isAuthenticated ? '🚀 Reservar Ahora' : '✨ Empezar Gratis'}
                  </Button>
                </Slide>

                <Slide direction="up" in timeout={1400}>
                  <Button
                    variant="outlined"
                    size="large"
                    component="a"
                    href="https://wa.me/573001234567?text=Hola!%20Quiero%20información%20sobre%20Mega%20Lavado"
                    target="_blank"
                    startIcon={<WhatsAppIcon />}
                    sx={{ 
                      px: 5, 
                      py: 2.5, 
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      borderRadius: 50,
                      borderColor: '#fff',
                      color: '#fff',
                      borderWidth: 3,
                      textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        borderColor: '#25D366',
                        bgcolor: '#25D366',
                        color: '#fff',
                        transform: 'translateY(-5px) scale(1.05)',
                        borderWidth: 3,
                        boxShadow: '0 15px 40px rgba(37, 211, 102, 0.4)',
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    💬 Chat WhatsApp
                  </Button>
                </Slide>
              </Stack>

              {/* Prueba social */}
              <Fade in timeout={1600}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <Stack direction="row" spacing={-1}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar 
                        key={i}
                        sx={{ 
                          width: 45, 
                          height: 45, 
                          border: '3px solid rgba(255,255,255,0.9)',
                          bgcolor: 'primary.main',
                          fontWeight: 700,
                        }}
                      >
                        {String.fromCharCode(64 + i)}
                      </Avatar>
                    ))}
                  </Stack>
                  <Box sx={{ textAlign: 'left' }}>
                    <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon key={i} sx={{ color: '#ffd700', fontSize: 22 }} />
                      ))}
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      +5,000 clientes satisfechos ⭐
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Box>
          </Zoom>
        </Container>
      </Box>

      {/* Sección de Estadísticas Animadas */}
      <Box 
        id="stats-section"
        sx={{ 
          bgcolor: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, rgba(102, 126, 234, 0.05), transparent)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {estadisticas.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Zoom in={statsVisible} timeout={500 + (index * 200)}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-10px) scale(1.05)',
                        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      }
                    }}
                  >
                    <Box sx={{ mb: 2, fontSize: 48 }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 900,
                        mb: 1,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      }}
                    >
                      {statsVisible ? <AnimatedCounter end={stat.numero} /> : stat.numero}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        opacity: 0.95,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      {stat.texto}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ¿Por Qué Elegirnos? - ULTRA MEJORADO */}
      <Box sx={{ 
        background: 'linear-gradient(180deg, #f8f9ff 0%, #fff 100%)',
        py: 12,
        position: 'relative',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip 
              label="🌟 Nuestras Ventajas"
              sx={{ 
                mb: 3,
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 700,
                px: 3,
                py: 2.5,
                fontSize: '1rem',
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2,
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ¿Por Qué Mega Lavado?
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Somos la elección #1 de miles de familias en Bogotá
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <EcoIcon sx={{ fontSize: 60 }} />,
                color: 'success',
                title: '100% Ecológico',
                description: 'Solo usamos vapor de agua purificada. Cero químicos tóxicos para tu familia y mascotas.',
                badge: 'Eco-Friendly',
              },
              {
                icon: <SpeedIcon sx={{ fontSize: 60 }} />,
                color: 'info',
                title: 'Secado Rápido',
                description: 'Tecnología de última generación. Tu colchón o mueble listo en solo 2-3 horas.',
                badge: 'Rápido',
              },
              {
                icon: <VerifiedIcon sx={{ fontSize: 60 }} />,
                color: 'warning',
                title: 'Profesionales Certificados',
                description: 'Equipo capacitado con más de 8 años de experiencia. Garantía total en cada servicio.',
                badge: 'Expertos',
              },
              {
                icon: <HeartIcon sx={{ fontSize: 60 }} />,
                color: 'error',
                title: '100% Garantizado',
                description: 'Si no quedas satisfecho, regresamos sin costo adicional. Tu felicidad es nuestra misión.',
                badge: 'Garantía',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in timeout={800 + (index * 200)}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: 'grey.200',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: `0 20px 60px rgba(${
                          item.color === 'success' ? '46, 125, 50' :
                          item.color === 'info' ? '2, 136, 209' :
                          item.color === 'warning' ? '237, 108, 2' :
                          '211, 47, 47'
                        }, 0.25)`,
                        borderColor: `${item.color}.main`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${
                          item.color === 'success' ? 'rgba(46, 125, 50, 0.05)' :
                          item.color === 'info' ? 'rgba(2, 136, 209, 0.05)' :
                          item.color === 'warning' ? 'rgba(237, 108, 2, 0.05)' :
                          'rgba(211, 47, 47, 0.05)'
                        }, transparent)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      }
                    }}
                  >
                    {/* Badge */}
                    <Chip 
                      label={item.badge}
                      size="small"
                      color={item.color}
                      sx={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />

                    {/* Icono con fondo de color */}
                    <Box 
                      sx={{ 
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        background: `linear-gradient(135deg, ${
                          item.color === 'success' ? '#4caf50' :
                          item.color === 'info' ? '#0288d1' :
                          item.color === 'warning' ? '#ed6c02' :
                          '#d32f2f'
                        }, ${
                          item.color === 'success' ? '#66bb6a' :
                          item.color === 'info' ? '#29b6f6' :
                          item.color === 'warning' ? '#ffa726' :
                          '#ef5350'
                        })`,
                        color: 'white',
                        boxShadow: `0 8px 24px rgba(${
                          item.color === 'success' ? '76, 175, 80' :
                          item.color === 'info' ? '2, 136, 209' :
                          item.color === 'warning' ? '237, 108, 2' :
                          '211, 47, 47'
                        }, 0.3)`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(15deg) scale(1.1)',
                        }
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800,
                        mb: 2,
                        color: 'text.primary',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: '1rem',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {/* CTA adicional */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(isAuthenticated ? '/cliente/reservar' : '/register')}
              endIcon={<SparklesIcon />}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 50,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Quiero Probarlo Ahora
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Servicios con Carrusel Mejorado */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip 
            label="✨ Nuestros Servicios"
            sx={{ 
              mb: 3,
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 700,
              px: 3,
              py: 2.5,
              fontSize: '1rem',
            }}
          />
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 2,
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Servicios Profesionales
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Limpieza profunda con vapor para cada necesidad de tu hogar
          </Typography>
        </Box>

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
          <Box sx={{ position: 'relative', px: { xs: 0, md: 8 } }}>
            {/* Carrusel de Servicios */}
            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
              <Grid container spacing={4}>
                {categorias.map((categoria, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    key={categoria.id || index}
                    sx={{
                      display: { 
                        xs: index === currentServiceIndex ? 'block' : 'none',
                        sm: Math.abs(index - currentServiceIndex) <= 0 ? 'block' : 'none',
                        md: Math.abs(index - currentServiceIndex) <= 1 ? 'block' : 'none',
                      },
                      transition: 'all 0.5s ease',
                    }}
                  >
                    <Zoom in timeout={500}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          borderRadius: 4,
                          position: 'relative',
                          boxShadow: index === currentServiceIndex 
                            ? '0 20px 60px rgba(102, 126, 234, 0.3)' 
                            : '0 4px 20px rgba(0,0,0,0.1)',
                          transform: index === currentServiceIndex ? 'scale(1.05)' : 'scale(0.95)',
                          opacity: index === currentServiceIndex ? 1 : 0.6,
                          '&:hover': { 
                            transform: 'translateY(-16px) scale(1.05)',
                            boxShadow: '0 25px 70px rgba(102, 126, 234, 0.35)',
                            opacity: 1,
                            '& .service-image': {
                              transform: 'scale(1.15)',
                            },
                            '& .service-overlay': {
                              opacity: 0.4,
                            },
                            '& .emoji-icon': {
                              transform: 'rotate(15deg) scale(1.2)',
                            }
                          }
                        }}
                        onClick={() => {
                          setCurrentServiceIndex(index);
                          setIsServiceAutoPlay(false);
                          handleSelectService(categoria);
                        }}
                      >
                        {/* Badge de destacado */}
                        {index === currentServiceIndex && (
                          <Chip 
                            label="⭐ Destacado"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              zIndex: 3,
                              bgcolor: 'rgba(255, 215, 0, 0.95)',
                              color: 'grey.900',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            }}
                          />
                        )}

                        {/* Imagen del servicio con overlay */}
                        <Box 
                          sx={{ 
                            height: 280, 
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
                              transition: 'transform 0.6s ease',
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
                              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
                              opacity: 0.6,
                              transition: 'opacity 0.4s ease',
                            }}
                          />
                          
                          {/* Emoji flotante en la esquina */}
                          <Box 
                            className="emoji-icon"
                            sx={{ 
                              position: 'absolute',
                              bottom: 16,
                              right: 16,
                              fontSize: '3rem',
                              background: 'rgba(255,255,255,0.98)',
                              borderRadius: '50%',
                              width: 80,
                              height: 80,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                              zIndex: 2,
                              transition: 'all 0.4s ease',
                            }}
                          >
                            {getEmojiForCategoria(categoria.nombre)}
                          </Box>
                          
                          {/* Título sobre la imagen */}
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              position: 'absolute',
                              top: 24,
                              left: 24,
                              right: 100,
                              fontWeight: 900,
                              color: 'white',
                              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                              zIndex: 2,
                              fontSize: { xs: '1.75rem', md: '2rem' }
                            }}
                          >
                            {categoria.nombre}
                          </Typography>
                        </Box>
                        
                        <CardContent sx={{ p: 4 }}>
                          <Typography 
                            variant="body1" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 3,
                              minHeight: 48,
                              lineHeight: 1.7,
                              fontSize: '1.05rem'
                            }}
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
                              fontWeight: 700,
                              py: 2,
                              borderRadius: 3,
                              textTransform: 'none',
                              fontSize: '1.1rem',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 28px rgba(102, 126, 234, 0.5)',
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isAuthenticated ? '✨ Reservar Ahora' : '🚀 Seleccionar'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Controles del Carrusel - Servicios */}
            {categorias.length > 1 && (
              <>
                {/* Botones Anterior/Siguiente */}
                <IconButton
                  onClick={() => {
                    setCurrentServiceIndex((prev) => 
                      prev === 0 ? categorias.length - 1 : prev - 1
                    );
                    setIsServiceAutoPlay(false);
                  }}
                  sx={{
                    position: 'absolute',
                    left: { xs: -16, md: 0 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    width: 56,
                    height: 56,
                    zIndex: 2,
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-50%) scale(1.1)',
                      boxShadow: '0 6px 30px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <PrevIcon sx={{ fontSize: 32 }} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setCurrentServiceIndex((prev) => 
                      prev === categorias.length - 1 ? 0 : prev + 1
                    );
                    setIsServiceAutoPlay(false);
                  }}
                  sx={{
                    position: 'absolute',
                    right: { xs: -16, md: 0 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    width: 56,
                    height: 56,
                    zIndex: 2,
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-50%) scale(1.1)',
                      boxShadow: '0 6px 30px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <NextIcon sx={{ fontSize: 32 }} />
                </IconButton>

                {/* Indicadores de puntos */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  gap: 1.5,
                  mt: 4
                }}>
                  {categorias.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => {
                        setCurrentServiceIndex(index);
                        setIsServiceAutoPlay(false);
                      }}
                      sx={{
                        width: index === currentServiceIndex ? 40 : 12,
                        height: 12,
                        borderRadius: 6,
                        bgcolor: index === currentServiceIndex ? 'primary.main' : 'grey.300',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: index === currentServiceIndex ? 'primary.dark' : 'grey.400',
                          transform: 'scale(1.1)',
                        }
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}
      </Container>

      {/* Sección de Testimonios - NUEVA */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 12,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              ⭐ Testimonios Reales
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.95,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              Miles de clientes felices confían en nosotros
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {testimonios.map((testimonio, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Fade in timeout={600 + (index * 200)}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 5,
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        background: 'rgba(255,255,255,0.25)',
                        boxShadow: '0 25px 70px rgba(0,0,0,0.35)',
                        borderColor: 'rgba(255,255,255,0.4)',
                      }
                    }}
                  >
                    {/* Avatar y nombre */}
                    <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4 }}>
                      <Avatar 
                        sx={{ 
                          width: 70,
                          height: 70,
                          bgcolor: 'white',
                          color: 'primary.main',
                          fontWeight: 900,
                          fontSize: '2rem',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        }}
                      >
                        {testimonio.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {testimonio.nombre}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                          {testimonio.cargo}
                        </Typography>
                        <Rating 
                          value={testimonio.rating} 
                          readOnly 
                          size="medium"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#ffd700',
                            }
                          }}
                        />
                      </Box>
                    </Stack>

                    {/* Comillas decorativas */}
                    <Typography 
                      variant="h1" 
                      sx={{ 
                        opacity: 0.15,
                        lineHeight: 0,
                        mb: 2,
                        fontFamily: 'Georgia, serif',
                        fontSize: '5rem',
                      }}
                    >
                      "
                    </Typography>

                    {/* Comentario */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 4,
                        fontStyle: 'italic',
                        lineHeight: 1.8,
                        fontWeight: 400,
                        fontSize: '1.15rem',
                      }}
                    >
                      {testimonio.comentario}
                    </Typography>

                    {/* Servicio usado */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <CheckIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                      <Chip 
                        label={testimonio.servicio}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.25)',
                          color: 'white',
                          fontWeight: 700,
                          border: '1px solid rgba(255,255,255,0.3)',
                          fontSize: '0.95rem',
                          py: 2.5,
                        }}
                      />
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Google Reviews Badge */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Paper
              elevation={0}
              sx={{
                display: 'inline-block',
                p: 4,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                4.9 / 5.0
              </Typography>
              <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mb: 2 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} sx={{ fontSize: 32, color: '#ffd700' }} />
                ))}
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Basado en +500 reseñas de Google
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Planes de Servicio con Carrusel Mejorado */}
      <Box sx={{ 
        background: 'linear-gradient(180deg, #f8f9ff 0%, #fff 100%)',
        py: 12,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip 
              label="💎 Planes Premium"
              sx={{ 
                mb: 3,
                bgcolor: 'warning.main',
                color: 'white',
                fontWeight: 700,
                px: 3,
                py: 2.5,
                fontSize: '1rem',
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2,
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Planes de Servicio
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Elige el plan perfecto para tus necesidades y presupuesto
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Box sx={{ position: 'relative', px: { xs: 0, md: 8 } }}>
              {/* Carrusel de Planes */}
              <Grid container spacing={4} justifyContent="center">
                {tipos.map((tipo, index) => {
                  const precioBase = 50000;
                  const precio = Math.round(precioBase * (tipo.multiplicador_precio || 1));
                  const esPopular = tipo.nombre.toLowerCase() === 'premium';
                  const isActive = index === currentPlanIndex;

                  return (
                    <Grid 
                      item 
                      xs={12} 
                      md={4} 
                      key={tipo.id || index}
                      sx={{
                        display: { 
                          xs: index === currentPlanIndex ? 'block' : 'none',
                          md: 'block',
                        },
                      }}
                    >
                      <Zoom in timeout={500}>
                        <Paper 
                          sx={{ 
                            p: 5, 
                            textAlign: 'center', 
                            height: '100%',
                            minHeight: 520,
                            border: esPopular ? 4 : 2,
                            borderColor: esPopular ? 'primary.main' : isActive ? 'warning.main' : 'divider',
                            borderRadius: 4,
                            position: 'relative',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: esPopular ? 'scale(1.08)' : isActive ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: esPopular 
                              ? '0 20px 60px rgba(102, 126, 234, 0.35)' 
                              : isActive 
                                ? '0 15px 50px rgba(237, 108, 2, 0.25)'
                                : '0 4px 20px rgba(0,0,0,0.08)',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: esPopular ? 'scale(1.12)' : 'scale(1.08)',
                              boxShadow: esPopular 
                                ? '0 25px 70px rgba(102, 126, 234, 0.45)'
                                : '0 20px 60px rgba(0,0,0,0.2)',
                              borderColor: esPopular ? 'primary.dark' : 'primary.main',
                            }
                          }}
                          onClick={() => {
                            setCurrentPlanIndex(index);
                            setIsPlanAutoPlay(false);
                          }}
                        >
                          {/* Badge Superior */}
                          {esPopular ? (
                            <Chip 
                              label="⭐ MÁS POPULAR" 
                              sx={{ 
                                position: 'absolute', 
                                top: -16, 
                                left: '50%', 
                                transform: 'translateX(-50%)',
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontWeight: 900,
                                fontSize: '0.95rem',
                                px: 3,
                                py: 3,
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                animation: 'pulse 2s infinite',
                              }} 
                            />
                          ) : isActive ? (
                            <Chip 
                              label="🔥 Seleccionado" 
                              sx={{ 
                                position: 'absolute', 
                                top: -16, 
                                left: '50%', 
                                transform: 'translateX(-50%)',
                                bgcolor: 'warning.main',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                px: 2.5,
                                py: 2.5,
                                boxShadow: '0 4px 16px rgba(237, 108, 2, 0.3)',
                              }} 
                            />
                          ) : null}

                          {/* Icono del Plan */}
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 24px',
                              background: esPopular
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : isActive
                                  ? 'linear-gradient(135deg, #ed6c02 0%, #ffa726 100%)'
                                  : 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                              color: 'white',
                              boxShadow: esPopular
                                ? '0 12px 32px rgba(102, 126, 234, 0.4)'
                                : '0 8px 24px rgba(0,0,0,0.15)',
                              fontSize: '3rem',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'rotate(15deg) scale(1.1)',
                              }
                            }}
                          >
                            {tipo.nombre === 'Sencillo' ? '🌟' : tipo.nombre === 'Premium' ? '💎' : '👑'}
                          </Box>

                          {/* Nombre del Plan */}
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              fontWeight: 900, 
                              mb: 2,
                              background: esPopular 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'inherit',
                              backgroundClip: esPopular ? 'text' : 'inherit',
                              WebkitBackgroundClip: esPopular ? 'text' : 'inherit',
                              WebkitTextFillColor: esPopular ? 'transparent' : 'inherit',
                              fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                          >
                            {tipo.nombre}
                          </Typography>

                          {/* Precio */}
                          <Box sx={{ mb: 4 }}>
                            <Typography 
                              variant="h2" 
                              sx={{ 
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '2.5rem', md: '3rem' },
                                mb: 0.5,
                              }}
                            >
                              ${precio.toLocaleString('es-CO')}
                            </Typography>
                            <Typography 
                              variant="body1" 
                              color="text.secondary"
                              sx={{ fontWeight: 600 }}
                            >
                              Por servicio
                            </Typography>
                          </Box>

                          {/* Descripción */}
                          <Typography 
                            variant="h6"
                            color="text.secondary" 
                            sx={{ mb: 4, minHeight: 48, lineHeight: 1.6, fontWeight: 500 }}
                          >
                            {tipo.descripcion}
                          </Typography>
                          
                          {/* Características */}
                          <Box sx={{ mb: 4, textAlign: 'left' }}>
                            <Stack spacing={2}>
                              {[
                                'Limpieza con vapor profesional',
                                'Sin químicos tóxicos',
                                tipo.nombre === 'Gold' ? 'Tratamiento anti-ácaros incluido' : 
                                 tipo.nombre === 'Premium' ? 'Desinfección profunda' : 
                                 'Limpieza básica efectiva',
                                esPopular && 'Mejor relación calidad-precio'
                              ].filter(Boolean).map((feature, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <CheckIcon sx={{ 
                                    color: esPopular ? 'primary.main' : 'success.main',
                                    fontSize: 24,
                                    flexShrink: 0,
                                  }} />
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      fontWeight: (idx === 3 && esPopular) ? 700 : 500,
                                      color: (idx === 3 && esPopular) ? 'primary.main' : 'text.primary',
                                    }}
                                  >
                                    {feature}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>

                          {/* Botón CTA */}
                          <Button 
                            variant={esPopular ? "contained" : "outlined"} 
                            fullWidth
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
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
                              py: 2,
                              fontWeight: 800,
                              borderRadius: 3,
                              fontSize: '1.1rem',
                              textTransform: 'none',
                              background: esPopular 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                : 'transparent',
                              borderWidth: 2,
                              '&:hover': {
                                background: esPopular 
                                  ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' 
                                  : 'rgba(102, 126, 234, 0.08)',
                                transform: 'translateY(-3px)',
                                borderWidth: 2,
                                boxShadow: esPopular
                                  ? '0 12px 32px rgba(102, 126, 234, 0.4)'
                                  : '0 8px 24px rgba(102, 126, 234, 0.2)',
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isAuthenticated ? '✨ Reservar Ahora' : '🚀 Seleccionar Plan'}
                          </Button>
                        </Paper>
                      </Zoom>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Controles del Carrusel - Solo visible en móvil */}
              {tipos.length > 1 && (
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  {/* Botones Anterior/Siguiente */}
                  <IconButton
                    onClick={() => {
                      setCurrentPlanIndex((prev) => 
                        prev === 0 ? tipos.length - 1 : prev - 1
                      );
                      setIsPlanAutoPlay(false);
                    }}
                    sx={{
                      position: 'absolute',
                      left: -16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      width: 50,
                      height: 50,
                      zIndex: 2,
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        transform: 'translateY(-50%) scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <PrevIcon sx={{ fontSize: 28 }} />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setCurrentPlanIndex((prev) => 
                        prev === tipos.length - 1 ? 0 : prev + 1
                      );
                      setIsPlanAutoPlay(false);
                    }}
                    sx={{
                      position: 'absolute',
                      right: -16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      width: 50,
                      height: 50,
                      zIndex: 2,
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        transform: 'translateY(-50%) scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <NextIcon sx={{ fontSize: 28 }} />
                  </IconButton>

                  {/* Indicadores de puntos */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: 1.5,
                    mt: 4
                  }}>
                    {tipos.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => {
                          setCurrentPlanIndex(index);
                          setIsPlanAutoPlay(false);
                        }}
                        sx={{
                          width: index === currentPlanIndex ? 40 : 12,
                          height: 12,
                          borderRadius: 6,
                          bgcolor: index === currentPlanIndex ? 'warning.main' : 'grey.300',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: index === currentPlanIndex ? 'warning.dark' : 'grey.400',
                            transform: 'scale(1.1)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Información adicional */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Paper
              elevation={0}
              sx={{
                display: 'inline-block',
                p: 4,
                borderRadius: 4,
                border: '2px solid',
                borderColor: 'primary.main',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                💡 ¿Necesitas ayuda para elegir?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Contáctanos y te ayudaremos a encontrar el plan perfecto
              </Typography>
              <Button
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                component="a"
                href="https://wa.me/573001234567?text=Hola!%20Necesito%20ayuda%20para%20elegir%20un%20plan"
                target="_blank"
                sx={{
                  fontWeight: 700,
                  borderWidth: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Consultar Ahora
              </Button>
            </Paper>
          </Box>
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

      {/* Footer Mejorado */}
      <Box sx={{ 
        bgcolor: 'grey.900',
        color: 'white',
        pt: 8,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Columna 1 - Marca */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 900,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <SparklesIcon sx={{ fontSize: 36 }} />
                  MEGA LAVADO
                </Typography>
                <Typography variant="body1" color="grey.400" sx={{ mb: 3, lineHeight: 1.7 }}>
                  Limpieza profesional con vapor desde 2015. Transformamos tu hogar con tecnología 100% ecológica.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    component="a"
                    href="https://facebook.com/megalavado"
                    target="_blank"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#1877f2',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton 
                    component="a"
                    href="https://instagram.com/megalavado"
                    target="_blank"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#e4405f',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <InstagramIcon />
                  </IconButton>
                  <IconButton 
                    component="a"
                    href="https://wa.me/573001234567"
                    target="_blank"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#25D366',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  <IconButton 
                    component="a"
                    href="https://twitter.com/megalavado"
                    target="_blank"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#1da1f2',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <TwitterIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>

            {/* Columna 2 - Enlaces Rápidos */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Servicios
              </Typography>
              <Stack spacing={1.5}>
                {['Colchones', 'Tapetes', 'Cortinas', 'Vehículos', 'Muebles'].map((item) => (
                  <Typography 
                    key={item}
                    variant="body2" 
                    color="grey.400"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: 'white',
                        paddingLeft: '8px',
                      }
                    }}
                    onClick={() => navigate(isAuthenticated ? '/cliente/reservar' : '/register')}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            {/* Columna 3 - Información */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Información
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationIcon sx={{ color: 'primary.light', fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" color="grey.400">
                      Bogotá, Colombia
                      <br />
                      Servicio a domicilio
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneIcon sx={{ color: 'primary.light', fontSize: 22 }} />
                  <Typography variant="body2" color="grey.400">
                    +57 300 123 4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon sx={{ color: 'primary.light', fontSize: 22 }} />
                  <Typography variant="body2" color="grey.400">
                    info@megalavado.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ScheduleIcon sx={{ color: 'primary.light', fontSize: 22 }} />
                  <Typography variant="body2" color="grey.400">
                    Lun - Sáb: 7:00 AM - 6:00 PM
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Columna 4 - Newsletter */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                🔔 Newsletter
              </Typography>
              <Typography variant="body2" color="grey.400" sx={{ mb: 3 }}>
                Suscríbete para recibir ofertas exclusivas y consejos de limpieza.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/register')}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Suscribirme Gratis
              </Button>

              {/* Certificaciones/Badges */}
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Chip 
                  icon={<VerifiedIcon />}
                  label="Certificado"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    color: 'success.light',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    fontWeight: 600,
                  }}
                />
                <Chip 
                  icon={<EcoIcon />}
                  label="Eco-Friendly"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(2, 136, 209, 0.2)',
                    color: 'info.light',
                    border: '1px solid rgba(2, 136, 209, 0.3)',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* Bottom Footer */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color="grey.500" textAlign={{ xs: 'center', sm: 'left' }}>
              © 2025 Mega Lavado Vapor. Todos los derechos reservados.
              <br />
              Desarrollado con ❤️ en Colombia
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography 
                variant="body2" 
                color="grey.500"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                  transition: 'color 0.2s ease',
                }}
              >
                Términos y Condiciones
              </Typography>
              <Typography 
                variant="body2" 
                color="grey.500"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                  transition: 'color 0.2s ease',
                }}
              >
                Política de Privacidad
              </Typography>
            </Stack>
          </Stack>
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
