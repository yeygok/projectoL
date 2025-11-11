import React, { useState } from 'react';
import { Chip, Box, Rating, Typography } from '@mui/material';
import {
  Star as StarIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables y hooks
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { calificacionService } from '../services/apiService';
import { useCrud } from '../hooks';

const DashboardCalificaciones = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // CRUD operations usando el hook personalizado
  const crudOperations = useCrud(calificacionService);

  // Helper para calcular promedio de calificaciones
  const getPromedioCalificacion = (item) => {
    const suma = (item.puntuacion_servicio || 0) + 
                 (item.puntuacion_tecnico || 0) + 
                 (item.puntuacion_puntualidad || 0);
    return (suma / 3).toFixed(1);
  };

  // Helper para color según calificación
  const getCalificacionColor = (puntuacion) => {
    if (puntuacion >= 4.5) return 'success';
    if (puntuacion >= 3.5) return 'info';
    if (puntuacion >= 2.5) return 'warning';
    return 'error';
  };

  // Configuración de columnas de la tabla
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      align: 'center',
    },
    {
      field: 'reserva_id',
      headerName: 'Reserva',
      width: 90,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={`#${params.value}`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      ),
    },
    {
      field: 'cliente_nombre',
      headerName: 'Cliente',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.row.cliente_nombre || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'promedio',
      headerName: 'Calificación General',
      width: 200,
      align: 'center',
      renderCell: (params) => {
        const promedio = parseFloat(getPromedioCalificacion(params.row));
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Rating value={promedio} precision={0.1} size="small" readOnly />
            <Chip 
              label={`${promedio} / 5.0`}
              size="small"
              color={getCalificacionColor(promedio)}
            />
          </Box>
        );
      },
    },
    {
      field: 'puntuacion_servicio',
      headerName: 'Servicio',
      width: 110,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <BuildIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || 0}</Typography>
          <StarIcon fontSize="small" sx={{ color: 'gold' }} />
        </Box>
      ),
    },
    {
      field: 'puntuacion_tecnico',
      headerName: 'Técnico',
      width: 110,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || 0}</Typography>
          <StarIcon fontSize="small" sx={{ color: 'gold' }} />
        </Box>
      ),
    },
    {
      field: 'puntuacion_puntualidad',
      headerName: 'Puntualidad',
      width: 130,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || 0}</Typography>
          <StarIcon fontSize="small" sx={{ color: 'gold' }} />
        </Box>
      ),
    },
    {
      field: 'comentarios',
      headerName: 'Comentarios',
      width: 250,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontStyle: params.value ? 'normal' : 'italic',
            color: params.value ? 'text.primary' : 'text.secondary'
          }}
        >
          {params.value || 'Sin comentarios'}
        </Typography>
      ),
    },
    {
      field: 'fecha_calificacion',
      headerName: 'Fecha',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <EventIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.value ? new Date(params.value).toLocaleDateString('es-CO') : 'N/A'}
          </Typography>
        </Box>
      ),
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'reserva_id',
      label: 'ID de Reserva',
      type: 'number',
      required: true,
      helperText: 'Número de reserva a calificar',
    },
    {
      name: 'puntuacion_servicio',
      label: 'Calificación del Servicio',
      type: 'number',
      required: true,
      inputProps: { min: 1, max: 5, step: 0.1 },
      helperText: 'Calificación de 1 a 5 estrellas',
    },
    {
      name: 'puntuacion_tecnico',
      label: 'Calificación del Técnico',
      type: 'number',
      required: true,
      inputProps: { min: 1, max: 5, step: 0.1 },
      helperText: 'Calificación de 1 a 5 estrellas',
    },
    {
      name: 'puntuacion_puntualidad',
      label: 'Calificación de Puntualidad',
      type: 'number',
      required: true,
      inputProps: { min: 1, max: 5, step: 0.1 },
      helperText: 'Calificación de 1 a 5 estrellas',
    },
    {
      name: 'comentarios',
      label: 'Comentarios',
      type: 'text',
      multiline: true,
      rows: 4,
      required: false,
      helperText: 'Comentarios adicionales sobre el servicio (opcional)',
    },
  ];

  // Handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar la calificación #${item.id}?`)) {
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
        title="Calificaciones"
        subtitle="Gestiona las calificaciones de servicios realizados"
        icon={<StarIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={crudOperations.refetch}
        loading={crudOperations.loading}
        addButtonText="Nueva Calificación"
      />

      <DataTable
        data={crudOperations.data}
        columns={columns}
        loading={crudOperations.loading}
        error={crudOperations.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay calificaciones registradas"
        title="Lista de Calificaciones"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        title={selectedItem ? 'Editar Calificación' : 'Nueva Calificación'}
        fields={formFields}
        initialData={selectedItem}
        maxWidth="sm"
      />
    </NotificationProvider>
  );
};

export default DashboardCalificaciones;
