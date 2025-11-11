import React, { useState } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import {
  Label as LabelIcon,
  Palette as PaletteIcon,
  Description as DescriptionIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { estadoSoporteService } from '../services/apiService';
import { useCrud } from '../hooks';

const DashboardEstadosSoporte = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(estadoSoporteService);

  // Helper para color según nombre del estado
  const getEstadoColor = (nombre) => {
    const nombreLower = nombre?.toLowerCase() || '';
    if (nombreLower === 'abierto' || nombreLower === 'nuevo') return 'warning';
    if (nombreLower === 'en proceso' || nombreLower === 'en_proceso') return 'info';
    if (nombreLower === 'resuelto') return 'success';
    if (nombreLower === 'cerrado') return 'default';
    return 'default';
  };

  // Configuración de columnas
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      align: 'center',
    },
    {
      field: 'nombre',
      headerName: 'Estado',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LabelIcon fontSize="small" color="action" />
          <Chip 
            label={params.value}
            size="small"
            color={getEstadoColor(params.value)}
          />
        </Box>
      ),
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      width: 400,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon fontSize="small" color="action" />
          <Typography 
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontStyle: params.value ? 'normal' : 'italic',
              color: params.value ? 'text.primary' : 'text.secondary'
            }}
          >
            {params.value || 'Sin descripción'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 120,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <PaletteIcon fontSize="small" color="action" />
          <Box
            sx={{
              width: 40,
              height: 24,
              borderRadius: 1,
              backgroundColor: params.value || '#cccccc',
              border: '1px solid rgba(0,0,0,0.12)',
              boxShadow: 1,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {params.value || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'activo',
      headerName: 'Activo',
      width: 120,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Activo' : 'Inactivo'}
          size="small"
          color={params.value ? 'success' : 'default'}
          icon={params.value ? <ActiveIcon /> : null}
          variant={params.value ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'orden',
      headerName: 'Orden',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={`#${params.value || 0}`}
          size="small"
          variant="outlined"
        />
      ),
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre del Estado',
      type: 'text',
      required: true,
      helperText: 'Nombre descriptivo del estado (ej: "Abierto", "En Proceso")',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'text',
      multiline: true,
      rows: 3,
      required: false,
      helperText: 'Descripción del significado del estado (opcional)',
    },
    {
      name: 'color',
      label: 'Color',
      type: 'color',
      required: false,
      helperText: 'Color para identificar visualmente el estado',
      defaultValue: '#2196f3',
    },
    {
      name: 'orden',
      label: 'Orden',
      type: 'number',
      required: false,
      inputProps: { min: 0 },
      helperText: 'Orden de visualización (menor número = mayor prioridad)',
      defaultValue: 0,
    },
    {
      name: 'activo',
      label: 'Activo',
      type: 'checkbox',
      required: false,
      helperText: 'Estado activo y disponible para uso',
      defaultValue: true,
    },
  ];

  // Handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar el estado "${item.nombre}"? Esto podría afectar tickets existentes.`)) {
      await crudOperations.deleteItem(item.id);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedItem) {
        await crudOperations.update(selectedItem.id, formData);
      } else {
        await crudOperations.create(formData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Estados de Soporte"
        subtitle="Gestiona los estados del flujo de tickets de soporte"
        icon={<LabelIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Estado"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay estados de soporte registrados"
        title="Lista de Estados"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        title={selectedItem ? 'Editar Estado' : 'Nuevo Estado'}
        fields={formFields}
        initialData={selectedItem}
        maxWidth="sm"
      />
    </NotificationProvider>
  );
};

export default DashboardEstadosSoporte;
