import React, { useState } from 'react';
import { Avatar, Chip } from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { agendamientoService, userService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardAgendamientos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(agendamientoService);
  const { data: usuarios } = useApi(userService.getAll);
  
  // Datos auxiliares usando useApi
  const { data: ubicaciones } = useApi(() => 
    fetch('http://localhost:3000/api/dashboard/ubicaciones', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json())
  );
  
  const { data: estadosReserva } = useApi(() =>
    fetch('http://localhost:3000/api/dashboard/estados-reserva', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json())
  );
  
  const { data: vehiculos } = useApi(() =>
    fetch('http://localhost:3000/api/dashboard/vehiculos', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json())
  );

  // Helper function to get status color
  const getStatusColor = (statusName) => {
    const statusColors = {
      'pendiente': 'warning',
      'confirmada': 'info',
      'asignada': 'primary',
      'en_proceso': 'secondary',
      'completada': 'success',
      'cancelada': 'error',
      'reagendada': 'warning'
    };
    return statusColors[statusName?.toLowerCase()] || 'default';
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
      field: 'cliente',
      headerName: 'Cliente',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            <PersonIcon />
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {row.cliente_nombre} {row.cliente_apellido}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {row.cliente_email}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'fecha_servicio',
      headerName: 'Fecha/Hora',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {new Date(row.fecha_servicio).toLocaleDateString('es-ES')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {new Date(row.fecha_servicio).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      )
    },
    {
      field: 'precio_total',
      headerName: 'Precio',
      render: (value, row) => (
        <div style={{ fontWeight: 600, color: 'success.main' }}>
          {formatPrice(row.precio_total)}
        </div>
      )
    },
    {
      field: 'estado_nombre',
      headerName: 'Estado',
      render: (value, row) => (
        <Chip
          label={row.estado_nombre || 'Sin estado'}
          color={getStatusColor(row.estado_nombre)}
          size="small"
          variant="outlined"
        />
      )
    }
  ];

  // Form fields configuration  
  const formFields = [
    {
      name: 'cliente_id',
      label: 'Cliente',
      type: 'select',
      required: true,
      options: usuarios?.filter(u => u.rol_nombre === 'cliente').map(cliente => ({
        value: cliente.id,
        label: `${cliente.nombre} ${cliente.apellido}`
      })) || [],
      md: 6
    },
    {
      name: 'servicio_tipo_id',
      label: 'Tipo de Servicio',
      type: 'select',
      required: true,
      options: [
        { value: 1, label: 'Sencillo' },
        { value: 2, label: 'Premium' },
        { value: 3, label: 'Gold' },
        { value: 4, label: 'Deluxe' },
        { value: 5, label: 'Express' }
      ],
      md: 6
    },
    {
      name: 'ubicacion_servicio_id',
      label: 'Ubicación',
      type: 'select',
      required: true,
      options: ubicaciones?.filter(u => u.activa === 1).map(ubicacion => ({
        value: ubicacion.id,
        label: `${ubicacion.direccion} - ${ubicacion.barrio}`
      })) || [],
      md: 6
    },
    {
      name: 'fecha_info',
      label: 'Fecha de Servicio (Automática)',
      type: 'text',
      disabled: true,
      defaultValue: 'Se programará automáticamente para dentro de 1 hora',
      helperText: 'La fecha se asigna automáticamente al crear la reserva',
      md: 6
    },
    // Campo fecha_servicio manejado automáticamente por el backend
    {
      name: 'precio_total',
      label: 'Precio Total',
      type: 'number',
      required: true,
      md: 6
    },
    {
      name: 'estado_id',
      label: 'Estado',
      type: 'select',
      required: true,
      options: estadosReserva?.map(estado => ({
        value: estado.id,
        label: estado.estado.charAt(0).toUpperCase() + estado.estado.slice(1)
      })) || [],
      md: 6
    },
    {
      name: 'observaciones',
      label: 'Observaciones',
      type: 'text',
      multiline: true,
      rows: 2,
      md: 12
    }
  ];

  // Función para generar fecha de servicio automática (1 hora después)
  const generateServiceDate = () => {
    const now = new Date();
    // Agregar 1 hora
    now.setHours(now.getHours() + 1);
    // Redondear minutos a 0 o 30
    const minutes = now.getMinutes();
    now.setMinutes(minutes < 30 ? 0 : 30);
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    // Generar fecha en formato YYYY-MM-DDTHH:MM:SS
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes_str = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const fechaServicio = `${year}-${month}-${day}T${hours}:${minutes_str}:${seconds}`;
    console.log('Fecha generada:', fechaServicio);
    return fechaServicio;
  };  // Default form values
  const defaultValues = {
    cliente_id: '',
    servicio_tipo_id: 1,
    ubicacion_servicio_id: '',
    precio_total: 45000,
    estado_id: 1,
    observaciones: ''
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar la reserva del cliente ${item.cliente_nombre} ${item.cliente_apellido}?`)) {
      try {
        await crudOperations.remove(item.id);
      } catch (error) {
        console.error('Error deleting agendamiento:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Preparar datos con fecha automática y campos numéricos correctos
      const processedData = {
        cliente_id: parseInt(formData.cliente_id),
        servicio_tipo_id: parseInt(formData.servicio_tipo_id),
        ubicacion_servicio_id: parseInt(formData.ubicacion_servicio_id),
        precio_total: parseFloat(formData.precio_total),
        estado_id: parseInt(formData.estado_id),
        observaciones: formData.observaciones || null,
        // Generar fecha_servicio automáticamente
        fecha_servicio: generateServiceDate()
      };

      console.log('Datos procesados para enviar:', processedData);

      if (selectedItem) {
        await crudOperations.update(selectedItem.id, processedData);
      } else {
        await crudOperations.create(processedData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving agendamiento:', error);
      alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Agendamientos"
        subtitle="Gestionar reservas y citas del sistema"
        icon={<CalendarIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nueva Reserva"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay agendamientos registrados"
        title="Lista de Agendamientos"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Agendamiento' : 'Nueva Reserva'}
        fields={formFields}
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
        maxWidth="md"
      />
    </NotificationProvider>
  );
};

export default DashboardAgendamientos;
