import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './Dashboard.css';
import DashboardUsuarios from './DashboardUsuarios';
import DashboardProductos from './DashboardProductos';
import DashboardServicios from './DashboardServicios';
import DashboardAgendamientos from './DashboardAgendamientos';
import DashboardClientes from './DashboardClientes';
import DashboardRoles from './DashboardRoles';
import DashboardPermisos from './DashboardPermisos';
import DashboardTipos from './DashboardTipos';
import DashboardPerfil from './DashboardPerfil';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Panel de Administración</h1>
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/dashboard/usuarios">Usuarios</Link></li>
          <li><Link to="/dashboard/clientes">Clientes</Link></li>
          <li><Link to="/dashboard/productos">Productos</Link></li>
          <li><Link to="/dashboard/servicios">Servicios</Link></li>
          <li><Link to="/dashboard/agendamientos">Citas/Agendamientos</Link></li>
          <li><Link to="/dashboard/roles">Roles</Link></li>
          <li><Link to="/dashboard/permisos">Permisos</Link></li>
          <li><Link to="/dashboard/tipos">Tipos</Link></li>
          <li><Link to="/dashboard/perfil">Perfil</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <Routes>
          <Route path="usuarios" element={<DashboardUsuarios />} />
          <Route path="clientes" element={<DashboardClientes />} />
          <Route path="productos" element={<DashboardProductos />} />
          <Route path="servicios" element={<DashboardServicios />} />
          <Route path="agendamientos" element={<DashboardAgendamientos />} />
          <Route path="roles" element={<DashboardRoles />} />
          <Route path="permisos" element={<DashboardPermisos />} />
          <Route path="tipos" element={<DashboardTipos />} />
          <Route path="perfil" element={<DashboardPerfil />} />
          <Route path="*" element={<p>Selecciona una sección para administrar.</p>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
