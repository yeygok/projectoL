const pool = require('../config/db');

const getAllEstadoUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estado_usuario');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estado_usuario' });
  }
};

const getEstadoUsuarioById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estado_usuario WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Estado_usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estado_usuario' });
  }
};

const createEstadoUsuario = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('INSERT INTO estado_usuario (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id: result.insertId, nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear estado_usuario' });
  }
};

const updateEstadoUsuario = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('UPDATE estado_usuario SET nombre = ? WHERE id = ?', [nombre, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado_usuario no encontrado' });
    res.json({ id: req.params.id, nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado_usuario' });
  }
};

const deleteEstadoUsuario = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM estado_usuario WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estado_usuario no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar estado_usuario' });
  }
};

module.exports = {
  getAllEstadoUsuarios,
  getEstadoUsuarioById,
  createEstadoUsuario,
  updateEstadoUsuario,
  deleteEstadoUsuario,
};
