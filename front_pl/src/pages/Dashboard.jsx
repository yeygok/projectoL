import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  CarRepair as ServiceIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  AccountCircle as ProfileIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

// Importar componentes del dashboard
import DashboardHome from './DashboardHome';
import DashboardUsuarios from './DashboardUsuarios';
import DashboardProductos from './DashboardProductos';
import DashboardServicios from './DashboardServicios';
import DashboardAgendamientos from './DashboardAgendamientos';
import DashboardClientes from './DashboardClientes';
import DashboardRoles from './DashboardRoles';
import DashboardPermisos from './DashboardPermisos';
import DashboardTipos from './DashboardTipos';
import DashboardPerfil from './DashboardPerfil';

const drawerWidth = 280;

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar autenticación y obtener datos del usuario
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const menuItems = [
    { 
      path: '/dashboard', 
      name: 'Inicio', 
      icon: <DashboardIcon />,
      description: 'Vista general y estadísticas'
    },
    { 
      path: '/dashboard/agendamientos', 
      name: 'Citas', 
      icon: <CalendarIcon />,
      description: 'Gestionar reservas y citas'
    },
    { 
      path: '/dashboard/clientes', 
      name: 'Clientes', 
      icon: <PeopleIcon />,
      description: 'Administrar clientes'
    },
    { 
      path: '/dashboard/servicios', 
      name: 'Servicios', 
      icon: <ServiceIcon />,
      description: 'Gestionar servicios'
    },
    { 
      path: '/dashboard/usuarios', 
      name: 'Usuarios', 
      icon: <PersonIcon />,
      description: 'Administrar usuarios del sistema'
    },
    { 
      path: '/dashboard/roles', 
      name: 'Roles', 
      icon: <SecurityIcon />,
      description: 'Gestionar roles y permisos'
    },
    { 
      path: '/dashboard/tipos', 
      name: 'Configuración', 
      icon: <SettingsIcon />,
      description: 'Tipos de servicios y configuración'
    },
    { 
      path: '/dashboard/perfil', 
      name: 'Mi Perfil', 
      icon: <ProfileIcon />,
      description: 'Configuración de perfil'
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Verificar si el usuario está autenticado
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>🚗</Avatar>
        <Box>
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Lavado Vapor Bogotá
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.name}
                secondary={item.description}
                secondaryTypographyProps={{
                  variant: 'caption',
                  sx: { 
                    color: location.pathname === item.path ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    fontSize: '0.7rem'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto' }} />
      <Box sx={{ p: 2 }}>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: 'background.default'
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.nombre || 'Administrador'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.rol_nombre || 'Admin'}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel de Administración
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notificaciones">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Perfil">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<DashboardUsuarios />} />
          <Route path="clientes" element={<DashboardClientes />} />
          <Route path="servicios" element={<DashboardServicios />} />
          <Route path="agendamientos" element={<DashboardAgendamientos />} />
          <Route path="roles" element={<DashboardRoles />} />
          <Route path="permisos" element={<DashboardPermisos />} />
          <Route path="tipos" element={<DashboardTipos />} />
          <Route path="perfil" element={<DashboardPerfil />} />
        </Routes>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        <MenuItem onClick={() => navigate('/dashboard/perfil')}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Dashboard;
