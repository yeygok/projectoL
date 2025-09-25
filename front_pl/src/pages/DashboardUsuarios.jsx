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
import { userService, rolService, estadoUsuarioService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardUsuarios = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(userService);
  const { data: roles } = useApi(rolService.getAll);
  const { data: estadosUsuario } = useApi(estadoUsuarioService.getAll);

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
      id: 'usuario',
      label: 'Usuario',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {`${item.nombre?.charAt(0) || ''}${item.apellido?.charAt(0) || ''}`.toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {item.nombre} {item.apellido}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              @{item.username}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contacto',
      label: 'Contacto',
      render: (item) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            {item.email}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Tel: {item.telefono || 'No especificado'}
          </div>
        </div>
      )
    },
    {
      id: 'rol',
      label: 'Rol',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={item.rol_nombre || 'Sin rol'}
            color={getRoleColor(item.rol_nombre)}
            size="small"
            variant="outlined"
          />
        </div>
      )
    },
    {
      id: 'estado',
      label: 'Estado',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BadgeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={item.estado_nombre || 'Sin estado'}
            color={getStatusColor(item.estado_nombre)}
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
      label: 'Nombre',
      type: 'text',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'apellido',
      label: 'Apellido',
      type: 'text',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'username',
      label: 'Nombre de Usuario',
      type: 'text',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'text',
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'id_rol',
      label: 'Rol',
      type: 'select',
      required: true,
      options: roles?.map(rol => ({
        value: rol.id_rol,
        label: rol.nombre_rol
      })) || [],
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'id_estado_usuario',
      label: 'Estado',
      type: 'select',
      required: true,
      options: estadosUsuario?.map(estado => ({
        value: estado.id_estado_usuario,
        label: estado.nombre_estado
      })) || [],
      gridProps: { xs: 12, md: 6 }
    },
    ...(selectedItem ? [] : [
      {
        name: 'password',
        label: 'Contraseña',
        type: 'password',
        required: true,
        gridProps: { xs: 12, md: 6 }
      }
    ])
  ];

  // Default form values
  const defaultValues = {
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    telefono: '',
    id_rol: '',
    id_estado_usuario: '',
    password: ''
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.nombre?.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!data.apellido?.trim()) {
      errors.apellido = 'El apellido es requerido';
    }
    
    if (!data.username?.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    }
    
    if (!data.email?.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'El email no tiene un formato válido';
    }

    if (!data.id_rol) {
      errors.id_rol = 'El rol es requerido';
    }

    if (!data.id_estado_usuario) {
      errors.id_estado_usuario = 'El estado es requerido';
    }

    if (!selectedItem && !data.password?.trim()) {
      errors.password = 'La contraseña es requerida';
    }

    if (data.password && data.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return errors;
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${item.nombre} ${item.apellido}?`)) {
      try {
        await crudOperations.remove(item.id_usuario);
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
        await crudOperations.update(selectedItem.id_usuario, updateData);
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
        defaultValues={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        validate={validateForm}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardUsuarios;
