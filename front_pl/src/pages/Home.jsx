import React from 'react';
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

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const servicios = [
    {
      nombre: 'Colchones',
      descripcion: 'Limpieza profunda de colchones con vapor',
      imagen: '/api/placeholder/300/200',
      tipos: ['Sencillo', 'Premium', 'Gold']
    },
    {
      nombre: 'Tapetes',
      descripcion: 'Renovación completa de tapetes y alfombras',
      imagen: '/api/placeholder/300/200',
      tipos: ['Sencillo', 'Premium', 'Gold']
    },
    {
      nombre: 'Cortinas',
      descripcion: 'Limpieza especializada de cortinas y persianas',
      imagen: '/api/placeholder/300/200',
      tipos: ['Sencillo', 'Premium', 'Gold']
    },
    {
      nombre: 'Vehículos',
      descripción: 'Lavado y desinfección de interiores de vehículos',
      imagen: '/api/placeholder/300/200',
      tipos: ['Sencillo', 'Premium', 'Gold']
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 2,
        boxShadow: 2
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              MEGA MALVADO
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600 }}
              >
                Iniciar Sesión
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Lavado Vapor Profesional
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Limpieza profunda con vapor para colchones, tapetes, cortinas y vehículos
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Chip 
              icon={<CheckIcon />} 
              label="Sin químicos tóxicos" 
              color="secondary" 
              variant="filled"
            />
            <Chip 
              icon={<CheckIcon />} 
              label="100% Ecológico" 
              color="secondary" 
              variant="filled"
            />
            <Chip 
              icon={<CheckIcon />} 
              label="Secado rápido" 
              color="secondary" 
              variant="filled"
            />
          </Stack>

          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate('/login')}
            sx={{ 
              px: 4, 
              py: 2, 
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: 3
            }}
          >
            Agenda tu Servicio
          </Button>
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

        <Grid container spacing={4}>
          {servicios.map((servicio, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <Box sx={{ 
                  height: 200, 
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CleanIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {servicio.nombre}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {servicio.descripcion}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {servicio.tipos.map((tipo, i) => (
                      <Chip 
                        key={i}
                        label={tipo} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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

          <Grid container spacing={4}>
            {[
              {
                nombre: 'Sencillo',
                precio: 'Desde $50,000',
                descripcion: 'Limpieza básica con vapor',
                caracteristicas: ['Limpieza superficial', 'Desinfección básica', 'Secado natural']
              },
              {
                nombre: 'Premium',
                precio: 'Desde $80,000',
                descripcion: 'Limpieza profunda con tratamiento',
                caracteristicas: ['Limpieza profunda', 'Tratamiento antialergenos', 'Pre-tratamiento de manchas']
              },
              {
                nombre: 'Gold',
                precio: 'Desde $120,000',
                descripcion: 'Servicio completo premium',
                caracteristicas: ['Todo Premium +', 'Protección antimanchas', 'Garantía extendida', 'Servicio a domicilio']
              }
            ].map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  height: '100%',
                  border: index === 1 ? 2 : 0,
                  borderColor: 'primary.main',
                  position: 'relative'
                }}>
                  {index === 1 && (
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
                    {plan.nombre}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                    {plan.precio}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {plan.descripcion}
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 4 }}>
                    {plan.caracteristicas.map((caracteristica, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography>{caracteristica}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Button 
                    variant={index === 1 ? "contained" : "outlined"} 
                    fullWidth
                    onClick={() => navigate('/login')}
                  >
                    Seleccionar Plan
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
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
