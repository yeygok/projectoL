import React, { useState } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import {
  History as HistoryIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { historialServiciosService } from '../services/apiService';
import { useCrud } from '../hooks';

const DashboardHistorialServicios = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(historialServiciosService);

  // Helper para color según tipo de acción
  const getAccionColor = (accion) => {
    const accionLower = accion?.toLowerCase() || '';
    if (accionLower.includes('completad')) return 'success';
    if (accionLower.includes('cancelad')) return 'error';
    if (accionLower.includes('iniciado') || accionLower.includes('asignad')) return 'info';
    if (accionLower.includes('reprogramad')) return 'warning';
    return 'default';
  };

  // Configuración de columnas
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      align: 'center',
    },
    {
      field: 'reserva_id',
      headerName: 'Reserva',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={`#${params.value}`} 
          size="small" 
          color="primary" 
          variant="outlined"
          icon={<EventIcon />}
        />
      ),
    },
    {
      field: 'accion',
      headerName: 'Acción',
      width: 220,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          color={getAccionColor(params.value)}
          icon={<CheckIcon />}
        />
      ),
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      width: 300,
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
      field: 'realizado_por_nombre',
      headerName: 'Realizado por',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.value || 'Sistema'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'realizado_por_rol',
      headerName: 'Rol',
      width: 120,
      align: 'center',
      renderCell: (params) => {
        const getRolColor = (rol) => {
          const rolLower = rol?.toLowerCase() || '';
          if (rolLower === 'admin') return 'error';
          if (rolLower === 'tecnico') return 'success';
          if (rolLower === 'cliente') return 'primary';
          return 'default';
        };

        return (
          <Chip 
            label={params.value || 'Sistema'}
            size="small"
            color={getRolColor(params.value)}
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'fecha_accion',
      headerName: 'Fecha y Hora',
      width: 180,
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        const fecha = new Date(params.value);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {fecha.toLocaleDateString('es-CO')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2.5 }}>
              <ScheduleIcon fontSize="small" color="action" sx={{ fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary">
                {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'reserva_id',
      label: 'ID de Reserva',
      type: 'number',
      required: true,
      helperText: 'Número de reserva relacionada',
    },
    {
      name: 'accion',
      label: 'Acción',
      type: 'text',
      required: true,
      helperText: 'Tipo de acción realizada (ej: "Servicio iniciado", "Completado")',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'text',
      multiline: true,
      rows: 4,
      required: false,
      helperText: 'Detalles adicionales sobre la acción (opcional)',
    },
  ];

  // Handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro #${item.id}?`)) {
      await crudOperations.deleteItem(item.id);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedItem) {
        await crudOperations.update(selectedItem.id, formData);
      } else {
        await crudOperations.create(formData);
      } setDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Historial de Servicios"
        subtitle="Registro cronológico de acciones en reservas"
        icon={<HistoryIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Registro"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay registros en el historial"
        title="Historial de Acciones"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        title={selectedItem ? 'Editar Registro' : 'Nuevo Registro'}
        fields={formFields}
        initialData={selectedItem}
        maxWidth="sm"
      />
    </NotificationProvider>
  );
};

export default DashboardHistorialServicios;
