import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'descripcion', label: 'Descripción' }
];
const fields = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'descripcion', label: 'Descripción', required: true }
];

const DashboardPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/permiso')
      .then(res => res.json())
      .then(data => setPermisos(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/permiso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setPermisos([...permisos, nuevo]);
      setNombre(''); setDescripcion('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/permiso/${id}`, { method: 'DELETE' });
    setPermisos(permisos.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2>Permisos</h2>
      <CrudForm fields={fields} values={{ nombre, descripcion }} onChange={(k, v) => {
        if (k === 'nombre') setNombre(v);
        if (k === 'descripcion') setDescripcion(v);
      }} onSubmit={handleAdd} submitLabel="Agregar" />
      <CrudTable columns={columns} data={permisos} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardPermisos;
