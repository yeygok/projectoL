import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Zoom,
} from '@mui/material';
import {
  CleaningServices as CleanIcon,
  People as GroupsIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
} from '@mui/icons-material';

/**
 * Componente de la sección de estadísticas animadas.
 * Muestra números clave de la empresa con animaciones.
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.statsVisible - Si las estadísticas son visibles
 * @returns {JSX.Element} Sección de estadísticas
 */
export function StatsSection({ statsVisible }) {
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

  return (
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
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Números que Hablan por Sí Solos
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Más de una década transformando hogares con limpieza profesional
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 4,
        }}>
          {estadisticas.map((stat, index) => (
            <Zoom in={statsVisible} timeout={500 + (index * 200)} key={index}>
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
          ))}
        </Box>
      </Container>
    </Box>
  );
}