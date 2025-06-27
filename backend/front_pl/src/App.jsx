import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Productos from './pages/Productos';
import TiposServicio from './pages/TiposServicio';
import Login from './pages/Login';
import Agendar from './pages/Agendar';
import Citas from './pages/Citas';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import './styles/global.css';

function App() {
  return (
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
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
