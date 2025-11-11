import React, { useState } from 'react';
import { Chip, Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Email as EmailIcon,
  MarkEmailRead as MarkReadIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { notificacionService } from '../services/apiService';
import { useCrud } from '../hooks';

const DashboardNotificaciones = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(notificacionService);

  // Helper para obtener icono según tipo
  const getTipoIcon = (tipo) => {
    const tipoLower = tipo?.toLowerCase() || '';
    if (tipoLower.includes('info')) return <InfoIcon />;
    if (tipoLower.includes('advertencia') || tipoLower.includes('warning')) return <WarningIcon />;
    if (tipoLower.includes('error') || tipoLower.includes('critico')) return <ErrorIcon />;
    if (tipoLower.includes('exito') || tipoLower.includes('success')) return <SuccessIcon />;
    return <NotificationsIcon />;
  };

  // Helper para color según tipo
  const getTipoColor = (tipo) => {
    const tipoLower = tipo?.toLowerCase() || '';
    if (tipoLower.includes('info')) return 'info';
    if (tipoLower.includes('advertencia') || tipoLower.includes('warning')) return 'warning';
    if (tipoLower.includes('error') || tipoLower.includes('critico')) return 'error';
    if (tipoLower.includes('exito') || tipoLower.includes('success')) return 'success';
    return 'default';
  };

  // Handler para marcar como leída
  const handleMarcarLeida = async (id, event) => {
    event.stopPropagation();
    try {
      await notificacionService.marcarLeida(id);
      await crudOperations.refetch();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
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
      field: 'leida',
      headerName: 'Estado',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title={params.value ? 'Leída' : 'No leída'}>
          <Box>
            {params.value ? (
              <Chip 
                label="Leída" 
                size="small" 
                color="default" 
                icon={<MarkReadIcon />}
                variant="outlined"
              />
            ) : (
              <Chip 
                label="Nueva" 
                size="small" 
                color="primary" 
                icon={<NotificationsActiveIcon />}
              />
            )}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          color={getTipoColor(params.value)}
          icon={getTipoIcon(params.value)}
        />
      ),
    },
    {
      field: 'titulo',
      headerName: 'Título',
      width: 250,
      renderCell: (params) => (
        <Typography 
          variant="body2"
          sx={{ 
            fontWeight: params.row.leida ? 'normal' : 'bold',
            color: params.row.leida ? 'text.primary' : 'primary.main'
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'mensaje',
      headerName: 'Mensaje',
      width: 300,
      renderCell: (params) => (
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
          {params.value || 'Sin mensaje'}
        </Typography>
      ),
    },
    {
      field: 'usuario_nombre',
      headerName: 'Destinatario',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.value || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'fecha_creacion',
      headerName: 'Fecha',
      width: 150,
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        const fecha = new Date(params.value);
        const ahora = new Date();
        const diffHoras = Math.floor((ahora - fecha) / (1000 * 60 * 60));
        
        let tiempoTexto = '';
        if (diffHoras < 1) {
          tiempoTexto = 'Hace menos de 1h';
        } else if (diffHoras < 24) {
          tiempoTexto = `Hace ${diffHoras}h`;
        } else {
          const diffDias = Math.floor(diffHoras / 24);
          tiempoTexto = `Hace ${diffDias}d`;
        }

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {fecha.toLocaleDateString('es-CO')}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
              {tiempoTexto}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        !params.row.leida && (
          <Tooltip title="Marcar como leída">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => handleMarcarLeida(params.row.id, e)}
            >
              <MarkReadIcon />
            </IconButton>
          </Tooltip>
        )
      ),
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'usuario_id',
      label: 'ID de Usuario',
      type: 'number',
      required: true,
      helperText: 'ID del usuario destinatario',
    },
    {
      name: 'tipo',
      label: 'Tipo de Notificación',
      type: 'select',
      required: true,
      options: [
        { value: 'info', label: 'Información' },
        { value: 'exito', label: 'Éxito' },
        { value: 'advertencia', label: 'Advertencia' },
        { value: 'error', label: 'Error' },
      ],
      helperText: 'Tipo de notificación',
    },
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
      helperText: 'Título de la notificación',
    },
    {
      name: 'mensaje',
      label: 'Mensaje',
      type: 'text',
      multiline: true,
      rows: 4,
      required: true,
      helperText: 'Contenido del mensaje',
    },
  ];

  // Handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar la notificación "${item.titulo}"?`)) {
      await crudOperations.deleteItem(item.id);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedItem) {
        // No permitir editar notificaciones existentes, solo crear nuevas
        throw new Error('No se puede editar una notificación existente');
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
        title="Notificaciones"
        subtitle="Gestiona las notificaciones del sistema"
        icon={<NotificationsIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nueva Notificación"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay notificaciones"
        title="Lista de Notificaciones"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        title="Nueva Notificación"
        fields={formFields}
        initialData={selectedItem}
        maxWidth="sm"
      />
    </NotificationProvider>
  );
};

export default DashboardNotificaciones;
