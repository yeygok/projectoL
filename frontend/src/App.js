import React, { useState, useEffect } from 'react';
import UserRegister from './components/UserRegister';
import UserLogin from './components/UserLogin';
import ProductList from './components/ProductList';
import ServiceList from './components/ServiceList';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <div className="auth-container">
          {showRegister ? (
            <>
              <UserRegister />
              <button 
                className="auth-toggle"
                onClick={() => setShowRegister(false)}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </>
          ) : (
            <>
              <UserLogin onLoginSuccess={handleLoginSuccess} />
              <button 
                className="auth-toggle"
                onClick={() => setShowRegister(true)}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="main-content">
          <header>
            <h1>Bienvenido, {user?.nombre}</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </header>
          <div className="content-grid">
            <ProductList />
            <ServiceList />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
