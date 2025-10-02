import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClienteLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Inicio', path: '/cliente', icon: <HomeIcon /> },
    { label: 'Reservar', path: '/cliente/reservar', icon: <EventIcon /> },
    { label: 'Mis Reservas', path: '/cliente/reservas', icon: <HistoryIcon /> },
    { label: 'Mi Perfil', path: '/cliente/perfil', icon: <PersonIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo/Brand */}
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                flexGrow: 0,
                fontWeight: 700,
                cursor: 'pointer',
                mr: 4,
              }}
              onClick={() => navigate('/cliente')}
            >
              MEGA MALVADO
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    borderBottom: location.pathname === item.path ? 2 : 0,
                    borderRadius: 0,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* User Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                {user?.nombre} {user?.apellido}
              </Typography>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.nombre?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/cliente/perfil'); }}>
                  <PersonIcon sx={{ mr: 1 }} /> Mi Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => {
                      handleClose();
                      navigate(item.path);
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ ml: 2 }}>{item.label}</Typography>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon />
                  <Typography sx={{ ml: 2 }}>Cerrar Sesión</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: 3,
          textAlign: 'center',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="grey.400">
            © 2025 Mega Malvado Lavado Vapor. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" color="grey.500">
            Contáctanos: +57 300 123 4567 | info@megamalvado.com
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ClienteLayout;
