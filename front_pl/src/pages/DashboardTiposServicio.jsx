import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import {
  Style as StyleIcon,
  Palette as PaletteIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks siguiendo el patrón establecido
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { tipoServicioService } from '../services/apiService';
import { useCrud } from '../hooks';

const DashboardTiposServicio = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations usando el hook personalizado
  const crudOperations = useCrud(tipoServicioService);

  // Colores predefinidos para selección rápida
  const colorPresets = [
    { value: '#2196f3', label: 'Azul' },
    { value: '#4caf50', label: 'Verde' },
    { value: '#ff9800', label: 'Naranja' },
    { value: '#f44336', label: 'Rojo' },
    { value: '#9c27b0', label: 'Morado' },
    { value: '#607d8b', label: 'Gris' },
  ];

  // Table columns configuration
  const columns = [
    {
      field: 'nombre',
      headerName: 'Tipo de Servicio',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: row.color || '#ccc',
              marginRight: 2,
              border: '2px solid',
              borderColor: 'divider'
            }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{row.nombre}</div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {row.color || 'Sin color'}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      render: (value, row) => (
        <span style={{ fontSize: '0.875rem' }}>
          {row.descripcion || 'Sin descripción'}
        </span>
      )
    },
    {
      field: 'multiplicador_precio',
      headerName: 'Multiplicador',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'success.main' }}>
              x{row.multiplicador_precio || '1.00'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              {row.multiplicador_precio >= 1.5 ? 'Premium' : 
               row.multiplicador_precio >= 1.2 ? 'Estándar' : 'Básico'}
            </div>
          </div>
        </div>
      )
    },
    {
      field: 'reservas',
      headerName: 'Reservas',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {row.total_reservas || 0} total
          </div>
          <div style={{ fontSize: '0.75rem', color: 'success.main' }}>
            {row.reservas_activas || 0} activas
          </div>
        </div>
      )
    }
  ];

  // Form fields configuration
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre del Tipo',
      type: 'text',
      required: true,
      placeholder: 'Ej: Deluxe, Express, Premium',
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
      placeholder: 'Describe las características de este tipo de servicio',
      md: 12,
      rows: 3
    },
    {
      name: 'multiplicador_precio',
      label: 'Multiplicador de Precio',
      type: 'number',
      required: true,
      placeholder: '1.00',
      md: 6,
      inputProps: { min: 0.1, max: 10, step: 0.1 },
      helperText: 'Factor por el cual se multiplica el precio base (0.1 - 10)',
      validation: (value) => {
        if (!value) return 'El multiplicador es requerido';
        if (value < 0.1 || value > 10) return 'Debe estar entre 0.1 y 10';
        return true;
      }
    },
    {
      name: 'color',
      label: 'Color (HEX)',
      type: 'text',
      required: false,
      placeholder: '#2196f3',
      md: 6,
      helperText: 'Formato HEX: #RRGGBB',
      validation: (value) => {
        if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return 'Formato inválido. Use formato HEX: #RRGGBB';
        }
        return true;
      }
    }
  ];

  // Default form values
  const defaultValues = {
    nombre: '',
    descripcion: '',
    multiplicador_precio: 1.00,
    color: colorPresets[0].value
  };

  // Event handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (item.reservas_activas > 0) {
      if (!window.confirm(
        `⚠️ Este tipo tiene ${item.reservas_activas} reserva(s) activa(s).\n\n` +
        `¿Está seguro de eliminarlo?`
      )) {
        return;
      }
    } else {
      if (!window.confirm(`¿Está seguro de eliminar el tipo "${item.nombre}"?`)) {
        return;
      }
    }

    try {
      await crudOperations.remove(item.id);
    } catch (error) {
      console.error('Error deleting tipo servicio:', error);
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
      console.error('Error saving tipo servicio:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Tipos de Servicio"
        subtitle="Gestiona los tipos y sus multiplicadores de precio"
        icon={<StyleIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nuevo Tipo"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay tipos de servicio registrados"
        title="Lista de Tipos de Servicio"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio'}
        fields={formFields}
        initialData={selectedItem || defaultValues}
        onSubmit={handleSubmit}
        loading={crudOperations.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardTiposServicio;
