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
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'Campo requerido: nombre' });
  }
  try {
    const [result] = await pool.query('INSERT INTO perfil (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id: result.insertId, nombre });
  } catch (error) {
    console.error('Error en createPerfil:', error.message);
    res.status(500).json({ error: 'Error al crear perfil' });
  }
};

const updatePerfil = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'Campo requerido: nombre' });
  }
  try {
    const [result] = await pool.query('UPDATE perfil SET nombre = ? WHERE id = ?', [nombre, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json({ id: req.params.id, nombre });
  } catch (error) {
    console.error('Error en updatePerfil:', error.message);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

const deletePerfil = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM perfil WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error en deletePerfil:', error.message);
    res.status(500).json({ error: 'Error al eliminar perfil' });
  }
};

module.exports = {
  getAllPerfiles,
  getPerfilById,
  createPerfil,
  updatePerfil,
  deletePerfil,
};
