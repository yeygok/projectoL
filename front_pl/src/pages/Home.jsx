import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  AppBar,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  AutoAwesome as SparklesIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importar componentes modulares
import {
  HeroSection,
  StatsSection,
  WhyChooseUsSection,
  ServicesSection,
  TestimonialsSection,
  PlansSection,
  AboutSection,
  ContactSection,
  FooterSection,
} from '../components/home';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

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

      {/* Secciones modulares del Home */}
      <HeroSection />
      <StatsSection statsVisible={statsVisible} />
      <WhyChooseUsSection />
      <ServicesSection />
      <TestimonialsSection />
      <PlansSection />
      <AboutSection />
      <ContactSection />
      <FooterSection />

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