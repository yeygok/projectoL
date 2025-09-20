import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const DashboardProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/product')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setProductos([...productos, nuevo]);
      setNombre(''); setPrecio('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/product/${id}`, { method: 'DELETE' });
    setProductos(productos.filter(p => p._id !== id));
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'precio', label: 'Precio' }
  ];
  const fields = [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'precio', label: 'Precio', type: 'number', required: true }
  ];

  return (
    <div>
      <h2>Productos</h2>
      <CrudForm fields={fields} values={{ nombre, precio }} onChange={(k, v) => {
        if (k === 'nombre') setNombre(v);
        if (k === 'precio') setPrecio(v);
      }} onSubmit={handleAdd} submitLabel="Agregar" />
      <CrudTable columns={columns} data={productos} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardProductos;
