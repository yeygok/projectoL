import React, { useState, useEffect } from 'react';
import { Chip, Box, Grid } from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks siguiendo el patrón establecido
import { DataTable, FormDialog, PageHeader, NotificationProvider, StatCard } from '../components/common';
import { estadoReservaService } from '../services/apiService';
import { useCrud, useApi } from '../hooks';

const DashboardEstadosReserva = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);

  // CRUD operations usando el hook personalizado
  const crudOperations = useCrud(estadoReservaService);

  // Cargar estadísticas
  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    try {
      const data = await estadoReservaService.getEstadisticas();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error loading estadísticas:', error);
    }
  };

  // Helper function to get status color
  const getColorChip = (color) => {
    // Convertir color HEX a nombre de color de MUI aproximado
    const colorMap = {
      '#ffc107': 'warning',
      '#17a2b8': 'info',
      '#28a745': 'success',
      '#dc3545': 'error',
      '#6c757d': 'default',
    };
    return colorMap[color?.toLowerCase()] || 'default';
  };

  // Table columns configuration
  const columns = [
    {
      field: 'estado',
      headerName: 'Estado',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: row.color || '#ccc',
              marginRight: 2,
            }}
          />
          <div>
            <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {row.estado}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {row.id}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      render: (value, row) => (
        <span style={{ fontSize: '0.875rem' }}>
          {row.descripcion || 'Sin descripción'}
        </span>
      )
    },
    {
      field: 'reservas',
      headerName: 'Reservas',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {row.total_reservas || 0} total
          </div>
          <div style={{ fontSize: '0.75rem', display: 'flex', gap: '8px' }}>
            <span style={{ color: 'primary.main' }}>
              {row.reservas_futuras || 0} futuras
            </span>
            <span style={{ color: 'text.secondary' }}>
              {row.reservas_pasadas || 0} pasadas
            </span>
          </div>
        </div>
      )
    },
    {
      field: 'color',
      headerName: 'Color',
      render: (value, row) => (
        <Chip
          label={row.color || 'Sin color'}
          size="small"
          sx={{
            backgroundColor: row.color || '#ccc',
            color: '#fff',
            fontWeight: 600
          }}
        />
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'estado',
      label: 'Nombre del Estado',
      type: 'text',
      required: true,
      placeholder: 'Ej: pendiente, confirmada, en-proceso',
      md: 12,
      validation: (value) => {
        if (!value?.trim()) return 'El nombre del estado es requerido';
        if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
        return true;
      }
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Describe en qué consiste este estado',
      md: 12,
      rows: 3
    },
    {
      name: 'color',
      label: 'Color (HEX)',
      type: 'text',
      required: true,
      placeholder: '#ffc107',
      md: 12,
      helperText: 'Formato HEX: #RRGGBB',
      validation: (value) => {
        if (!value) return 'El color es requerido';
        if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return 'Formato inválido. Use formato HEX: #RRGGBB';
        }
        return true;
      }
    }
  ];

  // Default form values
  const defaultValues = {
    estado: '',
    descripcion: '',
    color: '#2196f3'
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    // Estados críticos que no se pueden eliminar
    const estadosCriticos = ['pendiente', 'confirmada', 'completada', 'cancelada'];
    if (estadosCriticos.includes(item.estado?.toLowerCase())) {
      alert(`⚠️ El estado "${item.estado}" es crítico y no puede ser eliminado.`);
      return;
    }

    if (item.total_reservas > 0) {
      if (!window.confirm(
        `⚠️ Este estado tiene ${item.total_reservas} reserva(s) asociada(s).\n\n` +
        `¿Está seguro de eliminarlo? Las reservas quedarán sin estado.`
      )) {
        return;
      }
    } else {
      if (!window.confirm(`¿Está seguro de eliminar el estado "${item.estado}"?`)) {
        return;
      }
    }

    try {
      await crudOperations.remove(item.id);
      loadEstadisticas(); // Recargar estadísticas después de eliminar
    } catch (error) {
      console.error('Error deleting estado:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedItem) {
        await crudOperations.update(selectedItem.id, formData);
      } else {
        await crudOperations.create(formData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      loadEstadisticas(); // Recargar estadísticas después de guardar
      return true;
    } catch (error) {
      console.error('Error saving estado:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Estados de Reserva"
        subtitle="Gestiona los estados del flujo de reservas"
        icon={<TimelineIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={() => {
          crudOperations.refetch();
          loadEstadisticas();
        }}
        loading={crudOperations.loading}
        addButtonText="Nuevo Estado"
      />

      {/* Tarjetas de estadísticas */}
      {estadisticas && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Reservas"
              value={estadisticas.total_reservas || 0}
              icon={<EventIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Reservas Activas"
              value={estadisticas.reservas_activas || 0}
              icon={<TrendingUpIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completadas"
              value={estadisticas.completadas || 0}
              icon={<TimelineIcon />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Ingresos Totales"
              value={`$${(estadisticas.ingresos_totales || 0).toLocaleString()}`}
              icon={<MoneyIcon />}
              color="warning"
            />
          </Grid>
        </Grid>
      )}

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay estados de reserva registrados"
        title="Lista de Estados"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Estado' : 'Nuevo Estado'}
        fields={formFields}
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardEstadosReserva;
