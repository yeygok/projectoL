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
  Home as HomeIcon,
  Business as BusinessIcon,
  CleaningServices as CleaningServicesIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { categoriaService } from '../../services';

/**
 * Componente de la sección de servicios.
 * Muestra las categorías de servicios disponibles desde la BD en una grilla compacta.
 * @returns {JSX.Element} Sección de servicios
 */
export function ServicesSection() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  // Cargar categorías desde la BD
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await categoriaService.getAll();
        // El servicio ya maneja la estructura, devuelve el array directamente
        setCategorias(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setError('No se pudieron cargar las categorías de servicios.');
        // Datos de respaldo
        setCategorias([
          { id: 1, nombre: 'Colchones', descripcion: 'Limpieza profunda con vapor', icono: '🛏️' },
          { id: 2, nombre: 'Tapetes', descripcion: 'Renovación completa', icono: '🧺' },
          { id: 3, nombre: 'Cortinas', descripcion: 'Limpieza especializada', icono: '🪟' },
          { id: 4, nombre: 'Vehículos', descripcion: 'Lavado y desinfección', icono: '🚗' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // Mapeo de emojis para las categorías
  const getEmojiForCategoria = (categoria) => {
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

    const key = categoria.nombre?.toLowerCase() || '';
    return categoria.icono || emojiMap[key] || emojiMap['default'];
  };

  const handleSelectCategoria = (categoria) => {
    setSelectedCategoria(categoria);
  };

  const handleCloseDialog = () => {
    setSelectedCategoria(null);
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando servicios...</Typography>
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
    <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
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
            Nuestros Servicios
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Ofrecemos servicios especializados de limpieza para diferentes tipos de superficies y espacios
          </Typography>
        </Box>

        {/* Grilla de 3 columnas con categorías */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {categorias.slice(0, 6).map((categoria, index) => (
            <Grid item xs={12} sm={6} md={4} key={categoria.id || index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    '& .service-icon': {
                      transform: 'scale(1.1)',
                    }
                  },
                }}
                onClick={() => handleSelectCategoria(categoria)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Avatar
                    className="service-icon"
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {getEmojiForCategoria(categoria)}
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: '#333'
                    }}
                  >
                    {categoria.nombre}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.5,
                      minHeight: 40,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {categoria.descripcion || 'Servicio especializado de limpieza profesional'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 50,
                      px: 3,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#764ba2',
                        color: '#764ba2',
                        backgroundColor: 'rgba(102, 126, 234, 0.04)',
                      }
                    }}
                  >
                    Ver Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Botón para ver más servicios si hay más de 6 */}
        {categorias.length > 6 && (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Ver Todos los Servicios
            </Button>
          </Box>
        )}
      </Container>

      {/* Modal con detalles de la categoría seleccionada */}
      <Dialog
        open={!!selectedCategoria}
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
        {selectedCategoria && (
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}>
                {getEmojiForCategoria(selectedCategoria)}
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {selectedCategoria.nombre}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                {selectedCategoria.descripcion || 'Servicio especializado de limpieza profesional con técnicas avanzadas y productos de alta calidad.'}
              </Typography>

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                ¿Qué incluye este servicio?
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Limpieza profunda con técnicas especializadas" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Uso de productos profesionales y ecológicos" />
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  }
                }}
              >
                Solicitar Servicio
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}