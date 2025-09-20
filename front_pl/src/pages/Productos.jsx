import React from 'react';
import '../styles/Productos.css';

const productos = [
  {
    nombre: 'Desinfectante Premium',
    descripcion: 'Elimina el 99.9% de bacterias. Ideal para autos y superficies.',
    precio: '$12.000',
    imagen: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
  {
    nombre: 'Aromatizante Ecológico',
    descripcion: 'Fragancia duradera y natural para tu vehículo.',
    precio: '$8.500',
    imagen: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
  },
  {
    nombre: 'Kit Microfibra',
    descripcion: 'Paños ultra suaves para limpieza sin rayas.',
    precio: '$15.000',
    imagen: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
];

const Productos = () => (
  <section className="productos-page">
    <h2>Productos Destacados</h2>
    <div className="productos-list">
      {productos.map((prod, idx) => (
        <div className="producto-card" key={idx}>
          <img src={prod.imagen} alt={prod.nombre} />
          <h3>{prod.nombre}</h3>
          <p>{prod.descripcion}</p>
          <span className="precio">{prod.precio}</span>
          <button className="mega-btn secondary">Comprar</button>
        </div>
      ))}
    </div>
  </section>
);

export default Productos;
