import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  CarRepair as ServiceIcon,
} from '@mui/icons-material';

import { Button } from '../components/common';
import { useAuth, ROLES } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [justLoggedIn, setJustLoggedIn] = useState(false);  // ✅ NUEVO
  
  const { login, loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mostrar mensaje de éxito si viene del registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el mensaje después de mostrarlo
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Redireccionar solo si acaba de hacer login exitoso
  useEffect(() => {
    if (isAuthenticated && user && justLoggedIn) {
      const from = location.state?.from?.pathname;
      const categoriaPreseleccionada = location.state?.categoriaPreseleccionada;
      
      if (from && categoriaPreseleccionada) {
        // Si viene con categoría pre-seleccionada, ir directo a reservar
        navigate(from, { 
          state: { categoriaPreseleccionada },
          replace: true 
        });
      } else if (from) {
        navigate(from, { replace: true });
      } else {
        // Redireccionar según el rol
        switch (user.rol?.nombre) {
          case ROLES.ADMIN:
            navigate('/dashboard', { replace: true });
            break;
          case ROLES.CLIENTE:
            navigate('/cliente', { replace: true });
            break;
          case ROLES.TECNICO:
            navigate('/tecnico', { replace: true });
            break;
          default:
            navigate('/cliente', { replace: true });
        }
      }
      setJustLoggedIn(false); // Reset flag
    }
  }, [isAuthenticated, user, justLoggedIn, navigate, location]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Limpiar mensajes al escribir
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // ✅ Marcar que acaba de hacer login exitoso
      setJustLoggedIn(true);
    } else {
      setError(result.message || 'Error de autenticación');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      <Container maxWidth="sm">
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
            Mega Malvado
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Sistema de Gestión de Servicios
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              margin="normal"
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
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              margin="normal"
              variant="outlined"
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 3 }}
            />

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
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
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                mb: 2
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate('/register', { state: location.state })}
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                mb: 3
              }}
            >
              Crear Cuenta Nueva
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            🎯 <strong>Nuevo usuario?</strong> Crea tu cuenta para acceder a nuestros servicios de lavado con vapor
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
