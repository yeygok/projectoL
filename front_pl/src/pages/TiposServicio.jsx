import React from 'react';
import '../styles/TiposServicio.css';

const servicios = [
  {
    nombre: 'Sencillo',
    descripcion: 'Lavado a vapor básico para limpieza rápida y eficiente.',
    icono: '💧',
    tipos: ['Carros', 'Colchones', 'Cortinas', 'Tapetes'],
  },
  {
    nombre: 'Gold',
    descripcion: 'Incluye limpieza profunda, desinfección y aromatización.',
    icono: '🥇',
    tipos: ['Carros', 'Colchones', 'Cortinas', 'Tapetes'],
  },
  {
    nombre: 'Premium',
    descripcion: 'Servicio completo con productos premium y atención personalizada.',
    icono: '👑',
    tipos: ['Carros', 'Colchones', 'Cortinas', 'Tapetes'],
  },
];

const TiposServicio = () => (
  <section className="servicios-page">
    <h2>Tipos de Servicio de Lavado a Vapor</h2>
    <div className="servicios-list">
      {servicios.map((serv, idx) => (
        <div className="servicio-card" key={idx}>
          <span className="servicio-icono">{serv.icono}</span>
          <h3>{serv.nombre}</h3>
          <p>{serv.descripcion}</p>
          <ul className="servicio-tipos">
            {serv.tipos.map((tipo, i) => (
              <li key={i}>{tipo}</li>
            ))}
          </ul>
          <button className="mega-btn">Agendar</button>
        </div>
      ))}
    </div>
  </section>
);

export default TiposServicio;
