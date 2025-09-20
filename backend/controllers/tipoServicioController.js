const pool = require('../config/db');

const getAllTipoServicios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_servicio');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_servicio' });
  }
};

const getTipoServicioById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_servicio WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Tipo_servicio no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_servicio' });
  }
};

const createTipoServicio = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('INSERT INTO tipo_servicio (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tipo_servicio' });
  }
};

const updateTipoServicio = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('UPDATE tipo_servicio SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion || null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_servicio no encontrado' });
    res.json({ id: req.params.id, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tipo_servicio' });
  }
};

const deleteTipoServicio = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM tipo_servicio WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_servicio no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tipo_servicio' });
  }
};

module.exports = {
  getAllTipoServicios,
  getTipoServicioById,
  createTipoServicio,
  updateTipoServicio,
  deleteTipoServicio,
};
