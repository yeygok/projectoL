import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Mostrar mensaje de bienvenida si viene del registro
    if (location.state?.welcomeMessage) {
      setWelcomeMessage(location.state.welcomeMessage);
      setShowWelcome(true);
      
      // Limpiar el state después de mostrarlo
      window.history.replaceState({}, document.title);
      
      // Auto-cerrar después de 8 segundos
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const menuItems = [
    {
      title: 'Mi Perfil',
      description: 'Ver y editar mi información',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      path: '/cliente/perfil',
      color: '#1976d2',
    },
    {
      title: 'Nueva Reserva',
      description: 'Agendar un nuevo servicio',
      icon: <AddIcon sx={{ fontSize: 40 }} />,
      path: '/cliente/reservar',
      color: '#2e7d32',
    },
    {
      title: 'Mis Reservas',
      description: 'Ver historial de servicios',
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      path: '/cliente/reservas',
      color: '#ed6c02',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '80vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Mensaje de Bienvenida */}
        <Collapse in={showWelcome}>
          <Alert
            severity="success"
            sx={{
              mb: 4,
              fontSize: '1.1rem',
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowWelcome(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {welcomeMessage}
          </Alert>
        </Collapse>

        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            ¡Bienvenido, {user?.nombre}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            ¿Qué deseas hacer hoy?
          </Typography>
        </Box>

        {/* Menu Cards */}
        <Grid container spacing={4} justifyContent="center">
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(item.path)}
                  sx={{ height: '100%', p: 3 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: item.color,
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            ¿Necesitas ayuda?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Contáctanos: +57 300 123 4567 | info@megamalvado.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Horarios de atención: Lun - Sáb, 7:00 AM - 6:00 PM
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ClienteDashboard;
