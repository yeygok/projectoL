// Componente mejorado para gestión CRUD de productos
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, ListGroup, Form, Modal, Alert } from 'react-bootstrap';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  });

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (err) {
      setError('Error al obtener productos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await axios.put(
          `http://localhost:3000/api/products/${currentProduct.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:3000/api/products',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchProducts();
      setShowModal(false);
    } catch (err) {
      setError('Error al guardar producto');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>
      <Button variant="primary" onClick={() => {
        setCurrentProduct(null);
        setFormData({ nombre: '', descripcion: '', precio: 0, stock: 0 });
        setShowModal(true);
      }}>
        Agregar Producto
      </Button>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      <div className="row mt-3">
        {products.map(product => (
          <div key={product.id} className="col-md-4 mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{product.nombre}</Card.Title>
                <Card.Text>{product.descripcion}</Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>Precio: ${product.precio}</ListGroup.Item>
                  <ListGroup.Item>Stock: {product.stock}</ListGroup.Item>
                </ListGroup>
                <div className="mt-2">
                  <Button 
                    variant="warning" 
                    onClick={() => {
                      setCurrentProduct(product);
                      setFormData({
                        nombre: product.nombre,
                        descripcion: product.descripcion,
                        precio: product.precio,
                        stock: product.stock
                      });
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    className="ms-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductList;
