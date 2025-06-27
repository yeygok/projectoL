const pool = require('../config/db');

const getAllDirecciones = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM direccion');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

const getDireccionById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM direccion WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener dirección' });
  }
};

const createDireccion = async (req, res) => {
  const { municipio, zona, numero_casa, direccion_adicional, perfil_id } = req.body;
  if (!municipio || !zona || !numero_casa || !perfil_id) {
    return res.status(400).json({ error: 'Campos requeridos: municipio, zona, numero_casa, perfil_id' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO direccion (municipio, zona, numero_casa, direccion_adicional, perfil_id) VALUES (?, ?, ?, ?, ?)',
      [municipio, zona, numero_casa, direccion_adicional || null, perfil_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear dirección' });
  }
};

const updateDireccion = async (req, res) => {
  const { municipio, zona, numero_casa, direccion_adicional, perfil_id } = req.body;
  if (!municipio || !zona || !numero_casa || !perfil_id) {
    return res.status(400).json({ error: 'Campos requeridos: municipio, zona, numero_casa, perfil_id' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE direccion SET municipio = ?, zona = ?, numero_casa = ?, direccion_adicional = ?, perfil_id = ? WHERE id = ?',
      [municipio, zona, numero_casa, direccion_adicional || null, perfil_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar dirección' });
  }
};

const deleteDireccion = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM direccion WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar dirección' });
  }
};

module.exports = {
  getAllDirecciones,
  getDireccionById,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};
