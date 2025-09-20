const pool = require('../config/db');

const getAllPermisos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM permiso');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener permisos' });
  }
};

const getPermisoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM permiso WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Permiso no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener permiso' });
  }
};

const createPermiso = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('INSERT INTO permiso (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear permiso' });
  }
};

const updatePermiso = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('UPDATE permiso SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion || null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Permiso no encontrado' });
    res.json({ id: req.params.id, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar permiso' });
  }
};

const deletePermiso = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM permiso WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Permiso no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar permiso' });
  }
};

module.exports = {
  getAllPermisos,
  getPermisoById,
  createPermiso,
  updatePermiso,
  deletePermiso,
};
