const pool = require('../config/db');

// ============================================
// CALIFICACIONES CONTROLLER
// ============================================

// GET /calificaciones - PÚBLICO - Listar todas las calificaciones
const getAllCalificaciones = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.reserva_id,
        c.cliente_id,
        c.tecnico_id,
        c.puntuacion_servicio,
        c.puntuacion_tecnico,
        c.puntuacion_puntualidad,
        c.comentario,
        c.created_at,
        CONCAT(cliente.nombre, ' ', cliente.apellido) as cliente_nombre,
        CONCAT(tecnico.nombre, ' ', tecnico.apellido) as tecnico_nombre
      FROM Calificaciones c
      LEFT JOIN Usuarios cliente ON c.cliente_id = cliente.id
      LEFT JOIN Usuarios tecnico ON c.tecnico_id = tecnico.id
      ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllCalificaciones:', error.message);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};

// GET /calificaciones/:id - PRIVADO - Obtener calificación por ID
const getCalificacionById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        CONCAT(cliente.nombre, ' ', cliente.apellido) as cliente_nombre,
        CONCAT(tecnico.nombre, ' ', tecnico.apellido) as tecnico_nombre,
        r.fecha_servicio,
        r.precio_total
      FROM Calificaciones c
      LEFT JOIN Usuarios cliente ON c.cliente_id = cliente.id
      LEFT JOIN Usuarios tecnico ON c.tecnico_id = tecnico.id
      LEFT JOIN Reservas r ON c.reserva_id = r.id
      WHERE c.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getCalificacionById:', error.message);
    res.status(500).json({ error: 'Error al obtener calificación' });
  }
};

// GET /calificaciones/servicio/:servicioId - PÚBLICO - Calificaciones por servicio
const getCalificacionesByServicio = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.puntuacion_servicio,
        c.puntuacion_tecnico,
        c.puntuacion_puntualidad,
        c.comentario,
        c.created_at,
        CONCAT(cliente.nombre, ' ', cliente.apellido) as cliente_nombre
      FROM Calificaciones c
      LEFT JOIN Usuarios cliente ON c.cliente_id = cliente.id
      LEFT JOIN Reservas r ON c.reserva_id = r.id
      WHERE r.servicio_tipo_id = ?
      ORDER BY c.created_at DESC
    `, [req.params.servicioId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getCalificacionesByServicio:', error.message);
    res.status(500).json({ error: 'Error al obtener calificaciones del servicio' });
  }
};

// GET /calificaciones/tecnico/:tecnicoId - PÚBLICO - Calificaciones por técnico
const getCalificacionesByTecnico = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.puntuacion_servicio,
        c.puntuacion_tecnico,
        c.puntuacion_puntualidad,
        c.comentario,
        c.created_at,
        CONCAT(cliente.nombre, ' ', cliente.apellido) as cliente_nombre,
        AVG(c.puntuacion_tecnico) OVER() as promedio_tecnico
      FROM Calificaciones c
      LEFT JOIN Usuarios cliente ON c.cliente_id = cliente.id
      WHERE c.tecnico_id = ?
      ORDER BY c.created_at DESC
    `, [req.params.tecnicoId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getCalificacionesByTecnico:', error.message);
    res.status(500).json({ error: 'Error al obtener calificaciones del técnico' });
  }
};

