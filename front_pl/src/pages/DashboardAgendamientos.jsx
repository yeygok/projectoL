import React, { useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import '../styles/Crud.css';

const DashboardAgendamientos = () => {
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState('');
  const [cliente, setCliente] = useState('');
  const [servicio, setServicio] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/agendamiento')
      .then(res => res.json())
      .then(data => setCitas(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/agendamiento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha, cliente, servicio })
    });
    if (res.ok) {
      const nueva = await res.json();
      setCitas([...citas, nueva]);
      setFecha(''); setCliente(''); setServicio('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/agendamiento/${id}`, { method: 'DELETE' });
    setCitas(citas.filter(c => c._id !== id));
  };

  const columns = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'servicio', label: 'Servicio' }
  ];
  const fields = [
    { key: 'fecha', label: 'Fecha', type: 'datetime-local', required: true },
    { key: 'cliente', label: 'Cliente', required: true },
    { key: 'servicio', label: 'Servicio', required: true }
  ];

  return (
    <div>
      <h2>Agendamientos</h2>
      <CrudForm fields={fields} values={{ fecha, cliente, servicio }} onChange={(k, v) => {
        if (k === 'fecha') setFecha(v);
        if (k === 'cliente') setCliente(v);
        if (k === 'servicio') setServicio(v);
      }} onSubmit={handleAdd} submitLabel="Agendar" />
      <CrudTable columns={columns} data={citas} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardAgendamientos;
