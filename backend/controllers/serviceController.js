const pool = require('../config/db');

const getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM servicio WHERE activo = 1');
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllServices:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM servicio WHERE id = ? AND activo = 1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getServiceById:', error);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
};

const createService = async (req, res) => {
  const { nombre, descripcion, precio, duracion_minutos } = req.body;
  if (!nombre || !descripcion || !precio || !duracion_minutos) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, descripcion, precio, duracion_minutos' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO servicio (nombre, descripcion, precio, duracion_minutos) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, duracion_minutos]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion, precio, duracion_minutos });
  } catch (error) {
    console.error('Error en createService:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

const updateService = async (req, res) => {
  const { nombre, descripcion, precio, duracion_minutos } = req.body;
  if (!nombre || !descripcion || !precio || !duracion_minutos) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, descripcion, precio, duracion_minutos' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE servicio SET nombre = ?, descripcion = ?, precio = ?, duracion_minutos = ? WHERE id = ?',
      [nombre, descripcion, precio, duracion_minutos, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ id: req.params.id, nombre, descripcion, precio, duracion_minutos });
  } catch (error) {
    console.error('Error en updateService:', error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

const deleteService = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM servicio WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error en deleteService:', error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
