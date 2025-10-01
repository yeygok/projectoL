import React, { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  Security as RoleIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { rolService } from '../services';
import { useCrud } from '../hooks';

const DashboardRoles = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(rolService);

  // Helper function to get role color
  const getRoleColor = (roleName) => {
    const roleColors = {
      'admin': 'error',
      'cliente': 'primary',
      'tecnico': 'success',
      'soporte': 'warning'
    };
    return roleColors[roleName?.toLowerCase()] || 'default';
  };

  // Helper function to get role icon
  const getRoleIcon = (roleName) => {
    const roleIcons = {
      'admin': <AdminIcon />,
      'cliente': <PersonIcon />,
      'tecnico': <RoleIcon />,
      'soporte': <GroupIcon />
    };
    return roleIcons[roleName?.toLowerCase()] || <RoleIcon />;
  };

  // Table columns configuration
  const columns = [
    {
      field: 'rol',
      headerName: 'Rol',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {getRoleIcon(item.nombre_rol)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {item.nombre_rol}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {item.id_rol}
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
            {item.descripcion_rol || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      field: 'estado',
      headerName: 'Estado',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={item.activo ? 'Activo' : 'Inactivo'}
            color={item.activo ? 'success' : 'error'}
            size="small"
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
            label={item.nombre_rol}
            color={getRoleColor(item.nombre_rol)}
            size="small"
            variant="outlined"
          />
        </div>
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre_rol',
      headerName: 'Nombre del Rol',
      type: 'text',
      required: true,
      placeholder: 'Ej: admin, cliente, tecnico, soporte',
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'descripcion_rol',
      headerName: 'Descripción',
      type: 'textarea',
      rows: 3,
      placeholder: 'Descripción detallada del rol y sus responsabilidades...',
      gridProps: { xs: 12 }
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
    }
  ];

  // Default form values
  const defaultValues = {
    nombre_rol: '',
    descripcion_rol: '',
    activo: true
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.nombre_rol?.trim()) {
      errors.nombre_rol = 'El nombre del rol es requerido';
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
    if (window.confirm(`¿Está seguro de eliminar el rol "${item.nombre_rol}"?`)) {
      try {
        await crudOperations.remove(item.id_rol);
      } catch (error) {
        console.error('Error deleting rol:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        activo: formData.activo === true || formData.activo === 'true'
      };

      if (selectedItem) {
        await crudOperations.update(selectedItem.id_rol, processedData);
      } else {
        await crudOperations.create(processedData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving rol:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Roles"
        subtitle="Gestionar roles y permisos del sistema"
        icon={<RoleIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Rol"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay roles registrados"
        title="Lista de Roles"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Rol' : 'Nuevo Rol'}
        fields={formFields}
        defaultValues={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        validate={validateForm}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardRoles;
