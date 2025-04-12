const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener productos' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Producto no encontrado' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener producto' });
  }
};

const createProduct = async (req, res) => {
  try {
    const productId = await Product.create(req.body);
    res.status(201).send({ id: productId });
  } catch (error) {
    res.status(400).send({ error: 'Error al crear producto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = await Product.update(req.params.id, req.body);
    res.send({ id: productId });
  } catch (error) {
    res.status(400).send({ error: 'Error al actualizar producto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
