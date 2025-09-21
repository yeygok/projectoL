import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './Dashboard.css';
import DashboardHome from './DashboardHome';
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
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar autenticación y obtener datos del usuario
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      // Redirigir al login si no está autenticado
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const menuItems = [
    { 
      path: '/dashboard', 
      name: 'Inicio', 
      icon: '🏠',
      description: 'Vista general y estadísticas'
    },
    { 
      path: '/dashboard/agendamientos', 
      name: 'Citas', 
      icon: '📅',
      description: 'Gestionar reservas y citas'
    },
    { 
      path: '/dashboard/clientes', 
      name: 'Clientes', 
      icon: '👥',
      description: 'Administrar clientes'
    },
    { 
      path: '/dashboard/servicios', 
      name: 'Servicios', 
      icon: '🚗',
      description: 'Gestionar servicios'
    },
    { 
      path: '/dashboard/usuarios', 
      name: 'Usuarios', 
      icon: '👤',
      description: 'Administrar usuarios del sistema'
    },
    { 
      path: '/dashboard/roles', 
      name: 'Roles', 
      icon: '🔐',
      description: 'Gestionar roles y permisos'
    },
    { 
      path: '/dashboard/tipos', 
      name: 'Configuración', 
      icon: '⚙️',
      description: 'Tipos de servicios y configuración'
    },
    { 
      path: '/dashboard/perfil', 
      name: 'Mi Perfil', 
      icon: '👨‍💼',
      description: 'Configuración de perfil'
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Verificar si el usuario está autenticado
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-dashboard">
      {/* Overlay para mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚗💨</span>
            <h2>Admin Panel</h2>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <div className="nav-text">
                    <span className="nav-name">{item.name}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.nombre || 'Administrador'}</span>
              <span className="user-role">{user?.rol_nombre || 'Admin'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className="header-title">
            <h1>Panel de Administración</h1>
            <p>Lavado Vapor Bogotá</p>
          </div>
          
          <div className="header-actions">
            <button className="btn-notification">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <div className="header-user">
              <span>Hola, {user?.nombre || 'Admin'}</span>
              <button className="btn-logout" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="usuarios" element={<DashboardUsuarios />} />
            <Route path="clientes" element={<DashboardClientes />} />
            <Route path="servicios" element={<DashboardServicios />} />
            <Route path="agendamientos" element={<DashboardAgendamientos />} />
            <Route path="roles" element={<DashboardRoles />} />
            <Route path="permisos" element={<DashboardPermisos />} />
            <Route path="tipos" element={<DashboardTipos />} />
            <Route path="perfil" element={<DashboardPerfil />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
