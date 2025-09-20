const pool = require('../config/db');

const getAllRoles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rol');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

const getRolById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rol WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rol' });
  }
};

const createRol = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('INSERT INTO rol (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear rol' });
  }
};

const updateRol = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('UPDATE rol SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion || null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json({ id: req.params.id, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

const deleteRol = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM rol WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar rol' });
  }
};

module.exports = {
  getAllRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
};
