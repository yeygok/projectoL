const pool = require('../config/db');

const getAllTipoServicioProductos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_servicio_producto');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_servicio_producto' });
  }
};

const getTipoServicioProductoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_servicio_producto WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Tipo_servicio_producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_servicio_producto' });
  }
};

const createTipoServicioProducto = async (req, res) => {
  const { tipo_servicio_id, producto_id } = req.body;
  if (!tipo_servicio_id || !producto_id) return res.status(400).json({ error: 'Campos requeridos: tipo_servicio_id, producto_id' });
  try {
    const [result] = await pool.query('INSERT INTO tipo_servicio_producto (tipo_servicio_id, producto_id) VALUES (?, ?)', [tipo_servicio_id, producto_id]);
    res.status(201).json({ id: result.insertId, tipo_servicio_id, producto_id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tipo_servicio_producto' });
  }
};

const updateTipoServicioProducto = async (req, res) => {
  const { tipo_servicio_id, producto_id } = req.body;
  if (!tipo_servicio_id || !producto_id) return res.status(400).json({ error: 'Campos requeridos: tipo_servicio_id, producto_id' });
  try {
    const [result] = await pool.query('UPDATE tipo_servicio_producto SET tipo_servicio_id = ?, producto_id = ? WHERE id = ?', [tipo_servicio_id, producto_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_servicio_producto no encontrado' });
    res.json({ id: req.params.id, tipo_servicio_id, producto_id });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tipo_servicio_producto' });
  }
};

const deleteTipoServicioProducto = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM tipo_servicio_producto WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_servicio_producto no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tipo_servicio_producto' });
  }
};

module.exports = {
  getAllTipoServicioProductos,
  getTipoServicioProductoById,
  createTipoServicioProducto,
  updateTipoServicioProducto,
  deleteTipoServicioProducto,
};
