import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgendarCita = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    descripcion: '',
    direccion_servicio: '',
    cliente_id: '',
    estado_orden_id: '',
  });
  const [agendamientos, setAgendamientos] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchAgendamientos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/agendamiento', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamientos(response.data);
    } catch (err) {
      setError('Error al cargar agendamientos');
    }
  };

  useEffect(() => {
    fetchAgendamientos();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`http://localhost:3000/api/agendamiento/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/api/agendamiento', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        fecha: '',
        hora: '',
        descripcion: '',
        direccion_servicio: '',
        cliente_id: '',
        estado_orden_id: '',
      });
      setEditingId(null);
      fetchAgendamientos();
    } catch (err) {
      setError('Error al guardar agendamiento');
    }
  };

  const handleEdit = (agendamiento) => {
    setFormData({
      fecha: agendamiento.fecha,
      hora: agendamiento.hora,
      descripcion: agendamiento.descripcion || '',
      direccion_servicio: agendamiento.direccion_servicio,
      cliente_id: agendamiento.cliente_id,
      estado_orden_id: agendamiento.estado_orden_id,
    });
    setEditingId(agendamiento.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/agendamiento/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAgendamientos();
    } catch (err) {
      setError('Error al eliminar agendamiento');
    }
  };

  return (
    <div className="agendar-cita-container">
      <h2>Agendar Cita</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="agendar-cita-form">
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
        <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} />
        <input type="text" name="direccion_servicio" placeholder="Dirección del servicio" value={formData.direccion_servicio} onChange={handleChange} required />
        <input type="number" name="cliente_id" placeholder="ID Cliente" value={formData.cliente_id} onChange={handleChange} required />
        <input type="number" name="estado_orden_id" placeholder="ID Estado Orden" value={formData.estado_orden_id} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ fecha: '', hora: '', descripcion: '', direccion_servicio: '', cliente_id: '', estado_orden_id: '' }); }}>Cancelar</button>}
      </form>
      <table className="agendar-cita-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Descripción</th>
            <th>Dirección</th>
            <th>Cliente ID</th>
            <th>Estado Orden ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {agendamientos.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.fecha}</td>
              <td>{a.hora}</td>
              <td>{a.descripcion}</td>
              <td>{a.direccion_servicio}</td>
              <td>{a.cliente_id}</td>
              <td>{a.estado_orden_id}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Editar</button>
                <button onClick={() => handleDelete(a.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .agendar-cita-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 1rem;
        }
        .agendar-cita-form {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .agendar-cita-form input {
          flex: 1 1 150px;
          padding: 0.5rem;
          font-size: 1rem;
        }
        .agendar-cita-form button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
        }
        .agendar-cita-table {
          width: 100%;
          border-collapse: collapse;
        }
        .agendar-cita-table th,
        .agendar-cita-table td {
          border: 1px solid #ccc;
          padding: 0.5rem;
          text-align: left;
        }
        @media (max-width: 600px) {
          .agendar-cita-form {
            flex-direction: column;
          }
          .agendar-cita-form input {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AgendarCita;
