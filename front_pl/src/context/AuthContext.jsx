import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Validar token con backend
      verifyToken();
    } else {
      setUser(null);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const userData = await authService.verifyToken();
      setUser(userData);
    } catch (error) {
      console.error('Token inválido:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
        }
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        return { success: false, message: data.message || 'Credenciales incorrectas' };
      }
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.message || 'Error de red o servidor' 
      };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setToken('');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
    }
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      register,
      loading,
      isAuthenticated: !!user && !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
