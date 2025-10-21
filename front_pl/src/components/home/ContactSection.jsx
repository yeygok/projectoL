import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

/**
 * Componente de la sección de contacto.
 * Muestra información de contacto y formulario.
 * @returns {JSX.Element} Sección de contacto
 */
export function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s-()]{8,}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono no es válido';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSnackbar({
        open: true,
        message: '¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.',
        severity: 'success'
      });

      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const infoContacto = [
    {
      icon: <PhoneIcon />,
      titulo: 'Teléfono',
      info: '+56 9 1234 5678',
      descripcion: 'Llámanos para consultas inmediatas',
      color: '#667eea'
    },
    {
      icon: <EmailIcon />,
      titulo: 'Email',
      info: 'contacto@limpiezapro.cl',
      descripcion: 'Envíanos un correo electrónico',
      color: '#764ba2'
    },
    {
      icon: <LocationOnIcon />,
      titulo: 'Dirección',
      info: 'Av. Providencia 123, Santiago',
      descripcion: 'Visítanos en nuestras oficinas',
      color: '#f093fb'
    },
    {
      icon: <AccessTimeIcon />,
      titulo: 'Horario',
      info: 'Lun - Vie: 8:00 - 18:00',
      descripcion: 'Sáb: 9:00 - 14:00',
      color: '#4facfe'
    }
  ];

  return (
    <Box
      id="contact-section"
      sx={{
        bgcolor: 'white',
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
            Contáctanos
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
            Estamos aquí para ayudarte. Ponte en contacto con nosotros y resolveremos todas tus dudas
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Información de contacto */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: 'text.primary',
                }}
              >
                Información de Contacto
              </Typography>

              <Grid container spacing={3}>
                {infoContacto.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        border: `1px solid ${item.color}20`,
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: `0 10px 25px ${item.color}20`,
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: `${item.color}15`,
                            color: item.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: 'text.primary',
                          }}
                        >
                          {item.titulo}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            color: item.color,
                          }}
                        >
                          {item.info}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {item.descripcion}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Mapa embebido o placeholder */}
            <Box
              sx={{
                height: 300,
                bgcolor: 'grey.100',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #667eea40',
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                📍 Mapa de ubicación<br />
                Av. Providencia 123, Santiago, Chile
              </Typography>
            </Box>
          </Grid>

          {/* Formulario de contacto */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'text.primary',
                    textAlign: 'center',
                  }}
                >
                  Envíanos un Mensaje
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre completo"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mensaje"
                        name="mensaje"
                        multiline
                        rows={4}
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        error={!!errors.mensaje}
                        helperText={errors.mensaje}
                        variant="outlined"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 3,
                          bgcolor: '#667eea',
                          '&:hover': {
                            bgcolor: '#667eea',
                            opacity: 0.9,
                          },
                          '&:disabled': {
                            bgcolor: 'grey.400',
                          }
                        }}
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}