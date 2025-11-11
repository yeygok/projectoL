const pool = require('../config/db');

// ============================================
// ESTADOS SOPORTE CONTROLLER
// ============================================

// GET /estados-soporte - PÚBLICO - Listar todos los estados
const getAllEstados = async (req, res) => {
  try {
    const [estados] = await pool.query(`
      SELECT * FROM EstadosSoporte 
      ORDER BY id ASC
    `);
    res.json(estados);
  } catch (error) {
    console.error('Error en getAllEstados:', error.message);
    res.status(500).json({ error: 'Error al obtener estados de soporte' });
  }
};

// GET /estados-soporte/:id - PÚBLICO - Obtener estado por ID
const getEstadoById = async (req, res) => {
  try {
    const [estado] = await pool.query(
      'SELECT * FROM EstadosSoporte WHERE id = ?',
      [req.params.id]
    );

    if (estado.length === 0) {
      return res.status(404).json({ error: 'Estado de soporte no encontrado' });
    }

    res.json(estado[0]);
  } catch (error) {
    console.error('Error en getEstadoById:', error.message);
    res.status(500).json({ error: 'Error al obtener estado de soporte' });
  }
};

// POST /estados-soporte - PRIVADO (Solo admin) - Crear estado
const createEstado = async (req, res) => {
  const { estado, descripcion, color } = req.body;

  if (!estado) {
    return res.status(400).json({ error: 'Campo requerido: estado' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO EstadosSoporte (estado, descripcion, color, created_at) VALUES (?, ?, ?, NOW())',
      [estado, descripcion || null, color || '#6c757d']
    );

    res.status(201).json({
      message: 'Estado de soporte creado exitosamente',
      estado: {
        id: result.insertId,
        estado,
        descripcion,
        color
      }
    });
  } catch (error) {
    console.error('Error en createEstado:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Este estado ya existe' });
    }
    res.status(500).json({ error: 'Error al crear estado de soporte' });
  }
};

// PUT /estados-soporte/:id - PRIVADO (Solo admin) - Actualizar estado
const updateEstado = async (req, res) => {
  const { id } = req.params;
  const { estado, descripcion, color } = req.body;

  try {
    const updates = [];
    const values = [];

    if (estado) {
      updates.push('estado = ?');
      values.push(estado);
    }
    if (descripcion !== undefined) {
      updates.push('descripcion = ?');
      values.push(descripcion);
    }
    if (color) {
      updates.push('color = ?');
      values.push(color);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE EstadosSoporte SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estado de soporte no encontrado' });
    }

    res.json({ message: 'Estado de soporte actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateEstado:', error.message);
    res.status(500).json({ error: 'Error al actualizar estado de soporte' });
  }
};

// DELETE /estados-soporte/:id - PRIVADO (Solo admin) - Eliminar estado
const deleteEstado = async (req, res) => {
  try {
    // Verificar si hay tickets usando este estado
    const [tickets] = await pool.query(
      'SELECT COUNT(*) as count FROM Soporte WHERE estado_id = ?',
      [req.params.id]
    );

    if (tickets[0].count > 0) {
      return res.status(400).json({
        error: `No se puede eliminar: hay ${tickets[0].count} ticket(s) usando este estado`
      });
    }

    const [result] = await pool.query(
      'DELETE FROM EstadosSoporte WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estado de soporte no encontrado' });
    }

    res.json({ message: 'Estado de soporte eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteEstado:', error.message);
    res.status(500).json({ error: 'Error al eliminar estado de soporte' });
  }
};

module.exports = {
  getAllEstados,
  getEstadoById,
  createEstado,
  updateEstado,
  deleteEstado
};
