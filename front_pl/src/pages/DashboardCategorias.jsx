import React, { useState } from 'react';
import { Chip } from '@mui/material';
import {
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Apps as AppsIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks siguiendo el patrón establecido
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { categoriaService } from '../services/apiService';
import { useCrud } from '../hooks';

const DashboardCategorias = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations usando el hook personalizado
  const crudOperations = useCrud(categoriaService);

  // Helper function to get status color
  const getStatusColor = (activa) => {
    return activa ? 'success' : 'default';
  };

  // Table columns configuration
  const columns = [
    {
      field: 'nombre',
      headerName: 'Categoría',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>
            {row.icono || '📁'}
          </span>
          <div>
            <div style={{ fontWeight: 600 }}>{row.nombre}</div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {row.id} | Orden: {row.orden || 0}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <DescriptionIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary', mt: 0.3 }} />
          <span style={{ fontSize: '0.875rem' }}>
            {row.descripcion || 'Sin descripción'}
          </span>
        </div>
      )
    },
    {
      field: 'servicios',
      headerName: 'Servicios',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <div>
            <div style={{ fontWeight: 600 }}>
              {row.total_servicios || 0} total
            </div>
            <div style={{ fontSize: '0.75rem', color: 'success.main' }}>
              {row.servicios_activos || 0} activos
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'activa',
      headerName: 'Estado',
      render: (value, row) => (
        <Chip
          label={row.activa ? 'Activa' : 'Inactiva'}
          color={getStatusColor(row.activa)}
          size="small"
          variant="outlined"
        />
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre de la Categoría',
      type: 'text',
      required: true,
      placeholder: 'Ej: Colchones, Alfombras, Muebles',
      md: 12,
      validation: (value) => {
        if (!value?.trim()) return 'El nombre es requerido';
        if (value.length > 100) return 'El nombre no puede exceder 100 caracteres';
        return true;
      }
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Describe el tipo de servicios que incluye esta categoría',
      md: 12,
      rows: 3
    },
    {
      name: 'icono',
      label: 'Icono (Emoji)',
      type: 'text',
      required: false,
      placeholder: '🛋️ 🛏️ 🪟 📦',
      md: 6
    },
    {
      name: 'orden',
      label: 'Orden de Visualización',
      type: 'number',
      required: false,
      placeholder: '0',
      md: 6,
      inputProps: { min: 0, max: 999 }
    },
    {
      name: 'activa',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 1, label: 'Activa' },
        { value: 0, label: 'Inactiva' }
      ],
      md: 12
    }
  ];

  // Default form values
  const defaultValues = {
    nombre: '',
    descripcion: '',
    icono: '',
    orden: crudOperations.data?.length || 0,
    activa: 1
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    // Verificar si tiene servicios activos
    if (item.servicios_activos > 0) {
      if (!window.confirm(
        `⚠️ Esta categoría tiene ${item.servicios_activos} servicio(s) activo(s).\n\n` +
        `¿Está seguro de desactivarla? Los servicios seguirán asociados pero la categoría no aparecerá en los listados.`
      )) {
        return;
      }
    } else {
      if (!window.confirm(`¿Está seguro de desactivar la categoría "${item.nombre}"?`)) {
        return;
      }
    }

    try {
      await crudOperations.remove(item.id);
    } catch (error) {
      // Error handled by UI
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
      return true;
    } catch (error) {
      // Error handled by UI
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Categorías de Servicios"
        subtitle="Administra las categorías de servicios disponibles"
        icon={<CategoryIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nueva Categoría"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay categorías registradas"
        title="Lista de Categorías"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Categoría' : 'Nueva Categoría'}
        fields={formFields}
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardCategorias;
