import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'telefono', label: 'Teléfono' }
];
const fields = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'telefono', label: 'Teléfono', required: true }
];

const DashboardClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/cliente')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setClientes([...clientes, nuevo]);
      setNombre(''); setTelefono('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/cliente/${id}`, { method: 'DELETE' });
    setClientes(clientes.filter(c => c._id !== id));
  };

  return (
    <div>
      <h2>Clientes</h2>
      <CrudForm fields={fields} values={{ nombre, telefono }} onChange={(k, v) => {
        if (k === 'nombre') setNombre(v);
        if (k === 'telefono') setTelefono(v);
      }} onSubmit={handleAdd} submitLabel="Agregar" />
      <CrudTable columns={columns} data={clientes} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardClientes;
