import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Importar componentes personalizados y servicios
import { Button, Card, Input } from '../components/common';
import { clienteService, tipoDocumentoService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardClientes = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations with custom hooks
  const {
    data: clientes,
    loading,
    error,
    create,
    update,
    remove,
    refetch
  } = useCrud(clienteService);

  // Get additional data for forms
  const { data: tiposDocumento } = useApi(tipoDocumentoService.getAll);

  // Form state management
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    id_tipo_documento: '',
    numero_documento: '',
    direccion: '',
    fecha_nacimiento: '',
    genero: '',
    observaciones: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombres.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }
    
    if (!formData.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no tiene un formato válido';
    }
    
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
    }

    if (!formData.id_tipo_documento) {
      errors.id_tipo_documento = 'El tipo de documento es requerido';
    }

    if (!formData.numero_documento.trim()) {
      errors.numero_documento = 'El número de documento es requerido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedItem) {
        await update(selectedItem.id_cliente, formData);
      } else {
        await create(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving cliente:', error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      nombres: item.nombres || '',
      apellidos: item.apellidos || '',
      email: item.email || '',
      telefono: item.telefono || '',
      id_tipo_documento: item.id_tipo_documento || '',
      numero_documento: item.numero_documento || '',
      direccion: item.direccion || '',
      fecha_nacimiento: item.fecha_nacimiento?.split('T')[0] || '',
      genero: item.genero || '',
      observaciones: item.observaciones || ''
    });
    setOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar al cliente ${item.nombres} ${item.apellidos}?`)) {
      try {
        await remove(item.id_cliente);
      } catch (error) {
        console.error('Error deleting cliente:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedItem(null);
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      id_tipo_documento: '',
      numero_documento: '',
      direccion: '',
      fecha_nacimiento: '',
      genero: '',
      observaciones: ''
    });
    setFormErrors({});
  };

  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres?.charAt(0) || '';
    const lastInitial = apellidos?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  if (loading && !clientes) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            <PersonIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Clientes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestionar información de clientes del sistema
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={refetch} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Nuevo Cliente
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'Error al cargar los clientes'}
        </Alert>
      )}

      {/* Clientes Table */}
      <Card title="Lista de Clientes" variant="elevated">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Género</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : clientes && clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id_cliente} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {getInitials(cliente.nombres, cliente.apellidos)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {cliente.nombres} {cliente.apellidos}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cliente #{cliente.id_cliente}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{cliente.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{cliente.telefono}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {cliente.tipo_documento_nombre || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cliente.numero_documento}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cliente.direccion || 'No especificada'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cliente.genero || 'No especificado'}
                        color={cliente.genero === 'M' ? 'primary' : cliente.genero === 'F' ? 'secondary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(cliente)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(cliente)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No hay clientes registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Form Dialog */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? 'Editar Cliente' : 'Nuevo Cliente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Input
                label="Nombres"
                value={formData.nombres}
                onChange={(e) => handleInputChange('nombres', e.target.value)}
                error={!!formErrors.nombres}
                helperText={formErrors.nombres}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Apellidos"
                value={formData.apellidos}
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                error={!!formErrors.apellidos}
                helperText={formErrors.apellidos}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                error={!!formErrors.telefono}
                helperText={formErrors.telefono}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Tipo de Documento"
                select
                value={formData.id_tipo_documento}
                onChange={(e) => handleInputChange('id_tipo_documento', e.target.value)}
                error={!!formErrors.id_tipo_documento}
                helperText={formErrors.id_tipo_documento}
                fullWidth
                required
                options={tiposDocumento?.map(tipo => ({
                  value: tipo.id_tipo_documento,
                  label: tipo.nombre_tipo_documento
                })) || []}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Número de Documento"
                value={formData.numero_documento}
                onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                error={!!formErrors.numero_documento}
                helperText={formErrors.numero_documento}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Género"
                select
                value={formData.genero}
                onChange={(e) => handleInputChange('genero', e.target.value)}
                fullWidth
                options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Femenino' },
                  { value: 'Otro', label: 'Otro' }
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label="Observaciones"
                multiline
                rows={3}
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                fullWidth
                placeholder="Observaciones adicionales sobre el cliente..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {selectedItem ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardClientes;
