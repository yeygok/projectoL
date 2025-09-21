import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';

// Componentes comunes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Productos from './pages/Productos';
import TiposServicio from './pages/TiposServicio';
import Login from './pages/Login';
import Agendar from './pages/Agendar';
import Citas from './pages/Citas';
import Dashboard from './pages/Dashboard';

// Estilos (mantenemos por compatibilidad)
import './App.css';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/tipos-servicio" element={<TiposServicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/agendar" element={<Agendar />} />
              <Route path="/citas" element={<Citas />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
