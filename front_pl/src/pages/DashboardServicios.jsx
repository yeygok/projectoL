import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const DashboardServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/service')
      .then(res => res.json())
      .then(data => setServicios(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setServicios([...servicios, nuevo]);
      setNombre(''); setDescripcion('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/service/${id}`, { method: 'DELETE' });
    setServicios(servicios.filter(s => s._id !== id));
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' }
  ];
  const fields = [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'descripcion', label: 'Descripción', required: true }
  ];

  return (
    <div>
      <h2>Servicios</h2>
      <CrudForm fields={fields} values={{ nombre, descripcion }} onChange={(k, v) => {
        if (k === 'nombre') setNombre(v);
        if (k === 'descripcion') setDescripcion(v);
      }} onSubmit={handleAdd} submitLabel="Agregar" />
      <CrudTable columns={columns} data={servicios} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardServicios;
