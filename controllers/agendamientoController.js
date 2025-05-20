const pool = require('../config/db');

const getAllAgendamientos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agendamiento');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener agendamientos' });
  }
};

const getAgendamientoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agendamiento WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Agendamiento no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener agendamiento' });
  }
};

const createAgendamiento = async (req, res) => {
  const { fecha, hora, descripcion, direccion_servicio, cliente_id, estado_orden_id } = req.body;
  if (!fecha || !hora || !direccion_servicio || !cliente_id || !estado_orden_id) {
    return res.status(400).json({ error: 'Campos requeridos: fecha, hora, direccion_servicio, cliente_id, estado_orden_id' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO agendamiento (fecha, hora, descripcion, direccion_servicio, cliente_id, estado_orden_id) VALUES (?, ?, ?, ?, ?, ?)',
      [fecha, hora, descripcion || null, direccion_servicio, cliente_id, estado_orden_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear agendamiento' });
  }
};

const updateAgendamiento = async (req, res) => {
  const { fecha, hora, descripcion, direccion_servicio, cliente_id, estado_orden_id } = req.body;
  if (!fecha || !hora || !direccion_servicio || !cliente_id || !estado_orden_id) {
    return res.status(400).json({ error: 'Campos requeridos: fecha, hora, direccion_servicio, cliente_id, estado_orden_id' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE agendamiento SET fecha = ?, hora = ?, descripcion = ?, direccion_servicio = ?, cliente_id = ?, estado_orden_id = ? WHERE id = ?',
      [fecha, hora, descripcion || null, direccion_servicio, cliente_id, estado_orden_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamiento no encontrado' });
    }
    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar agendamiento' });
  }
};

const deleteAgendamiento = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM agendamiento WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamiento no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar agendamiento' });
  }
};

module.exports = {
  getAllAgendamientos,
  getAgendamientoById,
  createAgendamiento,
  updateAgendamiento,
  deleteAgendamiento,
};
