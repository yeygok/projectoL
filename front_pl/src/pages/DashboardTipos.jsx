import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'categoria', label: 'Categoría' }
];
const fields = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'categoria', label: 'Categoría', required: true }
];

const DashboardTipos = () => {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/tipo_servicio')
      .then(res => res.json())
      .then(data => setTipos(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/tipo_servicio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, categoria })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setTipos([...tipos, nuevo]);
      setNombre(''); setCategoria('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/tipo_servicio/${id}`, { method: 'DELETE' });
    setTipos(tipos.filter(t => t._id !== id));
  };

  return (
    <div>
      <h2>Tipos</h2>
      <CrudForm fields={fields} values={{ nombre, categoria }} onChange={(k, v) => {
        if (k === 'nombre') setNombre(v);
        if (k === 'categoria') setCategoria(v);
      }} onSubmit={handleAdd} submitLabel="Agregar" />
      <CrudTable columns={columns} data={tipos} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardTipos;
