import React, { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  VpnKey as PermisoIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { permisoService } from '../services';
import { useCrud } from '../hooks';

const DashboardPermisos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(permisoService);

  // Helper function to get permission color
  const getPermisoColor = (nombre) => {
    const permisoColors = {
      'read': 'info',
      'write': 'warning',
      'delete': 'error',
      'admin': 'error',
      'create': 'success'
    };
    const key = Object.keys(permisoColors).find(k => 
      nombre?.toLowerCase().includes(k)
    );
    return permisoColors[key] || 'default';
  };

  // Helper function to get permission icon
  const getPermisoIcon = (nombre) => {
    if (nombre?.toLowerCase().includes('admin')) return <AdminIcon />;
    if (nombre?.toLowerCase().includes('delete')) return <LockIcon />;
    if (nombre?.toLowerCase().includes('write') || nombre?.toLowerCase().includes('create')) return <SecurityIcon />;
    return <PermisoIcon />;
  };

  // Table columns configuration
  const columns = [
    {
      field: 'permiso',
      headerName: 'Permiso',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {getPermisoIcon(item.nombre_permiso)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {item.nombre_permiso}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {item.id_permiso}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      render: (item) => (
        <div style={{ maxWidth: 250 }}>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {item.descripcion_permiso || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      field: 'modulo',
      headerName: 'Módulo',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={item.modulo || 'General'}
            color="primary"
            size="small"
            variant="outlined"
          />
        </div>
      )
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={item.nombre_permiso}
            color={getPermisoColor(item.nombre_permiso)}
            size="small"
          />
        </div>
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre_permiso',
      headerName: 'Nombre del Permiso',
      type: 'text',
      required: true,
      placeholder: 'Ej: usuarios.create, productos.read, admin.full',
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'descripcion_permiso',
      headerName: 'Descripción',
      type: 'textarea',
      rows: 3,
      placeholder: 'Descripción detallada del permiso y sus alcances...',
      gridProps: { xs: 12 }
    },
    {
      name: 'modulo',
      headerName: 'Módulo',
      type: 'select',
      options: [
        { value: 'usuarios', headerName: 'Usuarios' },
        { value: 'productos', headerName: 'Productos' },
        { value: 'servicios', headerName: 'Servicios' },
        { value: 'clientes', headerName: 'Clientes' },
        { value: 'agendamientos', headerName: 'Agendamientos' },
        { value: 'roles', headerName: 'Roles' },
        { value: 'permisos', headerName: 'Permisos' },
        { value: 'reportes', headerName: 'Reportes' },
        { value: 'configuracion', headerName: 'Configuración' },
        { value: 'general', headerName: 'General' }
      ],
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'accion',
      headerName: 'Acción',
      type: 'select',
      options: [
        { value: 'create', headerName: 'Crear' },
        { value: 'read', headerName: 'Leer' },
        { value: 'update', headerName: 'Actualizar' },
        { value: 'delete', headerName: 'Eliminar' },
        { value: 'admin', headerName: 'Administrar' },
        { value: 'full', headerName: 'Control Total' }
      ],
      gridProps: { xs: 12, md: 6 }
    }
  ];

  // Default form values
  const defaultValues = {
    nombre_permiso: '',
    descripcion_permiso: '',
    modulo: 'general',
    accion: 'read'
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.nombre_permiso?.trim()) {
      errors.nombre_permiso = 'El nombre del permiso es requerido';
    }

    return errors;
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar el permiso "${item.nombre_permiso}"?`)) {
      try {
        await crudOperations.remove(item.id_permiso);
      } catch (error) {
        console.error('Error deleting permiso:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedItem) {
        await crudOperations.update(selectedItem.id_permiso, formData);
      } else {
        await crudOperations.create(formData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving permiso:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Permisos"
        subtitle="Gestionar permisos del sistema"
        icon={<PermisoIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Permiso"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay permisos registrados"
        title="Lista de Permisos"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Permiso' : 'Nuevo Permiso'}
        fields={formFields}
        defaultValues={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        validate={validateForm}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardPermisos;
