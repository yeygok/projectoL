const pool = require('../config/db');

const getAllRolPermisos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rol_permiso');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rol_permiso' });
  }
};

const getRolPermisoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rol_permiso WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Rol_permiso no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rol_permiso' });
  }
};

const createRolPermiso = async (req, res) => {
  const { rol_id, permiso_id } = req.body;
  if (!rol_id || !permiso_id) return res.status(400).json({ error: 'Campos requeridos: rol_id, permiso_id' });
  try {
    const [result] = await pool.query('INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (?, ?)', [rol_id, permiso_id]);
    res.status(201).json({ id: result.insertId, rol_id, permiso_id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear rol_permiso' });
  }
};

const updateRolPermiso = async (req, res) => {
  const { rol_id, permiso_id } = req.body;
  if (!rol_id || !permiso_id) return res.status(400).json({ error: 'Campos requeridos: rol_id, permiso_id' });
  try {
    const [result] = await pool.query('UPDATE rol_permiso SET rol_id = ?, permiso_id = ? WHERE id = ?', [rol_id, permiso_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol_permiso no encontrado' });
    res.json({ id: req.params.id, rol_id, permiso_id });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol_permiso' });
  }
};

const deleteRolPermiso = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM rol_permiso WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol_permiso no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar rol_permiso' });
  }
};

module.exports = {
  getAllRolPermisos,
  getRolPermisoById,
  createRolPermiso,
  updateRolPermiso,
  deleteRolPermiso,
};
