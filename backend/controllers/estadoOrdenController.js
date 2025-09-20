const pool = require('../config/db');

const getAllEstadoOrdenes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estado_orden');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estado_orden' });
  }
};

const getEstadoOrdenById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estado_orden WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Estado_orden no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estado_orden' });
  }
};

const createEstadoOrden = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('INSERT INTO estado_orden (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id: result.insertId, nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear estado_orden' });
  }
};

const updateEstadoOrden = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('UPDATE estado_orden SET nombre = ? WHERE id = ?', [nombre, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado_orden no encontrado' });
    res.json({ id: req.params.id, nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado_orden' });
  }
};

const deleteEstadoOrden = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM estado_orden WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado_orden no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar estado_orden' });
  }
};

module.exports = {
  getAllEstadoOrdenes,
  getEstadoOrdenById,
  createEstadoOrden,
  updateEstadoOrden,
  deleteEstadoOrden,
};
