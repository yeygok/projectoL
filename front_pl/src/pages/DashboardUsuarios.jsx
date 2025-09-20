import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const DashboardUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' }
  ];
  const fields = [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'password', label: 'Contraseña', type: 'password', required: true }
  ];

  useEffect(() => {
    fetch('http://localhost:3000/api/user')
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  const handleAdd = async (data) => {
    const { nombre, email, password } = data;
    const res = await fetch('http://localhost:3000/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setUsuarios([...usuarios, nuevo]);
      setNombre(''); setEmail(''); setPassword('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/user/${id}`, { method: 'DELETE' });
    setUsuarios(usuarios.filter(u => u._id !== id));
  };

  return (
    <div>
      <h2>Usuarios</h2>
      <CrudForm fields={fields} values={{ nombre, email, password }} onChange={(k, v) => {
        if (k === 'nombre') setNombre(v);
        if (k === 'email') setEmail(v);
        if (k === 'password') setPassword(v);
      }} onSubmit={handleAdd} submitLabel="Agregar" />
      <CrudTable columns={columns} data={usuarios} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardUsuarios;
