import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../components/common';

const DashboardPerfil = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await updateProfile(profileData);
      setEditMode(false);
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
        return;
      }

      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setProfileData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <NotificationProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Gestiona tu información personal y configuración de cuenta
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Información del Perfil */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ mr: 2, width: 56, height: 56, bgcolor: 'primary.main' }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {user?.nombre} {user?.apellido}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.rol_nombre || 'Usuario'}
                    </Typography>
                  </Box>
                  {!editMode && (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{ ml: 'auto' }}
                    >
                      Editar
                    </Button>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre"
                      value={profileData.nombre}
                      onChange={(e) => handleProfileChange('nombre', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Apellido"
                      value={profileData.apellido}
                      onChange={(e) => handleProfileChange('apellido', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                      size="small"
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Teléfono"
                      value={profileData.telefono}
                      onChange={(e) => handleProfileChange('telefono', e.target.value)}
                      disabled={!editMode}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Cambiar Contraseña */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                    <LockIcon />
                  </Avatar>
                  <Typography variant="h6">
                    Cambiar Contraseña
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Contraseña Actual"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Nueva Contraseña"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      fullWidth
                      size="small"
                      helperText="Mínimo 6 caracteres"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirmar Nueva Contraseña"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={16} /> : <LockIcon />}
                    onClick={handleChangePassword}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    fullWidth
                  >
                    Cambiar Contraseña
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Información de la Cuenta */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de la Cuenta
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Usuario:
                    </Typography>
                    <Typography variant="body1">
                      {user?.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rol:
                    </Typography>
                    <Typography variant="body1">
                      {user?.rol_nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Estado:
                    </Typography>
                    <Typography variant="body1">
                      {user?.estado_nombre || 'Activo'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Registro:
                    </Typography>
                    <Typography variant="body1">
                      {user?.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </NotificationProvider>
  );
};

export default DashboardPerfil;
