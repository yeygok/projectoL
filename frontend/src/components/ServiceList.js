import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/services');
      setServices(response.data);
    } catch (err) {
      setError('Error al obtener servicios');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div>
      <h2>Lista de Servicios</h2>
      {error && <p>{error}</p>}
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <h3>{service.nombre}</h3>
            <p>{service.descripcion}</p>
            <p>Precio: ${service.precio}</p>
            <p>Duración: {service.duracion} minutos</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
