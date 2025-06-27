import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-logo">Mega Lavados</div>
    <ul className="navbar-links">
      <li><Link to="/">Inicio</Link></li>
      <li><Link to="/productos">Productos</Link></li>
      <li><Link to="/tipos-servicio">Tipos de Servicio</Link></li>
      <li><Link to="/agendar">Agendar</Link></li>
      <li><Link to="/citas">Mis Citas</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  </nav>
);

export default Navbar;
