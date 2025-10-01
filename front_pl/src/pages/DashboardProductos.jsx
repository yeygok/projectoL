import React, { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  Inventory as ProductIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { productService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardProductos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(productService);

  // Helper function to get status color
  const getStatusColor = (activo) => {
    return activo ? 'success' : 'error';
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Table columns configuration
  const columns = [
    {
      field: 'producto',
      headerName: 'Producto',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            <ProductIcon />
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {item.nombre}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {item.id_producto}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      render: (item) => (
        <div style={{ maxWidth: 200 }}>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {item.descripcion || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      field: 'precio',
      headerName: 'Precio',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PriceIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <div style={{ fontWeight: 600, color: 'success.main' }}>
            {formatPrice(item.precio)}
          </div>
        </div>
      )
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={item.categoria || 'Sin categoría'}
            color="primary"
            size="small"
            variant="outlined"
          />
        </div>
      )
    },
    {
      field: 'estado',
      headerName: 'Estado',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={item.activo ? 'Activo' : 'Inactivo'}
            color={getStatusColor(item.activo)}
            size="small"
          />
        </div>
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre',
      headerName: 'Nombre del Producto',
      type: 'text',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'descripcion',
      headerName: 'Descripción',
      type: 'textarea',
      rows: 3,
      placeholder: 'Descripción detallada del producto...',
      gridProps: { xs: 12 }
    },
    {
      name: 'precio',
      headerName: 'Precio',
      type: 'number',
      required: true,
      min: 0,
      step: 1000,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'categoria',
      headerName: 'Categoría',
      type: 'text',
      placeholder: 'Ej: Limpieza, Mantenimiento, etc.',
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'activo',
      headerName: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: true, headerName: 'Activo' },
        { value: false, headerName: 'Inactivo' }
      ],
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'codigo_producto',
      headerName: 'Código del Producto',
      type: 'text',
      placeholder: 'Código único del producto',
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'stock_minimo',
      headerName: 'Stock Mínimo',
      type: 'number',
      min: 0,
      placeholder: 'Cantidad mínima en inventario',
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'unidad_medida',
      headerName: 'Unidad de Medida',
      type: 'select',
      options: [
        { value: 'unidad', headerName: 'Unidad' },
        { value: 'litro', headerName: 'Litro' },
        { value: 'kilo', headerName: 'Kilogramo' },
        { value: 'metro', headerName: 'Metro' },
        { value: 'paquete', headerName: 'Paquete' }
      ],
      gridProps: { xs: 12, md: 6 }
    }
  ];

  // Default form values
  const defaultValues = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    activo: true,
    codigo_producto: '',
    stock_minimo: 0,
    unidad_medida: 'unidad'
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.nombre?.trim()) {
      errors.nombre = 'El nombre del producto es requerido';
    }
    
    if (!data.precio || data.precio <= 0) {
      errors.precio = 'El precio debe ser mayor a 0';
    }

    if (data.activo === undefined || data.activo === '') {
      errors.activo = 'El estado es requerido';
    }

    return errors;
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar el producto "${item.nombre}"?`)) {
      try {
        await crudOperations.remove(item.id_producto);
      } catch (error) {
        console.error('Error deleting producto:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock_minimo: parseInt(formData.stock_minimo) || 0,
        activo: formData.activo === true || formData.activo === 'true'
      };

      if (selectedItem) {
        await crudOperations.update(selectedItem.id_producto, processedData);
      } else {
        await crudOperations.create(processedData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving producto:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Productos"
        subtitle="Gestionar productos y servicios disponibles"
        icon={<ProductIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Producto"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay productos registrados"
        title="Lista de Productos"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Producto' : 'Nuevo Producto'}
        fields={formFields}
        defaultValues={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        validate={validateForm}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardProductos;
