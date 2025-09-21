import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Stack,
} from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback(({
    message,
    type = 'info',
    title,
    duration = 6000,
    action,
    persistent = false,
  }) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      title,
      duration,
      action,
      persistent,
    };

    setNotifications(prev => [...prev, notification]);

    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniencia
  const showSuccess = useCallback((message, options = {}) => {
    return showNotification({
      message,
      type: 'success',
      ...options,
    });
  }, [showNotification]);

  const showError = useCallback((message, options = {}) => {
    return showNotification({
      message,
      type: 'error',
      duration: 8000, // Errores duran más
      ...options,
    });
  }, [showNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return showNotification({
      message,
      type: 'warning',
      ...options,
    });
  }, [showNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return showNotification({
      message,
      type: 'info',
      ...options,
    });
  }, [showNotification]);

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Stack de notificaciones */}
      <Stack
        spacing={1}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          maxWidth: 400,
        }}
      >
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            open={true}
            TransitionComponent={SlideTransition}
            sx={{ position: 'relative' }}
          >
            <Alert
              onClose={() => removeNotification(notification.id)}
              severity={notification.type}
              variant="filled"
              action={notification.action}
              sx={{ width: '100%' }}
            >
              {notification.title && (
                <AlertTitle>{notification.title}</AlertTitle>
              )}
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </NotificationContext.Provider>
  );
};
