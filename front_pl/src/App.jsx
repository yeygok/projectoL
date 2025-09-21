import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { ProtectedRoute } from './components/common';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClienteProfile from './pages/ClienteProfile';

// Componente para redireccionar según el rol
const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redireccionar según el rol del usuario
  switch (user?.rol?.nombre) {
    case ROLES.ADMIN:
      return <Navigate to="/dashboard" replace />;
    case ROLES.CLIENTE:
      return <Navigate to="/cliente" replace />;
    case ROLES.TECNICO:
      return <Navigate to="/tecnico" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Componente principal de rutas
const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública - Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Redirección basada en rol */}
      <Route path="/" element={<RoleBasedRedirect />} />
      
      {/* Rutas de Admin */}
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas de Cliente */}
      <Route 
        path="/cliente/*" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENTE]}>
            <Routes>
              <Route index element={<Navigate to="/cliente/perfil" replace />} />
              <Route path="perfil" element={<ClienteProfile />} />
              {/* Aquí agregaremos más rutas de cliente */}
            </Routes>
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas de Técnico (para futuro) */}
      <Route 
        path="/tecnico/*" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.TECNICO]}>
            <div>Panel de Técnico - En desarrollo</div>
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta catch-all - redirige según autenticación */}
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
