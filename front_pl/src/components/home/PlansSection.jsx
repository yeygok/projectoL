import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { tipoServicioService } from '../../services';

/**
 * Componente de la sección de planes/tipos de servicio.
 * Muestra los tipos de servicio disponibles desde la BD en una grilla compacta.
 * @returns {JSX.Element} Sección de planes
 */
export function PlansSection() {
  const [tiposServicio, setTiposServicio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Cargar tipos de servicio desde la BD
  useEffect(() => {
    const fetchTiposServicio = async () => {
      try {
        setLoading(true);
        const data = await tipoServicioService.getAll();
        // El servicio ya maneja la estructura, devuelve el array directamente
        setTiposServicio(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setError('No se pudieron cargar los tipos de servicio.');
        // Datos de respaldo
        setTiposServicio([
          { id: 1, nombre: 'Sencillo', descripcion: 'Servicio básico de limpieza', precio_base: 50 },
          { id: 2, nombre: 'Premium', descripcion: 'Servicio completo con productos premium', precio_base: 80 },
          { id: 3, nombre: 'Gold', descripcion: 'Servicio VIP con atención personalizada', precio_base: 120 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTiposServicio();
  }, []);

  // Calcular precio dinámico basado en el tipo de servicio
  const calcularPrecio = (tipoServicio) => {
    const basePrice = tipoServicio.precio_base || 50;
    const multipliers = {
      'sencillo': 1,
      'premium': 1.6,
      'gold': 2.4,
      'vip': 3.0
    };

    const multiplier = multipliers[tipoServicio.nombre?.toLowerCase()] || 1;
    return Math.round(basePrice * multiplier);
  };

  // Obtener color del plan
  const getPlanColor = (tipoServicio) => {
    const colors = {
      'sencillo': '#4caf50',
      'premium': '#2196f3',
      'gold': '#ff9800',
      'vip': '#9c27b0'
    };

    return colors[tipoServicio.nombre?.toLowerCase()] || '#667eea';
  };

  // Verificar si es plan popular
  const isPopularPlan = (tipoServicio) => {
    return tipoServicio.nombre?.toLowerCase() === 'premium';
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleCloseDialog = () => {
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando planes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="warning">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, backgroundColor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Nuestros Planes
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Elige el plan que mejor se adapte a tus necesidades de limpieza
          </Typography>
        </Box>

        {/* Grilla de 3 columnas con tipos de servicio */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {tiposServicio.slice(0, 3).map((tipoServicio, index) => {
            const precio = calcularPrecio(tipoServicio);
            const color = getPlanColor(tipoServicio);
            const popular = isPopularPlan(tipoServicio);

            return (
              <Grid item xs={12} sm={6} md={4} key={tipoServicio.id || index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 3,
                    boxShadow: popular ? '0 8px 32px rgba(33, 150, 243, 0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                    border: popular ? `2px solid ${color}` : 'none',
                    transform: popular ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: popular ? 'scale(1.08)' : 'translateY(-8px)',
                      boxShadow: popular ? '0 12px 40px rgba(33, 150, 243, 0.4)' : '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                      }}
                    >
                      <Chip
                        label="Más Popular"
                        sx={{
                          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                          color: 'white',
                          fontWeight: 600,
                          px: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                        icon={<StarIcon />}
                      />
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3, pt: popular ? 4 : 3 }}>
                    <Avatar
                      sx={{
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem',
                        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                      }}
                    >
                      {tipoServicio.nombre?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: '#333'
                      }}
                    >
                      {tipoServicio.nombre}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        minHeight: 40,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {tipoServicio.descripcion || 'Servicio profesional de limpieza con calidad garantizada'}
                    </Typography>

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: color,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>$</span>
                      {precio}
                      <span style={{ fontSize: '1rem', fontWeight: 400, color: 'text.secondary' }}>/servicio</span>
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                      variant={popular ? "contained" : "outlined"}
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleSelectPlan(tipoServicio)}
                      sx={{
                        borderRadius: 50,
                        px: 4,
                        py: 1.5,
                        ...(popular ? {
                          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                          color: 'white',
                          boxShadow: `0 4px 20px rgba(33, 150, 243, 0.3)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${color}dd 0%, ${color} 100%)`,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 30px rgba(33, 150, 243, 0.4)`,
                          },
                        } : {
                          borderColor: color,
                          color: color,
                          '&:hover': {
                            borderColor: color,
                            backgroundColor: `${color}10`,
                            transform: 'translateY(-2px)',
                          },
                        }),
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {popular ? 'Elegir Plan' : 'Ver Detalles'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Modal con detalles del plan seleccionado */}
      <Dialog
        open={!!selectedPlan}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        {selectedPlan && (
          <>
            <DialogTitle sx={{
              textAlign: 'center',
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <Avatar sx={{
                width: 60,
                height: 60,
                fontSize: '2rem',
                background: `linear-gradient(135deg, ${getPlanColor(selectedPlan)} 0%, ${getPlanColor(selectedPlan)}dd 100%)`
              }}>
                {selectedPlan.nombre?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Plan {selectedPlan.nombre}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                {selectedPlan.descripcion || 'Servicio profesional de limpieza con atención especializada y productos de alta calidad.'}
              </Typography>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: getPlanColor(selectedPlan) }}>
                  ${calcularPrecio(selectedPlan)}
                  <span style={{ fontSize: '1rem', fontWeight: 400, color: 'text.secondary' }}>/servicio</span>
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                ¿Qué incluye este plan?
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Limpieza profunda y detallada" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Productos profesionales y ecológicos" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Personal capacitado y certificado" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Garantía de satisfacción" />
                </ListItem>
                {selectedPlan.nombre?.toLowerCase() === 'premium' && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Servicio express disponible" />
                  </ListItem>
                )}
                {selectedPlan.nombre?.toLowerCase() === 'gold' && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Servicio express disponible" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Atención 24/7" />
                    </ListItem>
                  </>
                )}
              </List>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ borderRadius: 50, px: 3 }}
              >
                Cerrar
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 50,
                  px: 4,
                  background: `linear-gradient(135deg, ${getPlanColor(selectedPlan)} 0%, ${getPlanColor(selectedPlan)}dd 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${getPlanColor(selectedPlan)}dd 0%, ${getPlanColor(selectedPlan)} 100%)`,
                  }
                }}
              >
                Contratar Plan
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}