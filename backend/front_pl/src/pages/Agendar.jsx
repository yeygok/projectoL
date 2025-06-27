import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Agendar.css';

const servicios = [
  { nombre: 'Sencillo', precio: 25000 },
  { nombre: 'Gold', precio: 40000 },
  { nombre: 'Premium', precio: 60000 },
];
const objetos = ['Carro', 'Colchón', 'Cortina', 'Tapete'];

const Agendar = () => {
  const { user, token } = useContext(AuthContext);
  const [servicio, setServicio] = useState(servicios[0].nombre);
  const [objeto, setObjeto] = useState(objetos[0]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const getPrecio = () => servicios.find(s => s.nombre === servicio)?.precio || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (!fecha || !hora) {
      setError('Selecciona fecha y hora.');
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch('http://localhost:3001/api/agendamiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          servicio,
          objeto,
          fecha,
          hora,
          costo: getPrecio(),
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('¡Cita agendada con éxito! Revisa tu correo para la confirmación.');
      } else {
        setError(data.message || 'Error al agendar.');
      }
    } catch (err) {
      setError('Error de red o servidor.');
    }
    setEnviando(false);
  };

  if (!user) {
    return <div className="agendar-protegido">Debes iniciar sesión para agendar un servicio.</div>;
  }

  return (
    <section className="agendar-page">
      <h2>Agendar Servicio de Lavado a Vapor</h2>
      <form className="agendar-form" onSubmit={handleSubmit} autoComplete="off">
        <label>Tipo de servicio</label>
        <select value={servicio} onChange={e => setServicio(e.target.value)}>
          {servicios.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
        </select>
        <label>¿Qué deseas lavar?</label>
        <select value={objeto} onChange={e => setObjeto(e.target.value)}>
          {objetos.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <label>Fecha</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
        <label>Hora</label>
        <input type="time" value={hora} onChange={e => setHora(e.target.value)} required />
        <div className="agendar-costo">Costo: <b>${getPrecio().toLocaleString()}</b></div>
        {error && <div className="agendar-error">{error}</div>}
        {mensaje && <div className="agendar-mensaje">{mensaje}</div>}
        <button className="mega-btn big" type="submit" disabled={enviando}>{enviando ? 'Agendando...' : 'Agendar'}</button>
      </form>
    </section>
  );
};

export default Agendar;
