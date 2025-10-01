import React, { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { userService, rolService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardUsuarios = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(userService);
  const { data: roles } = useApi(rolService.getAll);

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

  // Helper function to get status color
  const getStatusColor = (statusName) => {
    const statusColors = {
      'activo': 'success',
      'inactivo': 'error',
      'suspendido': 'warning',
      'bloqueado': 'error'
    };
    return statusColors[statusName?.toLowerCase()] || 'default';
  };

  // Table columns configuration
  const columns = [
    {
      field: 'usuario',
      headerName: 'Usuario',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {`${row.nombre?.charAt(0) || ''}${row.apellido?.charAt(0) || ''}`.toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {row.nombre} {row.apellido}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              ID: {row.id}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'contacto',
      headerName: 'Contacto',
      render: (value, row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            {row.email}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Tel: {row.telefono || 'No especificado'}
          </div>
        </div>
      )
    },
    {
      field: 'rol',
      headerName: 'Rol',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={row.rol_nombre || 'Sin rol'}
            color={getRoleColor(row.rol_nombre)}
            size="small"
            variant="outlined"
          />
        </div>
      )
    },
    {
      field: 'estado',
      headerName: 'Estado',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BadgeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={row.activo ? 'Activo' : 'Inactivo'}
            color={getStatusColor(row.activo ? 'activo' : 'inactivo')}
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
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      md: 6
    },
    {
      name: 'apellido',
      label: 'Apellido',
      type: 'text',
      required: true,
      md: 6
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      md: 6,
      validation: (value) => {
        if (!value?.trim()) return 'El email es requerido';
        if (!/\S+@\S+\.\S+/.test(value)) return 'El email no tiene un formato válido';
        return true;
      }
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'text',
      required: true,
      md: 6
    },
    {
      name: 'rol_id',
      label: 'Rol',
      type: 'select',
      required: true,
      options: roles?.map(rol => ({
        value: rol.id,
        label: rol.nombre
      })) || [],
      md: 6
    },
    {
      name: 'activo',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 1, label: 'Activo' },
        { value: 0, label: 'Inactivo' }
      ],
      md: 6
    },
    ...(selectedItem ? [] : [
      {
        name: 'password',
        label: 'Contraseña',
        type: 'password',
        required: true,
        md: 6,
        validation: (value) => {
          if (!value?.trim()) return 'La contraseña es requerida';
          if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
          return true;
        }
      }
    ])
  ];

  // Default form values
  const defaultValues = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol_id: '',
    activo: 1,
    password: ''
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${item.nombre} ${item.apellido}?`)) {
      try {
        await crudOperations.remove(item.id);
      } catch (error) {
        console.error('Error deleting usuario:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedItem) {
        // Remove password from update if not provided
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await crudOperations.update(selectedItem.id, updateData);
      } else {
        await crudOperations.create(formData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving usuario:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Usuarios"
        subtitle="Gestionar usuarios del sistema"
        icon={<PersonIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Usuario"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay usuarios registrados"
        title="Lista de Usuarios"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Usuario' : 'Nuevo Usuario'}
        fields={formFields}
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardUsuarios;
