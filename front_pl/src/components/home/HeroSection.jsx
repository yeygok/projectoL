import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Fade,
  Zoom,
  Slide,
  Avatar,
} from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  WhatsApp as WhatsAppIcon,
  Star as StarIcon,
} from '@mui/icons-material';

/**
 * Componente de la sección Hero del Home.
 * Contiene el título principal, descripción y botones de acción.
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isAuthenticated - Si el usuario está autenticado
 * @param {Function} props.navigate - Función de navegación
 * @returns {JSX.Element} Sección Hero
 */
export function HeroSection({ isAuthenticated, navigate }) {
  return (
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
        <Typography variant="h1" sx={{ fontSize: '5rem' }}>🧼</Typography>
      </Box>
      <Box sx={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        animation: 'float 5s ease-in-out infinite',
        animationDelay: '1s',
        opacity: 0.3,
      }}>
        <Typography variant="h1" sx={{ fontSize: '6rem' }}>💨</Typography>
      </Box>
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        left: '15%',
        animation: 'float 7s ease-in-out infinite',
        animationDelay: '2s',
        opacity: 0.3,
      }}>
        <Typography variant="h1" sx={{ fontSize: '4rem' }}>⚡</Typography>
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
              <span style={{
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
                <Slide direction="up" in timeout={1000 + (index * 200)} key={index}>
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
                </Slide>
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
  );
}