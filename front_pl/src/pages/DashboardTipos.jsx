import React, { useState } from 'react';
import { Avatar, Chip, Tabs, Tab, Box } from '@mui/material';
import {
  Category as CategoryIcon,
  Description as DocumentIcon,
  WorkOutline as ContractIcon,
  MiscellaneousServices as ServiceIcon,
} from '@mui/icons-material';

// Importar componentes reutilizables
import { DataTable, FormDialog, PageHeader, NotificationProvider } from '../components/common';
import { tipoDocumentoService, tipoServicioService } from '../services';
import { useCrud } from '../hooks';

const DashboardTipos = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  // CRUD operations para diferentes tipos
  const tipoDocumentoCrud = useCrud(tipoDocumentoService);
  const tipoServicioCrud = useCrud(tipoServicioService);

  // Configuración de tabs
  const tabs = [
    {
      headerName: 'Tipos de Documento',
      icon: <DocumentIcon />,
      crud: tipoDocumentoCrud,
      service: 'tipoDocumento'
    },
    {
      headerName: 'Tipos de Servicio',
      icon: <ServiceIcon />,
      crud: tipoServicioCrud,
      service: 'tipoServicio'
    }
  ];

  const currentCrud = tabs[currentTab].crud;
  const currentService = tabs[currentTab].service;

  // Configuraciones específicas por tipo
  const getColumns = () => {
    if (currentService === 'tipoDocumento') {
      return [
        {
          field: 'tipo',
          headerName: 'Tipo de Documento',
          render: (item) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <DocumentIcon />
              </Avatar>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {item.nombre_tipo_documento}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  ID: {item.id_tipo_documento}
                </div>
              </div>
            </div>
          )
        },
        {
          field: 'descripcion',
          headerName: 'Descripción',
          render: (item) => (
            <div style={{ maxWidth: 250 }}>
              {item.descripcion || 'Sin descripción'}
            </div>
          )
        },
        {
          field: 'activo',
          headerName: 'Estado',
          render: (item) => (
            <Chip
              label={item.activo ? 'Activo' : 'Inactivo'}
              color={item.activo ? 'success' : 'error'}
              size="small"
            />
          )
        }
      ];
    } else {
      return [
        {
          field: 'tipo',
          headerName: 'Tipo de Servicio',
          render: (item) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                <ServiceIcon />
              </Avatar>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {item.nombre_tipo_servicio}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  ID: {item.id_tipo_servicio}
                </div>
              </div>
            </div>
          )
        },
        {
          field: 'descripcion',
          headerName: 'Descripción',
          render: (item) => (
            <div style={{ maxWidth: 250 }}>
              {item.descripcion || 'Sin descripción'}
            </div>
          )
        },
        {
          field: 'precio',
          headerName: 'Precio Base',
          render: (item) => (
            <div style={{ fontWeight: 600, color: 'success.main' }}>
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
              }).format(item.precio_base || 0)}
            </div>
          )
        },
        {
          field: 'activo',
          headerName: 'Estado',
          render: (item) => (
            <Chip
              label={item.activo ? 'Activo' : 'Inactivo'}
              color={item.activo ? 'success' : 'error'}
              size="small"
            />
          )
        }
      ];
    }
  };

  const getFormFields = () => {
    if (currentService === 'tipoDocumento') {
      return [
        {
          name: 'nombre_tipo_documento',
          headerName: 'Nombre del Tipo',
          type: 'text',
          required: true,
          placeholder: 'Ej: Cédula, Pasaporte, NIT, etc.',
          gridProps: { xs: 12, md: 6 }
        },
        {
          name: 'descripcion',
          headerName: 'Descripción',
          type: 'textarea',
          rows: 3,
          placeholder: 'Descripción del tipo de documento...',
          gridProps: { xs: 12 }
        },
        {
          name: 'activo',
          headerName: 'Estado',
          type: 'select',
          required: true,
          options: [
            { value: true, headerName: 'Activo' },
            { value: false, headerName: 'Inactivo' }
          ],
          gridProps: { xs: 12, md: 6 }
        }
      ];
    } else {
      return [
        {
          name: 'nombre_tipo_servicio',
          headerName: 'Nombre del Tipo',
          type: 'text',
          required: true,
          placeholder: 'Ej: Sencillo, Premium, Gold',
          gridProps: { xs: 12, md: 6 }
        },
        {
          name: 'descripcion',
          headerName: 'Descripción',
          type: 'textarea',
          rows: 3,
          placeholder: 'Descripción del tipo de servicio...',
          gridProps: { xs: 12 }
        },
        {
          name: 'precio_base',
          headerName: 'Precio Base',
          type: 'number',
          min: 0,
          step: 1000,
          placeholder: 'Precio base del servicio',
          gridProps: { xs: 12, md: 6 }
        },
        {
          name: 'activo',
          headerName: 'Estado',
          type: 'select',
          required: true,
          options: [
            { value: true, headerName: 'Activo' },
            { value: false, headerName: 'Inactivo' }
          ],
          gridProps: { xs: 12, md: 6 }
        }
      ];
    }
  };

  const getDefaultValues = () => {
    if (currentService === 'tipoDocumento') {
      return {
        nombre_tipo_documento: '',
        descripcion: '',
        activo: true
      };
    } else {
      return {
        nombre_tipo_servicio: '',
        descripcion: '',
        precio_base: '',
        activo: true
      };
    }
  };

  const validateForm = (data) => {
    const errors = {};
    
    if (currentService === 'tipoDocumento') {
      if (!data.nombre_tipo_documento?.trim()) {
        errors.nombre_tipo_documento = 'El nombre del tipo es requerido';
      }
    } else {
      if (!data.nombre_tipo_servicio?.trim()) {
        errors.nombre_tipo_servicio = 'El nombre del tipo es requerido';
      }
    }

    if (data.activo === undefined || data.activo === '') {
      errors.activo = 'El estado es requerido';
    }

    return errors;
  };

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item) => {
    const name = currentService === 'tipoDocumento' 
      ? item.nombre_tipo_documento 
      : item.nombre_tipo_servicio;
    
    if (window.confirm(`¿Está seguro de eliminar "${name}"?`)) {
      try {
        const id = currentService === 'tipoDocumento' 
          ? item.id_tipo_documento 
          : item.id_tipo_servicio;
        await currentCrud.remove(id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        activo: formData.activo === true || formData.activo === 'true'
      };

      if (currentService === 'tipoServicio' && processedData.precio_base) {
        processedData.precio_base = parseFloat(processedData.precio_base);
      }

      if (selectedItem) {
        const id = currentService === 'tipoDocumento' 
          ? selectedItem.id_tipo_documento 
          : selectedItem.id_tipo_servicio;
        await currentCrud.update(id, processedData);
      } else {
        await currentCrud.create(processedData);
      }
      setDialogOpen(false);
      setSelectedItem(null);
      return true;
    } catch (error) {
      console.error('Error saving item:', error);
      return false;
    }
  };

  return (
    <NotificationProvider>
      <PageHeader
        title="Tipos y Configuraciones"
        subtitle="Gestionar tipos de documentos, servicios y configuraciones del sistema"
        icon={<CategoryIcon />}
        onAdd={() => setDialogOpen(true)}
        onRefresh={currentCrud.refetch}
        loading={currentCrud.loading}
        addButtonText={`Nuevo ${currentService === 'tipoDocumento' ? 'Tipo de Documento' : 'Tipo de Servicio'}`}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      <DataTable
        data={currentCrud.data}
        columns={getColumns()}
        loading={currentCrud.loading}
        error={currentCrud.error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage={`No hay ${tabs[currentTab].label.toLowerCase()} registrados`}
        title={tabs[currentTab].label}
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedItem(null);
        }}
        title={`${selectedItem ? 'Editar' : 'Nuevo'} ${tabs[currentTab].label.slice(0, -1)}`}
        fields={getFormFields()}
        defaultValues={selectedItem || getDefaultValues()}
        onSubmit={handleSubmit}
        validate={validateForm}
        loading={currentCrud.loading}
      />
    </NotificationProvider>
  );
};

export default DashboardTipos;
