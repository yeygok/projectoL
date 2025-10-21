import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Group as GroupIcon,
  EmojiEvents as EmojiEventsIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

/**
 * Componente de la sección "Sobre Nosotros".
 * Muestra la historia y valores de la empresa.
 * @returns {JSX.Element} Sección sobre nosotros
 */
export function AboutSection() {
  const hitos = [
    {
      año: '2015',
      titulo: 'Fundación',
      descripcion: 'Iniciamos nuestras operaciones con un pequeño equipo comprometido con la excelencia en limpieza.',
      icon: <TimelineIcon />,
      color: '#667eea'
    },
    {
      año: '2017',
      titulo: 'Expansión',
      descripcion: 'Ampliamos nuestros servicios a toda la ciudad y comenzamos a ofrecer limpieza comercial.',
      icon: <GroupIcon />,
      color: '#764ba2'
    },
    {
      año: '2020',
      titulo: 'Innovación',
      descripcion: 'Implementamos productos ecológicos y tecnología avanzada para mejorar nuestros servicios.',
      icon: <PublicIcon />,
      color: '#f093fb'
    },
    {
      año: '2023',
      titulo: 'Reconocimiento',
      descripcion: 'Somos reconocidos como la empresa líder en servicios de limpieza en la región.',
      icon: <EmojiEventsIcon />,
      color: '#4facfe'
    }
  ];

  const valores = [
    {
      titulo: 'Excelencia',
      descripcion: 'Nos esforzamos por superar las expectativas en cada servicio que realizamos.',
      icon: '⭐'
    },
    {
      titulo: 'Compromiso',
      descripcion: 'Estamos comprometidos con la satisfacción total de nuestros clientes.',
      icon: '🤝'
    },
    {
      titulo: 'Sostenibilidad',
      descripcion: 'Utilizamos productos y prácticas respetuosas con el medio ambiente.',
      icon: '🌱'
    },
    {
      titulo: 'Profesionalismo',
      descripcion: 'Nuestro equipo está formado por profesionales capacitados y éticos.',
      icon: '👔'
    }
  ];

  return (
    <Box
      id="about-section"
      sx={{
        bgcolor: 'grey.50',
        py: 10,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Nuestra Historia
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Más de una década transformando espacios y creando experiencias excepcionales
          </Typography>
        </Box>

        {/* Historia principal */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                De Pequeños Inicios a Grandes Resultados
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.7,
                  color: 'text.secondary',
                  fontSize: '1.1rem',
                }}
              >
                Fundada en 2015, nuestra empresa nació de la pasión por crear espacios limpios y saludables.
                Comenzamos como un pequeño equipo familiar, pero rápidamente nos dimos cuenta de que nuestra
                dedicación al detalle y compromiso con la calidad nos diferenciaba.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.7,
                  color: 'text.secondary',
                  fontSize: '1.1rem',
                }}
              >
                Hoy, somos líderes en el sector de limpieza profesional, atendiendo a miles de clientes
                residenciales y comerciales. Nuestra filosofía se basa en tres pilares fundamentales:
                calidad excepcional, respeto por el medio ambiente y atención personalizada.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#667eea',
                  '&:hover': {
                    bgcolor: '#667eea',
                    opacity: 0.9,
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Conoce Más Sobre Nosotros
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                borderRadius: 4,
                p: 4,
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.1)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: '6rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  8+
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  Años de Experiencia
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                >
                  Transformando espacios con pasión y profesionalismo
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Línea de tiempo de hitos */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            Nuestra Trayectoria
          </Typography>

          <Box sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '2px',
              bgcolor: '#667eea',
              transform: 'translateX(-50%)',
              display: { xs: 'none', md: 'block' },
            }
          }}>
            {hitos.map((hito, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                  alignItems: 'center',
                  mb: 6,
                  position: 'relative',
                }}
              >
                <Box sx={{
                  width: { xs: '100%', md: '45%' },
                  textAlign: { xs: 'center', md: index % 2 === 0 ? 'right' : 'left' },
                  pr: { md: index % 2 === 0 ? 4 : 0 },
                  pl: { md: index % 2 === 0 ? 0 : 4 },
                }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.1)',
                      border: `2px solid ${hito.color}20`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${hito.color}15`,
                            color: hito.color,
                          }}
                        >
                          {hito.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: hito.color,
                            }}
                          >
                            {hito.año}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {hito.titulo}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {hito.descripcion}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{
                  width: { xs: '20px', md: '10%' },
                  height: { xs: '20px', md: '10px' },
                  bgcolor: hito.color,
                  borderRadius: '50%',
                  position: 'relative',
                  zIndex: 1,
                  mx: { xs: 'auto', md: 0 },
                  my: { xs: 2, md: 0 },
                }} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Valores de la empresa */}
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            Nuestros Valores
          </Typography>

          <Grid container spacing={4}>
            {valores.map((valor, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(102, 126, 234, 0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: '3rem',
                        mb: 3,
                        opacity: 0.8,
                      }}
                    >
                      {valor.icon}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: 'text.primary',
                      }}
                    >
                      {valor.titulo}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                      }}
                    >
                      {valor.descripcion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}