// POST /calificaciones - PRIVADO - Crear calificación (solo cliente de la reserva)
const createCalificacion = async (req, res) => {
  const {
    reserva_id,
    puntuacion_servicio,
    puntuacion_tecnico,
    puntuacion_puntualidad,
    comentario
  } = req.body;

  // Validaciones
  if (!reserva_id || !puntuacion_servicio || !puntuacion_tecnico || !puntuacion_puntualidad) {
    return res.status(400).json({
      error: 'Campos requeridos: reserva_id, puntuacion_servicio, puntuacion_tecnico, puntuacion_puntualidad'
    });
  }

  // Validar rangos de puntuación (1-5)
  if (
    puntuacion_servicio < 1 || puntuacion_servicio > 5 ||
    puntuacion_tecnico < 1 || puntuacion_tecnico > 5 ||
    puntuacion_puntualidad < 1 || puntuacion_puntualidad > 5
  ) {
    return res.status(400).json({
      error: 'Las puntuaciones deben estar entre 1 y 5'
    });
  }

  try {
    const es_admin = req.user.rol_nombre === 'admin';

    // Verificar que la reserva existe y obtener datos
    const [reserva] = await pool.query(
      'SELECT cliente_id, tecnico_id, estado_id FROM Reservas WHERE id = ?',
      [reserva_id]
    );

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Verificar permisos: debe ser el cliente de la reserva O ser admin
    if (!es_admin && reserva[0].cliente_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permiso para calificar esta reserva'
      });
    }

    // Verificar que no haya ya una calificación para esta reserva
    const [existente] = await pool.query(
      'SELECT id FROM Calificaciones WHERE reserva_id = ?',
      [reserva_id]
    );

    if (existente.length > 0) {
      return res.status(400).json({
        error: 'Esta reserva ya tiene una calificación'
      });
    }

    // Crear calificación
    const [result] = await pool.query(
      `INSERT INTO Calificaciones 
       (reserva_id, cliente_id, tecnico_id, puntuacion_servicio, puntuacion_tecnico, 
        puntuacion_puntualidad, comentario, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        reserva_id,
        reserva[0].cliente_id,
        reserva[0].tecnico_id,
        puntuacion_servicio,
        puntuacion_tecnico,
        puntuacion_puntualidad,
        comentario || null
      ]
    );

    res.status(201).json({
      message: 'Calificación creada exitosamente',
      calificacion: {
        id: result.insertId,
        reserva_id,
        puntuacion_servicio,
        puntuacion_tecnico,
        puntuacion_puntualidad,
        comentario
      }
    });
  } catch (error) {
    console.error('Error en createCalificacion:', error.message);
    res.status(500).json({ error: 'Error al crear calificación' });
  }
};

// PUT /calificaciones/:id - PRIVADO - Actualizar calificación (solo owner)
const updateCalificacion = async (req, res) => {
  const { id } = req.params;
  const {
    puntuacion_servicio,
    puntuacion_tecnico,
    puntuacion_puntualidad,
    comentario
  } = req.body;

  try {
    // Verificar que la calificación existe y pertenece al usuario
    const [calificacion] = await pool.query(
      'SELECT cliente_id FROM Calificaciones WHERE id = ?',
      [id]
    );

    if (calificacion.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    if (calificacion[0].cliente_id !== req.user.id) {
      return res.status(403).json({
        error: 'No tienes permiso para editar esta calificación'
      });
    }

    // Validar rangos si se proporcionan
    if (puntuacion_servicio && (puntuacion_servicio < 1 || puntuacion_servicio > 5)) {
      return res.status(400).json({ error: 'puntuacion_servicio debe estar entre 1 y 5' });
    }
    if (puntuacion_tecnico && (puntuacion_tecnico < 1 || puntuacion_tecnico > 5)) {
      return res.status(400).json({ error: 'puntuacion_tecnico debe estar entre 1 y 5' });
    }
    if (puntuacion_puntualidad && (puntuacion_puntualidad < 1 || puntuacion_puntualidad > 5)) {
      return res.status(400).json({ error: 'puntuacion_puntualidad debe estar entre 1 y 5' });
    }

    // Construir query dinámico
    const updates = [];
    const values = [];

    if (puntuacion_servicio !== undefined) {
      updates.push('puntuacion_servicio = ?');
      values.push(puntuacion_servicio);
    }
    if (puntuacion_tecnico !== undefined) {
      updates.push('puntuacion_tecnico = ?');
      values.push(puntuacion_tecnico);
    }
    if (puntuacion_puntualidad !== undefined) {
      updates.push('puntuacion_puntualidad = ?');
      values.push(puntuacion_puntualidad);
    }
    if (comentario !== undefined) {
      updates.push('comentario = ?');
      values.push(comentario);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id);

    await pool.query(
      `UPDATE Calificaciones SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Calificación actualizada exitosamente' });
  } catch (error) {
    console.error('Error en updateCalificacion:', error.message);
    res.status(500).json({ error: 'Error al actualizar calificación' });
  }
};

// DELETE /calificaciones/:id - PRIVADO - Eliminar calificación (solo admin)
const deleteCalificacion = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Calificaciones WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    res.json({ message: 'Calificación eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteCalificacion:', error.message);
    res.status(500).json({ error: 'Error al eliminar calificación' });
  }
};

module.exports = {
  getAllCalificaciones,
  getCalificacionById,
  getCalificacionesByServicio,
  getCalificacionesByTecnico,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion
};
