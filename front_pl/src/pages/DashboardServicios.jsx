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
  CarRepair as ServiceIcon,
  AttachMoney as PriceIcon,
  Schedule as DurationIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Importar componentes personalizados y servicios
import { Button, Card, Input } from '../components/common';
import { serviceService, tipoServicioService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardServicios = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations with custom hooks
  const {
    data: servicios,
    loading,
    error,
    create,
    update,
    remove,
    refetch
  } = useCrud(serviceService);

  // Get additional data for forms
  const { data: tiposServicio } = useApi(tipoServicioService.getAll);

  // Form state management
  const [formData, setFormData] = useState({
    nombre_servicio: '',
    descripcion: '',
    precio: '',
    duracion: '',
    id_tipo_servicio: '',
    activo: true,
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
    
    if (!formData.nombre_servicio.trim()) {
      errors.nombre_servicio = 'El nombre del servicio es requerido';
    }
    
    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }
    
    if (!formData.precio || formData.precio <= 0) {
      errors.precio = 'El precio debe ser mayor que 0';
    }
    
    if (!formData.duracion) {
      errors.duracion = 'La duración es requerida';
    }

    if (!formData.id_tipo_servicio) {
      errors.id_tipo_servicio = 'El tipo de servicio es requerido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const dataToSubmit = {
        ...formData,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion)
      };

      if (selectedItem) {
        await update(selectedItem.id_servicio, dataToSubmit);
      } else {
        await create(dataToSubmit);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving servicio:', error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      nombre_servicio: item.nombre_servicio || '',
      descripcion: item.descripcion || '',
      precio: item.precio || '',
      duracion: item.duracion || '',
      id_tipo_servicio: item.id_tipo_servicio || '',
      activo: item.activo !== undefined ? item.activo : true,
      observaciones: item.observaciones || ''
    });
    setOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar el servicio "${item.nombre_servicio}"?`)) {
      try {
        await remove(item.id_servicio);
      } catch (error) {
        console.error('Error deleting servicio:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedItem(null);
    setFormData({
      nombre_servicio: '',
      descripcion: '',
      precio: '',
      duracion: '',
      id_tipo_servicio: '',
      activo: true,
      observaciones: ''
    });
    setFormErrors({});
  };

  const getServiceInitial = (nombre) => {
    return nombre?.charAt(0).toUpperCase() || 'S';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'No especificada';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  if (loading && !servicios) {
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
            <ServiceIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Servicios
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestionar servicios disponibles en el sistema
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
            Nuevo Servicio
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'Error al cargar los servicios'}
        </Alert>
      )}

      {/* Servicios Table */}
      <Card title="Lista de Servicios" variant="elevated">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Servicio</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Duración</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : servicios && servicios.length > 0 ? (
                servicios.map((servicio) => (
                  <TableRow key={servicio.id_servicio} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                          {getServiceInitial(servicio.nombre_servicio)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {servicio.nombre_servicio}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {servicio.id_servicio}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {servicio.tipo_servicio_nombre || 'No especificado'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PriceIcon sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          ${servicio.precio?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DurationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {formatDuration(servicio.duracion)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={servicio.activo ? 'Activo' : 'Inactivo'}
                        color={servicio.activo ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {servicio.descripcion || 'Sin descripción'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(servicio)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(servicio)}
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
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No hay servicios registrados
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
          {selectedItem ? 'Editar Servicio' : 'Nuevo Servicio'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Input
                label="Nombre del Servicio"
                value={formData.nombre_servicio}
                onChange={(e) => handleInputChange('nombre_servicio', e.target.value)}
                error={!!formErrors.nombre_servicio}
                helperText={formErrors.nombre_servicio}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Tipo de Servicio"
                select
                value={formData.id_tipo_servicio}
                onChange={(e) => handleInputChange('id_tipo_servicio', e.target.value)}
                error={!!formErrors.id_tipo_servicio}
                helperText={formErrors.id_tipo_servicio}
                fullWidth
                required
                options={tiposServicio?.map(tipo => ({
                  value: tipo.id_tipo_servicio,
                  label: tipo.nombre_tipo_servicio
                })) || []}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Precio (COP)"
                type="number"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', e.target.value)}
                error={!!formErrors.precio}
                helperText={formErrors.precio}
                fullWidth
                required
                inputProps={{ min: 0, step: 1000 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Duración (minutos)"
                type="number"
                value={formData.duracion}
                onChange={(e) => handleInputChange('duracion', e.target.value)}
                error={!!formErrors.duracion}
                helperText={formErrors.duracion}
                fullWidth
                required
                inputProps={{ min: 1, step: 15 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label="Descripción"
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                error={!!formErrors.descripcion}
                helperText={formErrors.descripcion}
                fullWidth
                required
                placeholder="Descripción detallada del servicio..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Estado"
                select
                value={formData.activo}
                onChange={(e) => handleInputChange('activo', e.target.value === 'true')}
                fullWidth
                options={[
                  { value: true, label: 'Activo' },
                  { value: false, label: 'Inactivo' }
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label="Observaciones"
                multiline
                rows={2}
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                fullWidth
                placeholder="Observaciones adicionales sobre el servicio..."
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

export default DashboardServicios;
