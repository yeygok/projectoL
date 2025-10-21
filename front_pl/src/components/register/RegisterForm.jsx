import React from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckIcon,
  AccountCircle as AccountIcon,
  ContactMail as ContactIcon,
  Security as SecurityIcon,
  Policy as PolicyIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Button } from '../common';

/**
 * Componente del formulario de registro.
 * Maneja la renderización de todos los campos del formulario organizados en cards.
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario
 * @param {Object} props.fieldErrors - Errores de validación por campo
 * @param {Object} props.fieldValid - Estados de validación por campo
 * @param {boolean} props.showPassword - Mostrar/ocultar contraseña
 * @param {boolean} props.showConfirmPassword - Mostrar/ocultar confirmación
 * @param {boolean} props.acceptTerms - Aceptación de términos
 * @param {string} props.error - Error general
 * @param {boolean} props.loading - Estado de carga
 * @param {Function} props.handleInputChange - Handler para cambios en inputs
 * @param {Function} props.togglePasswordVisibility - Toggle visibilidad contraseña
 * @param {Function} props.setAcceptTerms - Setter para aceptación de términos
 * @param {Function} props.handleSubmit - Handler para envío del formulario
 * @param {Function} props.handleCancel - Handler para cancelar
 * @param {Function} props.goToLogin - Handler para ir al login
 * @returns {JSX.Element} Formulario de registro organizado en cards
 */
export function RegisterForm({
  formData,
  fieldErrors,
  fieldValid,
  showPassword,
  showConfirmPassword,
  acceptTerms,
  error,
  loading,
  handleInputChange,
  togglePasswordVisibility,
  setAcceptTerms,
  handleSubmit,
  handleCancel,
  goToLogin,
}) {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Espacio para las cards organizadas */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Card 1: Información Personal */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Información Personal
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Nombre */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={handleInputChange('nombre')}
                  variant="outlined"
                  required
                  placeholder="Ingresa tu nombre"
                  error={!!fieldErrors.nombre}
                  helperText={fieldErrors.nombre}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={fieldValid.nombre ? "success" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: fieldValid.nombre && (
                      <InputAdornment position="end">
                        <CheckIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Apellido */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.apellido}
                  onChange={handleInputChange('apellido')}
                  variant="outlined"
                  required
                  placeholder="Ingresa tu apellido"
                  error={!!fieldErrors.apellido}
                  helperText={fieldErrors.apellido}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={fieldValid.apellido ? "success" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: fieldValid.apellido && (
                      <InputAdornment position="end">
                        <CheckIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card 2: Información de Contacto */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ContactIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Información de Contacto
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  variant="outlined"
                  required
                  autoComplete="username"
                  placeholder="tu@email.com"
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color={fieldValid.email ? "success" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: fieldValid.email && (
                      <InputAdornment position="end">
                        <CheckIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={handleInputChange('telefono')}
                  variant="outlined"
                  required
                  placeholder="300 123 4567"
                  error={!!fieldErrors.telefono}
                  helperText={fieldErrors.telefono}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color={fieldValid.telefono ? "success" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: fieldValid.telefono && (
                      <InputAdornment position="end">
                        <CheckIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card 3: Seguridad */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Seguridad de la Cuenta
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Contraseña */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  variant="outlined"
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color={fieldValid.password ? "success" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('password')}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Confirmar Contraseña */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  variant="outlined"
                  required
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  error={!!fieldErrors.confirmPassword}
                  helperText={fieldErrors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color={fieldValid.confirmPassword ? "success" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card 4: Términos y Condiciones */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PolicyIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Términos y Condiciones
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Checkbox de términos */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Acepto los{' '}
                  <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
                    política de privacidad
                  </Link>
                </Typography>
              }
            />

            {/* Mensaje de error general */}
            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Card 5: Acciones */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SendIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Crear Cuenta
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !acceptTerms}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 3,
                  boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleCancel}
                disabled={loading}
                startIcon={<CancelIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(244, 67, 54, 0.04)',
                    borderColor: 'error.main',
                    color: 'error.main',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Cancelar
              </Button>
            </Box>

            {/* Link al login */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 3,
                textAlign: 'center'
              }}
            >
              ¿Ya tienes cuenta?{' '}
              <Button
                variant="text"
                onClick={goToLogin}
                sx={{
                  textTransform: 'none',
                  p: 0,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  }
                }}
              >
                Inicia sesión aquí
              </Button>
            </Typography>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
}