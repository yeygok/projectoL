import React, { useState } from 'react';
import { Box } from '@mui/material';
import { 
  Add as AddIcon,
  CalendarToday as CalendarIcon 
} from '@mui/icons-material';

// Componentes reutilizables
import { 
  PageHeader, 
  DataTable, 
  FormDialog, 
  useNotification 
} from '../components/common';

// Servicios y hooks
import { agendamientoService, clienteService, servicioService } from '../services';
import { useCrud, useApi } from '../hooks';

const DashboardAgendamientos = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { showSuccess, showError } = useNotification();

  // Datos principales
  const {
    data: agendamientos,
    loading,
    error,
    create,
    update,
    remove,
    refetch,
  } = useCrud(agendamientoService);

  // Datos para formulario
  const { data: clientes } = useApi(clienteService.getAll);
  const { data: servicios } = useApi(servicioService.getAll);

  // Configuración de columnas de la tabla
  const columns = [
    {
      field: 'cliente_nombre',
      headerName: 'Cliente',
      minWidth: 200,
    },
    {
      field: 'servicio_nombre', 
      headerName: 'Servicio',
      minWidth: 180,
    },
    {
      field: 'fecha_agendamiento',
      headerName: 'Fecha y Hora',
      type: 'date',
      minWidth: 180,
      render: (value) => new Date(value).toLocaleString('es-ES'),
    },
    {
      field: 'estado_orden',
      headerName: 'Estado',
      type: 'chip',
      chipColor: (value) => {
        switch (value?.toLowerCase()) {
          case 'confirmada': return 'success';
          case 'cancelada': return 'error';
          case 'completada': return 'info';
          default: return 'warning';
        }
      },
    },
    {
      field: 'observaciones',
      headerName: 'Observaciones',
      minWidth: 200,
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'cliente_id',
      label: 'Cliente',
      type: 'select',
      required: true,
      options: clientes?.map(c => ({ value: c.id_cliente, label: c.nombre })) || [],
      sm: 6,
    },
    {
      name: 'servicio_id',
      label: 'Servicio',
      type: 'select',
      required: true,
      options: servicios?.map(s => ({ value: s.id_servicio, label: s.nombre })) || [],
      sm: 6,
    },
    {
      name: 'fecha_agendamiento',
      label: 'Fecha y Hora',
      type: 'datetime',
      required: true,
      sm: 6,
    },
    {
      name: 'observaciones',
      label: 'Observaciones',
      type: 'text',
      multiline: true,
      rows: 3,
      sm: 12,
    },
  ];

  const handleCreate = () => {
    setEditData(null);
    setFormOpen(true);
  };

  const handleEdit = (agendamiento) => {
    setEditData(agendamiento);
    setFormOpen(true);
  };

  const handleDelete = async (agendamiento) => {
    if (window.confirm('¿Está seguro de eliminar este agendamiento?')) {
      try {
        await remove(agendamiento.id_agendamiento);
        showSuccess('Agendamiento eliminado correctamente');
      } catch (error) {
        showError('Error al eliminar el agendamiento');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await update(editData.id_agendamiento, formData);
        showSuccess('Agendamiento actualizado correctamente');
      } else {
        await create(formData);
        showSuccess('Agendamiento creado correctamente');
      }
      setFormOpen(false);
    } catch (error) {
      showError('Error al guardar el agendamiento');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Gestión de Agendamientos"
        subtitle="Administra las citas y agendamientos del sistema"
        breadcrumbs={[
          { label: 'Agendamientos', path: '/dashboard/agendamientos' }
        ]}
        actions={[
          {
            label: 'Nuevo Agendamiento',
            icon: <AddIcon />,
            variant: 'contained',
            onClick: handleCreate,
          }
        ]}
      />

      <DataTable
        title="Lista de Agendamientos"
        data={agendamientos || []}
        columns={columns}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="No hay agendamientos registrados"
      />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        title={editData ? 'Editar Agendamiento' : 'Nuevo Agendamiento'}
        fields={formFields}
        initialData={editData}
        maxWidth="md"
      />
    </Box>
  );
};

export default DashboardAgendamientos;
