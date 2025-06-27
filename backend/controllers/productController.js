const pool = require('../config/db');

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM producto WHERE activo = 1');
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM producto WHERE id = ? AND activo = 1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

const createProduct = async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, marca_id } = req.body;
  if (!nombre || !descripcion || !precio_unitario || !stock || !marca_id) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, descripcion, precio_unitario, stock, marca_id' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO producto (nombre, descripcion, precio_unitario, stock, marca_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio_unitario, stock, marca_id]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion, precio_unitario, stock, marca_id });
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

const updateProduct = async (req, res) => {
  const { nombre, descripcion, precio_unitario, stock, marca_id } = req.body;
  if (!nombre || !descripcion || !precio_unitario || !stock || !marca_id) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, descripcion, precio_unitario, stock, marca_id' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE producto SET nombre = ?, descripcion = ?, precio_unitario = ?, stock = ?, marca_id = ? WHERE id = ?',
      [nombre, descripcion, precio_unitario, stock, marca_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ id: req.params.id, nombre, descripcion, precio_unitario, stock, marca_id });
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM producto WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
