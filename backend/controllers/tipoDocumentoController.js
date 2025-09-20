const pool = require('../config/db');

const getAllTipoDocumentos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_documento');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_documento' });
  }
};

const getTipoDocumentoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_documento WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Tipo_documento no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_documento' });
  }
};

const createTipoDocumento = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('INSERT INTO tipo_documento (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tipo_documento' });
  }
};

const updateTipoDocumento = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('UPDATE tipo_documento SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion || null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_documento no encontrado' });
    res.json({ id: req.params.id, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tipo_documento' });
  }
};

const deleteTipoDocumento = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM tipo_documento WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_documento no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tipo_documento' });
  }
};

module.exports = {
  getAllTipoDocumentos,
  getTipoDocumentoById,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento,
};
