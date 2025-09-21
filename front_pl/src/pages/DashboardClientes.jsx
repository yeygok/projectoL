import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { clienteService, tipoDocumentoService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardClientes = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(clienteService);
  const { data: tiposDocumento } = useApi(tipoDocumentoService.getAll);

  // Table columns configuration
  const columns = [
    {
      id: 'cliente',
      label: 'Cliente',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {`${item.nombres?.charAt(0) || ''}${item.apellidos?.charAt(0) || ''}`.toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {item.nombres} {item.apellidos}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              Cliente #{item.id_cliente}
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            {item.telefono}
          </div>
        </div>
      )
    },
    {
      id: 'documento',
      label: 'Documento',
      render: (item) => (
        <div>
          <div>{item.tipo_documento_nombre || 'N/A'}</div>
          <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {item.numero_documento}
          </div>
        </div>
      )
    },
    {
      id: 'ubicacion',
      label: 'Ubicación',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <div style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.direccion || 'No especificada'}
          </div>
        </div>
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombres',
      label: 'Nombres',
      type: 'text',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'apellidos',
      label: 'Apellidos',
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
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'id_tipo_documento',
      label: 'Tipo de Documento',
      type: 'select',
      required: true,
      options: tiposDocumento?.map(tipo => ({
        value: tipo.id_tipo_documento,
        label: tipo.nombre_tipo_documento
      })) || [],
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'numero_documento',
      label: 'Número de Documento',
      type: 'text',
      required: true,
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'direccion',
      label: 'Dirección',
      type: 'text',
      gridProps: { xs: 12 }
    },
    {
      name: 'fecha_nacimiento',
      label: 'Fecha de Nacimiento',
      type: 'date',
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'genero',
      label: 'Género',
      type: 'select',
      options: [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' },
        { value: 'Otro', label: 'Otro' }
      ],
      gridProps: { xs: 12, md: 6 }
    },
    {
      name: 'observaciones',
      label: 'Observaciones',
      type: 'textarea',
      rows: 3,
      placeholder: 'Observaciones adicionales sobre el cliente...',
      gridProps: { xs: 12 }
    }
  ];

  // Default form values
  const defaultValues = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    id_tipo_documento: '',
    numero_documento: '',
    direccion: '',
    fecha_nacimiento: '',
    genero: '',
    observaciones: ''
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.nombres?.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }
    
    if (!data.apellidos?.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }
    
    if (!data.email?.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'El email no tiene un formato válido';
    }
    
    if (!data.telefono?.trim()) {
      errors.telefono = 'El teléfono es requerido';
    }

    if (!data.id_tipo_documento) {
      errors.id_tipo_documento = 'El tipo de documento es requerido';
    }

    if (!data.numero_documento?.trim()) {
      errors.numero_documento = 'El número de documento es requerido';
    }

    return errors;
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar al cliente ${item.nombres} ${item.apellidos}?`)) {
      try {
        await crudOperations.remove(item.id_cliente);
      } catch (error) {
        console.error('Error deleting cliente:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedItem) {
        await crudOperations.update(selectedItem.id_cliente, formData);
      } else {
        await crudOperations.create(formData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving cliente:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Clientes"
        subtitle="Gestionar información de clientes del sistema"
        icon={<PersonIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Cliente"
      />

      <DataTable
        data={crudOperations.data}
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
        defaultValues={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        validate={validateForm}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardClientes;
