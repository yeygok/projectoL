import React, { useState, useEffect } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  CarRepair as ServiceIcon,
  AttachMoney as PriceIcon,
  Schedule as DurationIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { serviceService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardServicios = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(serviceService);
  
  // Datos auxiliares - categorías de servicios
  const { data: categorias } = useApi(() => 
    fetch('http://localhost:3000/api/dashboard/categorias', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json())
  );

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

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Table columns configuration
  const columns = [
    {
      field: 'servicio',
      headerName: 'Servicio',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
            {row.nombre?.charAt(0).toUpperCase() || 'S'}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {row.nombre}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {row.id}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          {row.categoria_nombre || 'No especificado'}
        </div>
      )
    },
    {
      field: 'precio',
      headerName: 'Precio',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PriceIcon sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
          <span style={{ fontWeight: 600, color: 'success.main' }}>
            {formatPrice(row.precio_base)}
          </span>
        </div>
      )
    },
    {
      field: 'duracion',
      headerName: 'Duración',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DurationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          {formatDuration(row.duracion_estimada)}
        </div>
      )
    },
    {
      field: 'estado',
      headerName: 'Estado',
      render: (value, row) => (
        <Chip
          label={row.activo ? 'Activo' : 'Inactivo'}
          color={row.activo ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      render: (value, row) => (
        <div style={{ 
          maxWidth: 200, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' 
        }}>
          {row.descripcion || 'Sin descripción'}
        </div>
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre del Servicio',
      type: 'text',
      required: true,
      md: 6
    },
    {
      name: 'categoria_id',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: categorias?.map(categoria => ({
        value: categoria.id,
        label: categoria.nombre
      })) || [],
      md: 6
    },
    {
      name: 'precio_base',
      label: 'Precio Base (COP)',
      type: 'number',
      required: true,
      inputProps: { min: 1000, step: 1000 },
      helperText: 'Precio en pesos colombianos',
      md: 6
    },
    {
      name: 'duracion_estimada',
      label: 'Duración Estimada (minutos)',
      type: 'number',
      required: true,
      inputProps: { min: 15, step: 15 },
      helperText: 'Duración en minutos (ej: 60, 90, 120)',
      md: 6
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'text',
      multiline: true,
      rows: 3,
      placeholder: 'Descripción detallada del servicio...',
      md: 12
    }
  ];

  // Default form values
  const defaultValues = {
    nombre: '',
    categoria_id: '',
    precio_base: 30000,
    duracion_estimada: 60,
    descripcion: ''
  };



  // Event handlers
  const handleEdit = (item) => {
    // Preparar los datos para el formulario - INCLUIR EL ID
    const editData = {
      id: item.id, // ¡IMPORTANTE! Incluir el ID para las operaciones UPDATE
      nombre: item.nombre,
      categoria_id: item.categoria_id,
      precio_base: item.precio_base,
      duracion_estimada: item.duracion_estimada,
      descripcion: item.descripcion || ''
    };
    
    setSelectedItem(editData);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar el servicio "${item.nombre}"?`)) {
      try {
        await crudOperations.remove(item.id);
      } catch (error) {
        // Error handled by UI
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Asegurar que los campos numéricos sean números
      const processedData = {
        ...formData,
        categoria_id: parseInt(formData.categoria_id),
        precio_base: parseFloat(formData.precio_base),
        duracion_estimada: parseInt(formData.duracion_estimada)
      };

      if (selectedItem) {
        await crudOperations.update(selectedItem.id, processedData);
      } else {
        await crudOperations.create(processedData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      // Error handled by UI
      alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
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
        subtitle={selectedItem ? 'Modificar los datos del servicio' : 'Crear un nuevo servicio de limpieza'}
        fields={formFields}
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
        maxWidth="lg"
        fullWidth
      />
    </NotificationProvider>
  );
};

export default DashboardServicios;
