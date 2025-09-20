const pool = require('../config/db');

const getAllRolModulos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rol_modulo');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rol_modulo' });
  }
};

const getRolModuloById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rol_modulo WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Rol_modulo no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rol_modulo' });
  }
};

const createRolModulo = async (req, res) => {
  const { rol_id, modulo_id } = req.body;
  if (!rol_id || !modulo_id) return res.status(400).json({ error: 'Campos requeridos: rol_id, modulo_id' });
  try {
    const [result] = await pool.query('INSERT INTO rol_modulo (rol_id, modulo_id) VALUES (?, ?)', [rol_id, modulo_id]);
    res.status(201).json({ id: result.insertId, rol_id, modulo_id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear rol_modulo' });
  }
};

const updateRolModulo = async (req, res) => {
  const { rol_id, modulo_id } = req.body;
  if (!rol_id || !modulo_id) return res.status(400).json({ error: 'Campos requeridos: rol_id, modulo_id' });
  try {
    const [result] = await pool.query('UPDATE rol_modulo SET rol_id = ?, modulo_id = ? WHERE id = ?', [rol_id, modulo_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol_modulo no encontrado' });
    res.json({ id: req.params.id, rol_id, modulo_id });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol_modulo' });
  }
};

const deleteRolModulo = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM rol_modulo WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol_modulo no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar rol_modulo' });
  }
};

module.exports = {
  getAllRolModulos,
  getRolModuloById,
  createRolModulo,
  updateRolModulo,
  deleteRolModulo,
};
