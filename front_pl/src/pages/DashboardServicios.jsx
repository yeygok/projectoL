import React, { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  CarRepair as ServiceIcon,
  AttachMoney as PriceIcon,
  Schedule as DurationIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { serviceService, tipoServicioService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardServicios = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(serviceService);
  const { data: tiposServicio } = useApi(tipoServicioService.getAll);

  // Utility function
  const formatDuration = (minutes) => {
    if (!minutes) return 'No especificada';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  // Table columns configuration
  const columns = [
    {
      id: 'servicio',
      label: 'Servicio',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
            {item.nombre_servicio?.charAt(0).toUpperCase() || 'S'}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {item.nombre_servicio}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {item.id_servicio}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tipo',
      label: 'Tipo',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          {item.tipo_servicio_nombre || 'No especificado'}
        </div>
      )
    },
    {
      id: 'precio',
      label: 'Precio',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PriceIcon sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
          <span style={{ fontWeight: 600, color: 'success.main' }}>
            ${item.precio?.toLocaleString() || '0'}
          </span>
        </div>
      )
    },
    {
      id: 'duracion',
      label: 'Duración',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DurationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          {formatDuration(item.duracion)}
        </div>
      )
    },
    {
      id: 'estado',
      label: 'Estado',
      render: (item) => (
        <Chip
          label={item.activo ? 'Activo' : 'Inactivo'}
          color={item.activo ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      id: 'descripcion',
      label: 'Descripción',
      render: (item) => (
        <div style={{ 
          maxWidth: 200, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' 
        }}>
          {item.descripcion || 'Sin descripción'}
        </div>
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre_servicio',
      label: 'Nombre del Servicio',
      type: 'text',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'id_tipo_servicio',
      label: 'Tipo de Servicio',
      type: 'select',
      required: true,
      options: tiposServicio?.map(tipo => ({
        value: tipo.id_tipo_servicio,
        label: tipo.nombre_tipo_servicio
      })) || [],
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'precio',
      label: 'Precio (COP)',
      type: 'number',
      required: true,
      inputProps: { min: 0, step: 1000 },
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'duracion',
      label: 'Duración (minutos)',
      type: 'number',
      required: true,
      inputProps: { min: 1, step: 15 },
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      rows: 3,
      placeholder: 'Descripción detallada del servicio...',
      gridProps: { xs: 12 }
    },
    {
      name: 'activo',
      label: 'Estado',
      type: 'select',
      options: [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' }
      ],
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'observaciones',
      label: 'Observaciones',
      type: 'textarea',
      rows: 2,
      placeholder: 'Observaciones adicionales sobre el servicio...',
      gridProps: { xs: 12 }
    }
  ];

  // Default form values
  const defaultValues = {
    nombre_servicio: '',
    descripcion: '',
    precio: '',
    duracion: '',
    id_tipo_servicio: '',
    activo: true,
    observaciones: ''
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.nombre_servicio?.trim()) {
      errors.nombre_servicio = 'El nombre del servicio es requerido';
    }
    
    if (!data.descripcion?.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }
    
    if (!data.precio || data.precio <= 0) {
      errors.precio = 'El precio debe ser mayor que 0';
    }
    
    if (!data.duracion) {
      errors.duracion = 'La duración es requerida';
    }

    if (!data.id_tipo_servicio) {
      errors.id_tipo_servicio = 'El tipo de servicio es requerido';
    }

    return errors;
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar el servicio "${item.nombre_servicio}"?`)) {
      try {
        await crudOperations.remove(item.id_servicio);
      } catch (error) {
        console.error('Error deleting servicio:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const dataToSubmit = {
        ...formData,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion)
      };

      if (selectedItem) {
        await crudOperations.update(selectedItem.id_servicio, dataToSubmit);
      } else {
        await crudOperations.create(dataToSubmit);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving servicio:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Servicios"
        subtitle="Gestionar servicios disponibles en el sistema"
        icon={<ServiceIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Servicio"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay servicios registrados"
        title="Lista de Servicios"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Servicio' : 'Nuevo Servicio'}
        fields={formFields}
        defaultValues={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        validate={validateForm}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardServicios;
