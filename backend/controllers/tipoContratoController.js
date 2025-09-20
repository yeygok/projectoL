const pool = require('../config/db');

const getAllTipoContratos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_contrato');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_contrato' });
  }
};

const getTipoContratoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_contrato WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Tipo_contrato no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo_contrato' });
  }
};

const createTipoContrato = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('INSERT INTO tipo_contrato (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null]);
    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tipo_contrato' });
  }
};

const updateTipoContrato = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Campo requerido: nombre' });
  try {
    const [result] = await pool.query('UPDATE tipo_contrato SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion || null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_contrato no encontrado' });
    res.json({ id: req.params.id, nombre, descripcion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tipo_contrato' });
  }
};

const deleteTipoContrato = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM tipo_contrato WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo_contrato no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tipo_contrato' });
  }
};

module.exports = {
  getAllTipoContratos,
  getTipoContratoById,
  createTipoContrato,
  updateTipoContrato,
  deleteTipoContrato,
};
