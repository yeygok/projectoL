import React, { useState } from 'react';
import { Chip, Box, Typography } from '@mui/material';
import {
  ShoppingCart as OrdenIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  Person as PersonIcon,
  ConfirmationNumber as TicketIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { ordenCompraService } from '../services/apiService';
import { useCrud } from '../hooks';

const DashboardOrdenesCompra = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations
  const crudOperations = useCrud(ordenCompraService);

  // Helper para color según estado de pago
  const getEstadoPagoColor = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower === 'pagado' || estadoLower === 'completado') return 'success';
    if (estadoLower === 'pendiente') return 'warning';
    if (estadoLower === 'cancelado' || estadoLower === 'fallido') return 'error';
    return 'default';
  };

  // Helper para icono según estado
  const getEstadoIcon = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower === 'pagado' || estadoLower === 'completado') return <CheckIcon />;
    if (estadoLower === 'pendiente') return <PendingIcon />;
    if (estadoLower === 'cancelado' || estadoLower === 'fallido') return <CancelIcon />;
    return <ReceiptIcon />;
  };

  // Helper para formato de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Configuración de columnas
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      align: 'center',
    },
    {
      field: 'numero_orden',
      headerName: 'Número de Orden',
      width: 200,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
          icon={<TicketIcon />}
        />
      ),
    },
    {
      field: 'reserva_id',
      headerName: 'Reserva',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={`#${params.value}`}
          size="small"
          color="info"
          variant="outlined"
        />
      ),
    },
    {
      field: 'cliente_nombre',
      headerName: 'Cliente',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.value || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'servicio_nombre',
      headerName: 'Servicio',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'monto_total',
      headerName: 'Monto Total',
      width: 150,
      align: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <MoneyIcon fontSize="small" color="success" />
          <Typography variant="body2" fontWeight="bold" color="success.main">
            {formatCurrency(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'estado_pago',
      headerName: 'Estado de Pago',
      width: 150,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          color={getEstadoPagoColor(params.value)}
          icon={getEstadoIcon(params.value)}
        />
      ),
    },
    {
      field: 'metodo_pago',
      headerName: 'Método de Pago',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'N/A'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'fecha_orden',
      headerName: 'Fecha de Orden',
      width: 150,
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        const fecha = new Date(params.value);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {fecha.toLocaleDateString('es-CO')}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
              {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'fecha_pago',
      headerName: 'Fecha de Pago',
      width: 150,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Typography variant="caption" color="text.secondary" fontStyle="italic">
              Pendiente
            </Typography>
          );
        }
        const fecha = new Date(params.value);
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckIcon fontSize="small" color="success" />
              <Typography variant="body2">
                {fecha.toLocaleDateString('es-CO')}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
              {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        );
      },
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'reserva_id',
      label: 'ID de Reserva',
      type: 'number',
      required: true,
      helperText: 'ID de la reserva asociada',
    },
    {
      name: 'monto_total',
      label: 'Monto Total',
      type: 'number',
      required: true,
      inputProps: { min: 0, step: 1000 },
      helperText: 'Monto total de la orden en COP',
    },
    {
      name: 'metodo_pago',
      label: 'Método de Pago',
      type: 'select',
      required: true,
      options: [
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'tarjeta', label: 'Tarjeta' },
        { value: 'transferencia', label: 'Transferencia' },
        { value: 'pse', label: 'PSE' },
        { value: 'nequi', label: 'Nequi' },
        { value: 'daviplata', label: 'Daviplata' },
      ],
      helperText: 'Selecciona el método de pago',
    },
    {
      name: 'estado_pago',
      label: 'Estado de Pago',
      type: 'select',
      required: true,
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' },
        { value: 'cancelado', label: 'Cancelado' },
        { value: 'fallido', label: 'Fallido' },
      ],
      helperText: 'Estado actual del pago',
    },
  ];

  // Handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar la orden ${item.numero_orden}?`)) {
      await crudOperations.deleteItem(item.id);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedItem) {
        await crudOperations.update(selectedItem.id, formData);
      } else {
        await crudOperations.create(formData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Órdenes de Compra"
        subtitle="Gestiona las órdenes de pago y transacciones"
        icon={<OrdenIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nueva Orden"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay órdenes de compra registradas"
        title="Lista de Órdenes"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        title={selectedItem ? 'Editar Orden' : 'Nueva Orden'}
        fields={formFields}
        initialData={selectedItem}
        maxWidth="sm"
      />
    </NotificationProvider>
  );
};

export default DashboardOrdenesCompra;
