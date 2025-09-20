const pool = require('../config/db');

const getAllPerfiles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM perfil');
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllPerfiles:', error.message);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};

const getPerfilById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM perfil WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getPerfilById:', error.message);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const createPerfil = async (req, res) => {
  const { documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id } = req.body;
  if (!documento || !nombre || !fecha_nacimiento || !correo || !telefono || !tipo_documento_id) {
    return res.status(400).json({ error: 'Campos requeridos: documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO perfil (documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id) VALUES (?, ?, ?, ?, ?, ?)',
      [documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id]
    );
    res.status(201).json({ id: result.insertId, documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id });
  } catch (error) {
    console.error('Error en createPerfil:', error);
    res.status(500).json({ error: error.sqlMessage || 'Error al crear perfil' });
  }
};

const updatePerfil = async (req, res) => {
  const { id } = req.params;
  const { documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id } = req.body;
  if (!documento || !nombre || !fecha_nacimiento || !correo || !telefono || !tipo_documento_id) {
    return res.status(400).json({ error: 'Campos requeridos: documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE perfil SET documento = ?, nombre = ?, fecha_nacimiento = ?, correo = ?, telefono = ?, tipo_documento_id = ? WHERE id = ?',
      [documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json({ id, documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id });
  } catch (error) {
    console.error('Error en updatePerfil:', error);
    res.status(500).json({ error: error.sqlMessage || 'Error al actualizar perfil' });
  }
};

const deletePerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM perfil WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json({ message: 'Perfil eliminado correctamente' });
  } catch (error) {
    console.error('Error en deletePerfil:', error);
    res.status(500).json({ error: error.sqlMessage || 'Error al eliminar perfil' });
  }
};

module.exports = {
  getAllPerfiles,
  getPerfilById,
  createPerfil,
  updatePerfil,
  deletePerfil,
};
