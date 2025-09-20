import React from 'react';
import '../styles/Home.css';

const Home = () => (
  <>
    <section className="mega-hero">
      <div className="mega-hero-content">
        <h1><span className="highlight">Mega Lavados</span></h1>
        <h2>¡Agenda tu lavado a vapor y compra productos premium!</h2>
        <p>
          Vive la experiencia de limpieza ecológica, rápida y profesional para tu auto, hogar o negocio.<br/>
          Descubre nuestros servicios de lavado a vapor y productos exclusivos para el cuidado y desinfección.
        </p>
        <a href="/login" className="mega-btn">Agendar Servicio</a>
        <a href="/productos" className="mega-btn secondary">Ver Productos</a>
      </div>
      <div className="mega-hero-img">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Lavado a vapor" />
      </div>
    </section>
    
    {/* Sección de beneficios */}
    <section className="mega-benefits">
      <h3>¿Por qué elegir Mega Lavados?</h3>
      <div className="benefits-list">
        <div className="benefit-card">
          <span role="img" aria-label="eco">🌱</span>
          <h4>Ecológico</h4>
          <p>Lavado a vapor que ahorra hasta 90% de agua y elimina bacterias sin químicos agresivos.</p>
        </div>
        <div className="benefit-card">
          <span role="img" aria-label="calidad">✨</span>
          <h4>Calidad Premium</h4>
          <p>Productos y servicios de alta gama para el mejor cuidado de tu vehículo y espacios.</p>
        </div>
        <div className="benefit-card">
          <span role="img" aria-label="agendar">📅</span>
          <h4>Agenda Fácil</h4>
          <p>Reserva tu servicio en línea en segundos y recibe atención personalizada.</p>
        </div>
      </div>
    </section>

    {/* Sección de llamada a la acción */}
    <section className="mega-cta">
      <h2>¡Transforma tu limpieza con Mega Lavados!</h2>
      <a href="/login" className="mega-btn big">Agendar Ahora</a>
    </section>
  </>
);

export default Home;
