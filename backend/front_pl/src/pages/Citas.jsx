import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Agendar.css';

const Citas = () => {
  const { user, token } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch('http://localhost:3001/api/agendamiento/mis-citas', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCitas(data);
        else setError(data.message || 'No se pudieron cargar las citas.');
        setLoading(false);
      })
      .catch(() => {
        setError('Error de red o servidor.');
        setLoading(false);
      });
  }, [user, token]);

  if (!user) return <div className="agendar-protegido">Debes iniciar sesión para ver tus citas.</div>;

  return (
    <section className="agendar-page">
      <h2>Mis Citas Agendadas</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className="agendar-error">{error}</div>}
      {!loading && !error && (
        <div className="citas-list">
          {citas.length === 0 ? (
            <div>No tienes citas agendadas.</div>
          ) : (
            <table className="citas-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Objeto</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Costo</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita, idx) => (
                  <tr key={idx}>
                    <td>{cita.servicio}</td>
                    <td>{cita.objeto}</td>
                    <td>{cita.fecha}</td>
                    <td>{cita.hora}</td>
                    <td>${cita.costo?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
};

export default Citas;
