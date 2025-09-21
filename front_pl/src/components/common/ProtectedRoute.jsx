import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente para proteger rutas basado en roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si tiene acceso
 * @param {string[]} props.allowedRoles - Roles permitidos para acceder
 * @param {string} props.redirectTo - Ruta de redirección si no tiene acceso
 * @param {boolean} props.requireAuth - Si requiere autenticación
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login',
  requireAuth = true 
}) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verificando acceso...
        </Typography>
      </Box>
    );
  }

  // Verificar autenticación
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar roles si están especificados
  if (allowedRoles.length > 0 && user) {
    const hasValidRole = allowedRoles.some(role => hasRole(role));
    
    if (!hasValidRole) {
      // Redireccionar según el rol del usuario
      const userRole = user.rol?.nombre;
      let defaultRoute = '/login';
      
      switch (userRole) {
        case 'admin':
          defaultRoute = '/dashboard';
          break;
        case 'cliente':
          defaultRoute = '/cliente';
          break;
        case 'tecnico':
          defaultRoute = '/tecnico';
          break;
        default:
          defaultRoute = '/login';
      }
      
      return <Navigate to={defaultRoute} replace />;
    }
  }

  // Si pasa todas las validaciones, renderizar el componente
  return children;
};

/**
 * HOC para proteger componentes con roles específicos
 * @param {React.Component} Component - Componente a proteger
 * @param {string[]} allowedRoles - Roles permitidos
 */
export const withRoleProtection = (Component, allowedRoles) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

/**
 * Componente para mostrar contenido condicionalmente basado en roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a mostrar
 * @param {string[]} props.roles - Roles requeridos
 * @param {React.ReactNode} props.fallback - Contenido alternativo
 */
export const RoleGuard = ({ children, roles = [], fallback = null }) => {
  const { user, hasRole } = useAuth();

  if (!user || roles.length === 0) {
    return fallback;
  }

  const hasValidRole = roles.some(role => hasRole(role));
  
  return hasValidRole ? children : fallback;
};

/**
 * Hook para verificar permisos de manera reactiva
 */
export const usePermissions = () => {
  const { user, hasRole, hasPermission, isAdmin, isCliente, isTecnico } = useAuth();

  const can = {
    // Acciones administrativas
    manageUsers: () => isAdmin(),
    manageServices: () => isAdmin(),
    viewReports: () => isAdmin() || hasRole('soporte'),
    
    // Acciones de cliente
    createReservation: () => isCliente(),
    viewMyReservations: () => isCliente(),
    updateProfile: () => isCliente() || isTecnico(),
    
    // Acciones de técnico
    acceptReservation: () => isTecnico(),
    updateReservationStatus: () => isTecnico(),
    viewAssignedReservations: () => isTecnico(),
    
    // Permisos específicos
    hasPermission: (permission) => hasPermission(permission)
  };

  return {
    user,
    can,
    hasRole,
    hasPermission
  };
};

export default ProtectedRoute;
