import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  MobileStepper,
} from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  FormatQuote as FormatQuoteIcon,
} from '@mui/icons-material';

/**
 * Componente de la sección de testimonios.
 * Muestra testimonios de clientes con navegación.
 * @returns {JSX.Element} Sección de testimonios
 */
export function TestimonialsSection() {
  const [activeStep, setActiveStep] = useState(0);

  const testimonios = [
    {
      id: 1,
      nombre: 'María González',
      profesion: 'Madre de Familia',
      foto: '/api/placeholder/80/80',
      calificacion: 5,
      comentario: 'Excelente servicio de limpieza. El equipo llegó puntual, trabajaron de manera profesional y dejaron mi casa impecable. Los productos que utilizan son de muy buena calidad y no dejan olores fuertes. Definitivamente los recomiendo.',
      servicio: 'Limpieza Residencial'
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez',
      profesion: 'Empresario',
      foto: '/api/placeholder/80/80',
      calificacion: 5,
      comentario: 'Llevamos contratando sus servicios para nuestra oficina por más de 2 años. Siempre cumplen con los plazos, el personal es muy responsable y el resultado es excepcional. Han mejorado significativamente la imagen de nuestro espacio de trabajo.',
      servicio: 'Limpieza Comercial'
    },
    {
      id: 3,
      nombre: 'Ana López',
      profesion: 'Profesora',
      foto: '/api/placeholder/80/80',
      calificacion: 5,
      comentario: 'Después de mi mudanza, necesitaba una limpieza profunda y estos profesionales hicieron un trabajo increíble. Limpiaron lugares que ni siquiera había considerado. El precio es muy competitivo y la calidad supera las expectativas.',
      servicio: 'Limpieza Profunda'
    },
    {
      id: 4,
      nombre: 'Roberto Martínez',
      profesion: 'Médico',
      foto: '/api/placeholder/80/80',
      calificacion: 5,
      comentario: 'Como médico, la higiene es fundamental para mí. Este servicio entiende la importancia de la desinfección y utiliza productos apropiados. Mi consulta siempre está impecable y mis pacientes lo notan. Servicio de primera calidad.',
      servicio: 'Limpieza Residencial'
    },
    {
      id: 5,
      nombre: 'Patricia Silva',
      profesion: 'Abogada',
      foto: '/api/placeholder/80/80',
      calificacion: 5,
      comentario: 'He probado varios servicios de limpieza, pero este es sin duda el mejor. Son puntuales, profesionales y dejan todo perfecto. Además, ofrecen flexibilidad horaria que se adapta perfectamente a mi agenda de trabajo.',
      servicio: 'Limpieza Residencial'
    }
  ];

  const maxSteps = testimonios.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  // Auto-rotación de testimonios
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000); // Cambia cada 8 segundos

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      id="testimonials-section"
      sx={{
        bgcolor: 'grey.50',
        py: 10,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)',
        }
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Lo Que Dicen Nuestros Clientes
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            La satisfacción de nuestros clientes es nuestra mayor recompensa
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', mb: 4 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.1)',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <FormatQuoteIcon
                  sx={{
                    fontSize: 60,
                    color: '#667eea',
                    opacity: 0.3,
                    mb: 2,
                  }}
                />
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  mb: 4,
                  fontStyle: 'italic',
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                "{testimonios[activeStep].comentario}"
              </Typography>

              <Box sx={{ textAlign: 'center' }}>
                <Rating
                  value={testimonios[activeStep].calificacion}
                  readOnly
                  sx={{
                    mb: 2,
                    '& .MuiRating-iconFilled': {
                      color: '#ffb400',
                    }
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
                  <Avatar
                    src={testimonios[activeStep].foto}
                    sx={{
                      width: 60,
                      height: 60,
                      border: '3px solid #667eea',
                    }}
                  >
                    {testimonios[activeStep].nombre.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {testimonios[activeStep].nombre}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {testimonios[activeStep].profesion}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: '#667eea20',
                        color: '#667eea',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 600,
                      }}
                    >
                      {testimonios[activeStep].servicio}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Controles de navegación */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 3,
            gap: 2,
          }}>
            <IconButton
              onClick={handleBack}
              sx={{
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: '#667eea',
                  color: 'white',
                }
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>

            <MobileStepper
              variant="dots"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              sx={{
                bgcolor: 'transparent',
                '& .MuiMobileStepper-dot': {
                  bgcolor: 'rgba(102, 126, 234, 0.3)',
                },
                '& .MuiMobileStepper-dotActive': {
                  bgcolor: '#667eea',
                }
              }}
            />

            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: '#667eea',
                  color: 'white',
                }
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Estadísticas de testimonios */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#667eea',
                mb: 1,
              }}
            >
              4.9/5
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calificación Promedio
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#667eea',
                mb: 1,
              }}
            >
              500+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reseñas Verificadas
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#667eea',
                mb: 1,
              }}
            >
              98%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recomiendan el Servicio
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}