import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
} from '@mui/icons-material';

import { Button, Input, Card } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';

const ClienteProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Handlers
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!profileData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }
    if (!profileData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al actualizar perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al cambiar contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      telefono: user?.telefono || ''
    });
    setErrors({});
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  // Clear message after 5 seconds
  React.useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getInitials = () => {
    const firstName = user?.nombre?.charAt(0) || '';
    const lastName = user?.apellido?.charAt(0) || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            width: 100, 
            height: 100, 
            mx: 'auto', 
            mb: 2, 
            bgcolor: 'primary.main',
            fontSize: '2rem'
          }}
        >
          {getInitials()}
        </Avatar>
        <Typography variant="h4" gutterBottom>
          Mi Perfil
        </Typography>
        <Chip 
          label={user?.rol?.nombre?.toUpperCase() || 'CLIENTE'} 
          color="primary" 
          sx={{ textTransform: 'capitalize', mb: 2 }}
        />
        
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            onClick={() => navigate('/cliente/reservar')}
          >
            Nueva Reserva
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/cliente/reservas')}
          >
            Ver Mis Reservas
          </Button>
        </Box>
      </Box>

      {/* Messages */}
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card title="Información Personal" variant="elevated">
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Input
                    label="Nombre"
                    value={profileData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    disabled={!isEditing}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    fullWidth
                    startAdornment={<PersonIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Input
                    label="Apellido"
                    value={profileData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    disabled={!isEditing}
                    error={!!errors.apellido}
                    helperText={errors.apellido}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    startAdornment={<EmailIcon />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    label="Teléfono"
                    value={profileData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    disabled={!isEditing}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    fullWidth
                    startAdornment={<PhoneIcon />}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      Guardar Cambios
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card title="Seguridad" variant="elevated">
            <Box sx={{ p: 3 }}>
              {!isChangingPassword ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2">
                        Contraseña
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ••••••••••••
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setIsChangingPassword(true)}
                    fullWidth
                  >
                    Cambiar Contraseña
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Input
                      label="Contraseña Actual"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      label="Nueva Contraseña"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      label="Confirmar Nueva Contraseña"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleCancelPassword}
                        fullWidth
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={loading}
                        fullWidth
                      >
                        Cambiar
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Account Info */}
        <Grid item xs={12}>
          <Card title="Información de la Cuenta" variant="elevated">
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tipo de Cuenta
                  </Typography>
                  <Typography variant="body1">
                    {user?.rol?.descripcion || 'Cliente del sistema'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Último Acceso
                  </Typography>
                  <Typography variant="body1">
                    {user?.fecha_ultimo_acceso ? 
                      new Date(user.fecha_ultimo_acceso).toLocaleString('es-ES') : 
                      'Primera vez'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Fecha de Registro
                  </Typography>
                  <Typography variant="body1">
                    {user?.created_at ? 
                      new Date(user.created_at).toLocaleDateString('es-ES') : 
                      'No disponible'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estado de la Cuenta
                  </Typography>
                  <Chip 
                    label={user?.activo ? 'Activa' : 'Inactiva'} 
                    color={user?.activo ? 'success' : 'error'} 
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClienteProfile;
