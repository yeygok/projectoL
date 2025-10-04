import React, { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { userService } from '../services';
import { useCrud } from '../hooks';

const DashboardClientes = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations - Traer todos los usuarios y filtrar por rol cliente
  const crudOperations = useCrud(userService);

  // Filtrar solo usuarios con rol de cliente
  const clientesData = crudOperations.data?.filter(
    user => user.rol_nombre?.toLowerCase() === 'cliente' || user.rol_id === 2
  ) || [];

  // Table columns configuration
  const columns = [
    {
      field: 'cliente',
      headerName: 'Cliente',
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
              ID: {row.id} • Cliente
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
            <span style={{ fontSize: '0.875rem' }}>{row.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            <span style={{ fontSize: '0.875rem' }}>{row.telefono || 'No especificado'}</span>
          </div>
        </div>
      )
    },
    {
      field: 'rol',
      headerName: 'Rol',
      render: (value, row) => (
        <Chip
          label="Cliente"
          color="primary"
          size="small"
          variant="outlined"
          icon={<PersonIcon />}
        />
      )
    },
    {
      field: 'estado',
      headerName: 'Estado',
      render: (value, row) => (
        <Chip
          label={row.activo ? 'Activo' : 'Inactivo'}
          color={row.activo ? 'success' : 'default'}
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
      label: 'Nombre',
      type: 'text',
      required: true,
      md: 6,
      validation: (value) => {
        if (!value?.trim()) return 'El nombre es requerido';
        return true;
      }
    },
    {
      name: 'apellido',
      label: 'Apellido',
      type: 'text',
      required: true,
      md: 6,
      validation: (value) => {
        if (!value?.trim()) return 'El apellido es requerido';
        return true;
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      md: 6,
      validation: (value) => {
        if (!value?.trim()) return 'El email es requerido';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido';
        return true;
      }
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'text',
      required: true,
      md: 6,
      placeholder: '3001234567'
    },
    {
      name: 'rol_id',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [
        { value: 2, label: 'Cliente' }
      ],
      md: 6,
      disabled: true, // Siempre será cliente
      helperText: 'Los clientes siempre tienen rol de Cliente'
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
        md: 12,
        validation: (value) => {
          if (!value?.trim()) return 'La contraseña es requerida';
          if (value.length < 6) return 'Mínimo 6 caracteres';
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
    rol_id: 2, // Siempre cliente
    activo: 1,
    password: ''
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(
      `¿Está seguro de eliminar al cliente ${item.nombre} ${item.apellido}?\n\n` +
      `Esta acción no se puede deshacer.`
    )) {
      return;
    }

    try {
      await crudOperations.remove(item.id);
    } catch (error) {
      // Error handled by UI
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Asegurar que siempre tenga rol_id = 2 (cliente)
      const clienteData = {
        ...formData,
        rol_id: 2
      };

      if (selectedItem) {
        // No enviar password en edición si está vacío
        const updateData = { ...clienteData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await crudOperations.update(selectedItem.id, updateData);
      } else {
        await crudOperations.create(clienteData);
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
        title="Clientes"
        subtitle={`Gestionar usuarios con rol de cliente (${clientesData.length} clientes)`}
        icon={<PersonIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Cliente"
      />

      <DataTable
        data={clientesData}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay clientes registrados"
        title="Lista de Clientes"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Cliente' : 'Nuevo Cliente'}
        fields={formFields}
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardClientes;
