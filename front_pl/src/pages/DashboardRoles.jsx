import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const columns = [
  { key: 'nombre', label: 'Nombre' }
];
const fields = [
  { key: 'nombre', label: 'Nombre', required: true }
];

const DashboardRoles = () => {
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/rol')
      .then(res => res.json())
      .then(data => setRoles(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/rol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setRoles([...roles, nuevo]);
      setNombre('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/rol/${id}`, { method: 'DELETE' });
    setRoles(roles.filter(r => r._id !== id));
  };

  return (
    <div>
      <h2>Roles</h2>
      <CrudForm fields={fields} values={{ nombre }} onChange={(k, v) => setNombre(v)} onSubmit={handleAdd} submitLabel="Agregar" />
      <CrudTable columns={columns} data={roles} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardRoles;
