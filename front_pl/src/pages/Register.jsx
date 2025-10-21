import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Avatar,
  Fade,
  Zoom,
} from '@mui/material';
import { CarRepair as ServiceIcon } from '@mui/icons-material';
import { useRegister, RegisterForm } from '../components/register';

/**
 * Componente principal de la página de registro de usuario.
 * Utiliza componentes modulares para mantener el código limpio y mantenible.
 * @returns {JSX.Element} Página de registro
 */
const Register = () => {
  const {
    showForm,
    handleSubmit,
    handleCancel,
    goToLogin,
    ...formProps
  } = useRegister();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Zoom in={showForm} timeout={600}>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            {/* Logo/Header */}
            <Fade in={showForm} timeout={800}>
              <Box>
                <Avatar
                  sx={{
                    mx: 'auto',
                    mb: 3,
                    bgcolor: 'primary.main',
                    width: 90,
                    height: 90,
                    fontSize: '2.5rem',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <ServiceIcon fontSize="large" />
                </Avatar>

                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  Crear Cuenta
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 4, fontWeight: 400 }}
                >
                  Únete a nuestra comunidad y agenda tus servicios fácilmente
                </Typography>
              </Box>
            </Fade>

            {/* Formulario */}
            <RegisterForm
              {...formProps}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              goToLogin={goToLogin}
            />
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};

export default Register;