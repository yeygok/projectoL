import React, { useState } from 'react';
import CrudModule from './CrudModule';

const tableConfigs = {
  users: {
    title: 'Usuarios',
    apiUrl: 'http://localhost:3000/api/users',
    fields: [
      { name: 'username', label: 'Usuario', required: true },
      { name: 'email', label: 'Correo', required: true },
      { name: 'password', label: 'Contraseña', required: true, type: 'password' },
      { name: 'perfil_id', label: 'ID Perfil', required: true, type: 'number' },
    ],
  },
  perfiles: {
    title: 'Perfiles',
    apiUrl: 'http://localhost:3000/api/perfiles',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'descripcion', label: 'Descripción' },
      { name: 'documento', label: 'Documento', required: true },
    ],
  },
  products: {
    title: 'Productos',
    apiUrl: 'http://localhost:3000/api/products',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'descripcion', label: 'Descripción' },
      { name: 'precio', label: 'Precio', required: true, type: 'number' },
      { name: 'imagen_url', label: 'URL Imagen' },
    ],
  },
  services: {
    title: 'Servicios',
    apiUrl: 'http://localhost:3000/api/services',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'descripcion', label: 'Descripción' },
      { name: 'precio', label: 'Precio', required: true, type: 'number' },
    ],
  },
  cliente: {
    title: 'Clientes',
    apiUrl: 'http://localhost:3000/api/cliente',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'telefono', label: 'Teléfono' },
      { name: 'email', label: 'Correo' },
    ],
  },
  direccion: {
    title: 'Direcciones',
    apiUrl: 'http://localhost:3000/api/direccion',
    fields: [
      { name: 'cliente_id', label: 'ID Cliente', required: true, type: 'number' },
      { name: 'calle', label: 'Calle', required: true },
      { name: 'ciudad', label: 'Ciudad' },
      { name: 'codigo_postal', label: 'Código Postal' },
    ],
  },
  agendamiento: {
    title: 'Agendamientos',
    apiUrl: 'http://localhost:3000/api/agendamiento',
    fields: [
      { name: 'fecha', label: 'Fecha', required: true, type: 'date' },
      { name: 'hora', label: 'Hora', required: true, type: 'time' },
      { name: 'descripcion', label: 'Descripción' },
      { name: 'direccion_servicio', label: 'Dirección Servicio', required: true },
      { name: 'cliente_id', label: 'ID Cliente', required: true, type: 'number' },
      { name: 'estado_orden_id', label: 'ID Estado Orden', required: true, type: 'number' },
    ],
  },
};

const CrudContainer = () => {
  const [selectedTable, setSelectedTable] = useState('users');

  const config = tableConfigs[selectedTable];

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Módulo CRUD Unificado</h1>
      <div style={{ marginBottom: '1rem' }}>
        {Object.keys(tableConfigs).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedTable(key)}
            style={{
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: selectedTable === key ? '#007bff' : '#ccc',
              color: selectedTable === key ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {tableConfigs[key].title}
          </button>
        ))}
      </div>
      <CrudModule title={config.title} apiUrl={config.apiUrl} fields={config.fields} />
    </div>
  );
};

export default CrudContainer;
