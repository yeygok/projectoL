import React, { useState } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import {
  SupportAgent as SoporteIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Label as LabelIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { soporteService } from '../services/apiService';
import { useCrud, useApi } from '../hooks';

const DashboardSoporte = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(soporteService);

  // Obtener estados de soporte para el formulario
  const { data: estadosSoporte } = useApi(() =>
    fetch('http://localhost:3000/api/estados-soporte', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json())
  );

  // Helper para color según prioridad
  const getPrioridadColor = (prioridad) => {
    const prioridadLower = prioridad?.toLowerCase() || '';
    if (prioridadLower === 'alta' || prioridadLower === 'urgente') return 'error';
    if (prioridadLower === 'media' || prioridadLower === 'normal') return 'warning';
    if (prioridadLower === 'baja') return 'info';
    return 'default';
  };

  // Helper para icono según prioridad
  const getPrioridadIcon = (prioridad) => {
    const prioridadLower = prioridad?.toLowerCase() || '';
    if (prioridadLower === 'alta' || prioridadLower === 'urgente') return '🔴';
    if (prioridadLower === 'media' || prioridadLower === 'normal') return '🟡';
    if (prioridadLower === 'baja') return '🟢';
    return '⚪';
  };

  // Helper para color según estado
  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower === 'abierto' || estadoLower === 'nuevo') return 'warning';
    if (estadoLower === 'en proceso' || estadoLower === 'en_proceso') return 'info';
    if (estadoLower === 'resuelto') return 'success';
    if (estadoLower === 'cerrado') return 'default';
    return 'default';
  };

  // Configuración de columnas
  const columns = [
    {
      field: 'id',
      headerName: 'Ticket',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={`#${params.value}`}
          size="small"
          color="primary"
          variant="outlined"
          icon={<TicketIcon />}
        />
      ),
    },
    {
      field: 'asunto',
      headerName: 'Asunto',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LabelIcon fontSize="small" color="action" />
          <Typography 
            variant="body2"
            sx={{ 
              fontWeight: params.row.estado_nombre?.toLowerCase() === 'abierto' ? 'bold' : 'normal'
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      width: 280,
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
          {params.value || 'Sin descripción'}
        </Typography>
      ),
    },
    {
      field: 'prioridad',
      headerName: 'Prioridad',
      width: 130,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={`${getPrioridadIcon(params.value)} ${params.value}`}
          size="small"
          color={getPrioridadColor(params.value)}
          icon={<FlagIcon />}
        />
      ),
    },
    {
      field: 'estado_nombre',
      headerName: 'Estado',
      width: 140,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value || 'N/A'}
          size="small"
          color={getEstadoColor(params.value)}
          icon={<TimelineIcon />}
        />
      ),
    },
    {
      field: 'usuario_nombre',
      headerName: 'Creado por',
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
      headerName: 'Fecha Creación',
      width: 150,
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
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
              {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'fecha_resolucion',
      headerName: 'Fecha Resolución',
      width: 150,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Typography variant="caption" color="text.secondary" fontStyle="italic">
              Pendiente
            </Typography>
          );
        }
        const fecha = new Date(params.value);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EventIcon fontSize="small" color="success" />
              <Typography variant="body2">
                {fecha.toLocaleDateString('es-CO')}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
              {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        );
      },
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'asunto',
      label: 'Asunto',
      type: 'text',
      required: true,
      helperText: 'Resumen del problema o consulta',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'text',
      multiline: true,
      rows: 5,
      required: true,
      helperText: 'Describe detalladamente el problema',
    },
    {
      name: 'prioridad',
      label: 'Prioridad',
      type: 'select',
      required: true,
      options: [
        { value: 'baja', label: '🟢 Baja' },
        { value: 'media', label: '🟡 Media' },
        { value: 'alta', label: '🔴 Alta' },
      ],
      helperText: 'Nivel de urgencia del ticket',
    },
    {
      name: 'estado_id',
      label: 'Estado',
      type: 'select',
      required: true,
      options: estadosSoporte?.map(estado => ({
        value: estado.id,
        label: estado.nombre
      })) || [],
      helperText: 'Estado actual del ticket',
    },
  ];

  // Handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar el ticket #${item.id} - "${item.asunto}"?`)) {
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
        title="Tickets de Soporte"
        subtitle="Gestiona las solicitudes de soporte y problemas reportados"
        icon={<SoporteIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Ticket"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay tickets de soporte registrados"
        title="Lista de Tickets"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        title={selectedItem ? 'Editar Ticket' : 'Nuevo Ticket'}
        fields={formFields}
        initialData={selectedItem}
        maxWidth="md"
      />
    </NotificationProvider>
  );
};

export default DashboardSoporte;
