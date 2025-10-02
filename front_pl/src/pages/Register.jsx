import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Alert,
  Container,
  Avatar,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  CarRepair as ServiceIcon,
} from '@mui/icons-material';

import { Button } from '../components/common';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono || !formData.password) {
      setError('Todos los campos son requeridos');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    // Validar teléfono (solo números, 10 dígitos)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.telefono.replace(/\s/g, ''))) {
      setError('Teléfono inválido (debe ser 10 dígitos)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Registrar el usuario como CLIENTE (rol_id = 2)
      const registerData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        rol_id: 2 // Cliente
      };

      const result = await register(registerData);

      if (result.success) {
        // Registro y login exitoso - redirigir según el contexto
        const from = location.state?.from;
        const categoriaPreseleccionada = location.state?.categoriaPreseleccionada;
        
        if (from === '/cliente/reservar' && categoriaPreseleccionada) {
          // Si venía de un intento de reserva, llevarlo directamente allí
          navigate('/cliente/reservar', { 
            state: { categoriaPreseleccionada },
            replace: true 
          });
        } else {
          // Ir al dashboard del cliente con mensaje de bienvenida
          navigate('/cliente', { 
            state: { 
              welcomeMessage: `¡Bienvenido ${formData.nombre}! Tu cuenta ha sido creada exitosamente.` 
            },
            replace: true 
          });
        }
      } else {
        setError(result.message || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al registrar usuario. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          {/* Logo/Header */}
          <Avatar
            sx={{
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              width: 80,
              height: 80,
              fontSize: '2rem'
            }}
          >
            <ServiceIcon fontSize="large" />
          </Avatar>
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Crear Cuenta
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Regístrate para agendar tus servicios
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Nombre */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={handleInputChange('nombre')}
                  variant="outlined"
                  required
                  placeholder="Juan"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Apellido */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.apellido}
                  onChange={handleInputChange('apellido')}
                  variant="outlined"
                  required
                  placeholder="Pérez"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  variant="outlined"
                  required
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={handleInputChange('telefono')}
                  variant="outlined"
                  required
                  placeholder="3001234567"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Contraseña */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  variant="outlined"
                  required
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Confirmar Contraseña */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  variant="outlined"
                  required
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none'
              }}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              ¿Ya tienes cuenta?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/login', { state: location.state })}
                sx={{ textTransform: 'none', p: 0 }}
              >
                Inicia sesión aquí
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
