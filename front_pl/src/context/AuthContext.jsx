import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services';

// Constantes de roles
export const ROLES = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  TECNICO: 'tecnico',
  SOPORTE: 'soporte'
};

export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await authService.verifyToken();
      if (response.valid && response.user) {
        setUser(response.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token inválido:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        return { success: false, message: 'Credenciales incorrectas' };
      }
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.message || 'Error de conexión' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoading(false);
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.message || 'Error al registrar usuario' 
      };
    }
  };

  // Funciones de utilidad para roles
  const hasRole = (role) => {
    return user?.rol?.nombre === role;
  };

  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isCliente = () => hasRole(ROLES.CLIENTE);
  const isTecnico = () => hasRole(ROLES.TECNICO);
  const isSoporte = () => hasRole(ROLES.SOPORTE);

  const hasPermission = (permission) => {
    return user?.permisos?.some(p => p.nombre === permission) || false;
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      // Actualizar perfil en backend
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const value = {
    // Estado
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    
    // Acciones
    login,
    logout,
    register,
    updateProfile,
    
    // Utilidades de rol
    hasRole,
    isAdmin,
    isCliente,
    isTecnico,
    isSoporte,
    hasPermission,
    
    // Datos del usuario
    userRole: user?.rol?.nombre || null,
    userName: user ? `${user.nombre} ${user.apellido}` : null,
    userEmail: user?.email || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
