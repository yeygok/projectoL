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
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: getRoleColor(row.nombre), color: 'white' }}>
            {getRoleIcon(row.nombre)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
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
      field: 'descripcion',
      headerName: 'Descripción',
      render: (value, row) => (
        <div style={{ maxWidth: 300 }}>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.875rem'
          }}>
            {row.descripcion || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      field: 'usuarios',
      headerName: 'Usuarios',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <div>
            <div style={{ fontWeight: 600 }}>
              {row.usuarios_con_rol || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              usuarios
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'categoria',
      headerName: 'Tipo',
      render: (value, row) => (
        <Chip
          label={row.nombre}
          color={getRoleColor(row.nombre)}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
        />
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre del Rol',
      type: 'text',
      required: true,
      placeholder: 'Ej: admin, cliente, tecnico, soporte',
      md: 12,
      validation: (value) => {
        if (!value?.trim()) return 'El nombre del rol es requerido';
        if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
        return true;
      }
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      rows: 3,
      placeholder: 'Descripción detallada del rol y sus responsabilidades...',
      md: 12
    }
  ];

  // Default form values
  const defaultValues = {
    nombre: '',
    descripcion: ''
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    // Roles críticos que no se pueden eliminar
    const rolesCriticos = ['admin', 'cliente', 'tecnico'];
    if (rolesCriticos.includes(item.nombre?.toLowerCase())) {
      alert(`⚠️ El rol "${item.nombre}" es crítico y no puede ser eliminado.`);
      return;
    }

    if (item.usuarios_con_rol > 0) {
      if (!window.confirm(
        `⚠️ Este rol tiene ${item.usuarios_con_rol} usuario(s) asignado(s).\n\n` +
        `¿Está seguro de eliminarlo? Los usuarios quedarán sin rol.`
      )) {
        return;
      }
    } else {
      if (!window.confirm(`¿Está seguro de eliminar el rol "${item.nombre}"?`)) {
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
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardRoles;
