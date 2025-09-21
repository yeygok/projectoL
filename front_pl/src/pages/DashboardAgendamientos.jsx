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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Business as ServiceIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Importar componentes personalizados y servicios
import { Button, Card, Input } from '../components/common';
import { agendamientoService, clienteService, serviceService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardAgendamientos = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations with custom hooks
  const {
    data: agendamientos,
    loading,
    error,
    create,
    update,
    remove,
    refetch
  } = useCrud(agendamientoService);

  // Get additional data for forms
  const { data: clientes } = useApi(clienteService.getAll);
  const { data: servicios } = useApi(serviceService.getAll);

  // Form state management
  const [formData, setFormData] = useState({
    fecha_agendamiento: '',
    hora_agendamiento: '',
    id_cliente: '',
    id_servicio: '',
    observaciones: '',
    id_estado_orden: 1 // Default to "Programada"
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
    
    if (!formData.fecha_agendamiento) {
      errors.fecha_agendamiento = 'La fecha es requerida';
    }
    
    if (!formData.hora_agendamiento) {
      errors.hora_agendamiento = 'La hora es requerida';
    }
    
    if (!formData.id_cliente) {
      errors.id_cliente = 'El cliente es requerido';
    }
    
    if (!formData.id_servicio) {
      errors.id_servicio = 'El servicio es requerido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedItem) {
        await update(selectedItem.id_agendamiento, formData);
      } else {
        await create(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving agendamiento:', error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      fecha_agendamiento: item.fecha_agendamiento?.split('T')[0] || '',
      hora_agendamiento: item.hora_agendamiento || '',
      id_cliente: item.id_cliente || '',
      id_servicio: item.id_servicio || '',
      observaciones: item.observaciones || '',
      id_estado_orden: item.id_estado_orden || 1
    });
    setOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar el agendamiento del ${new Date(item.fecha_agendamiento).toLocaleDateString()}?`)) {
      try {
        await remove(item.id_agendamiento);
      } catch (error) {
        console.error('Error deleting agendamiento:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedItem(null);
    setFormData({
      fecha_agendamiento: '',
      hora_agendamiento: '',
      id_cliente: '',
      id_servicio: '',
      observaciones: '',
      id_estado_orden: 1
    });
    setFormErrors({});
  };

  const getStatusColor = (estadoId) => {
    switch (estadoId) {
      case 1: return 'warning'; // Programada
      case 2: return 'info';    // En proceso
      case 3: return 'success'; // Completada
      case 4: return 'error';   // Cancelada
      default: return 'default';
    }
  };

  const getStatusLabel = (estadoId) => {
    switch (estadoId) {
      case 1: return 'Programada';
      case 2: return 'En Proceso';
      case 3: return 'Completada';
      case 4: return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  if (loading && !agendamientos) {
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
            <EventIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Agendamientos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestionar citas y reservas del sistema
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
            Nuevo Agendamiento
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'Error al cargar los agendamientos'}
        </Alert>
      )}

      {/* Agendamientos Table */}
      <Card title="Lista de Agendamientos" variant="elevated">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Observaciones</TableCell>
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
              ) : agendamientos && agendamientos.length > 0 ? (
                agendamientos.map((agendamiento) => (
                  <TableRow key={agendamiento.id_agendamiento} hover>
                    <TableCell>
                      {new Date(agendamiento.fecha_agendamiento).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>{agendamiento.hora_agendamiento}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        {agendamiento.cliente_nombre || 'Cliente no disponible'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ServiceIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        {agendamiento.servicio_nombre || 'Servicio no disponible'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(agendamiento.id_estado_orden)}
                        color={getStatusColor(agendamiento.id_estado_orden)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {agendamiento.observaciones || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(agendamiento)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(agendamiento)}
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
                      No hay agendamientos registrados
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
          {selectedItem ? 'Editar Agendamiento' : 'Nuevo Agendamiento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Input
                label="Fecha"
                type="date"
                value={formData.fecha_agendamiento}
                onChange={(e) => handleInputChange('fecha_agendamiento', e.target.value)}
                error={!!formErrors.fecha_agendamiento}
                helperText={formErrors.fecha_agendamiento}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Hora"
                type="time"
                value={formData.hora_agendamiento}
                onChange={(e) => handleInputChange('hora_agendamiento', e.target.value)}
                error={!!formErrors.hora_agendamiento}
                helperText={formErrors.hora_agendamiento}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Cliente"
                select
                value={formData.id_cliente}
                onChange={(e) => handleInputChange('id_cliente', e.target.value)}
                error={!!formErrors.id_cliente}
                helperText={formErrors.id_cliente}
                fullWidth
                required
                options={clientes?.map(cliente => ({
                  value: cliente.id_cliente,
                  label: `${cliente.nombres} ${cliente.apellidos}`
                })) || []}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Servicio"
                select
                value={formData.id_servicio}
                onChange={(e) => handleInputChange('id_servicio', e.target.value)}
                error={!!formErrors.id_servicio}
                helperText={formErrors.id_servicio}
                fullWidth
                required
                options={servicios?.map(servicio => ({
                  value: servicio.id_servicio,
                  label: servicio.nombre_servicio
                })) || []}
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
                placeholder="Observaciones adicionales para el agendamiento..."
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

export default DashboardAgendamientos;
