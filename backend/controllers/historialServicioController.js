const pool = require('../config/db');

// ============================================
// HISTORIAL SERVICIOS CONTROLLER
// ============================================

// GET /historial-servicios - PRIVADO (Admin/Tecnico) - Listar todos los historiales
const getAllHistoriales = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        h.*,
        r.fecha_servicio,
        CONCAT(cliente.nombre, ' ', cliente.apellido) as cliente_nombre,
        CONCAT(tecnico.nombre, ' ', tecnico.apellido) as tecnico_nombre
      FROM HistorialServicios h
      LEFT JOIN Reservas r ON h.reserva_id = r.id
      LEFT JOIN Usuarios cliente ON r.cliente_id = cliente.id
      LEFT JOIN Usuarios tecnico ON r.tecnico_id = tecnico.id
      ORDER BY h.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllHistoriales:', error.message);
    res.status(500).json({ error: 'Error al obtener historiales' });
  }
};

// GET /historial-servicios/:id - PRIVADO - Obtener historial por ID
const getHistorialById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        h.*,
        r.fecha_servicio,
        r.precio_total,
        CONCAT(cliente.nombre, ' ', cliente.apellido) as cliente_nombre,
        CONCAT(tecnico.nombre, ' ', tecnico.apellido) as tecnico_nombre,
        cliente.email as cliente_email,
        cliente.telefono as cliente_telefono
      FROM HistorialServicios h
      LEFT JOIN Reservas r ON h.reserva_id = r.id
      LEFT JOIN Usuarios cliente ON r.cliente_id = cliente.id
      LEFT JOIN Usuarios tecnico ON r.tecnico_id = tecnico.id
      WHERE h.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getHistorialById:', error.message);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// GET /historial-servicios/reserva/:reservaId - PRIVADO - Historial por reserva
const getHistorialByReserva = async (req, res) => {
  try {
    // Verificar que el usuario tiene acceso a esta reserva
    const [reserva] = await pool.query(
      'SELECT cliente_id, tecnico_id FROM Reservas WHERE id = ?',
      [req.params.reservaId]
    );

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Verificar permisos: admin, técnico asignado o cliente owner
    const isOwner = reserva[0].cliente_id === req.user.id;
    const isTecnico = reserva[0].tecnico_id === req.user.id;
    const isAdminUser = req.user.rol_nombre === 'admin';

    if (!isOwner && !isTecnico && !isAdminUser) {
      return res.status(403).json({
        error: 'No tienes permiso para ver este historial'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM HistorialServicios WHERE reserva_id = ?',
      [req.params.reservaId]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getHistorialByReserva:', error.message);
    res.status(500).json({ error: 'Error al obtener historial de la reserva' });
  }
};

// POST /historial-servicios - PRIVADO (Tecnico) - Crear registro de historial
const createHistorial = async (req, res) => {
  const {
    reserva_id,
    fecha_inicio,
    fecha_fin,
    observaciones_inicio,
    observaciones_fin,
    productos_utilizados,
    fotos_antes,
    fotos_despues
  } = req.body;

  // Validaciones
  if (!reserva_id || !fecha_inicio) {
    return res.status(400).json({
      error: 'Campos requeridos: reserva_id, fecha_inicio'
    });
  }

  try {
    // Verificar que la reserva existe
    const [reserva] = await pool.query(
      'SELECT tecnico_id FROM Reservas WHERE id = ?',
      [reserva_id]
    );

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Verificar que el usuario es el técnico asignado o admin
    const isTecnico = reserva[0].tecnico_id === req.user.id;
    const isAdminUser = req.user.rol_nombre === 'admin';

    if (!isTecnico && !isAdminUser) {
      return res.status(403).json({
        error: 'Solo el técnico asignado puede crear el historial'
      });
    }

    // Crear historial
    const [result] = await pool.query(
      `INSERT INTO HistorialServicios 
       (reserva_id, fecha_inicio, fecha_fin, observaciones_inicio, observaciones_fin, 
        productos_utilizados, fotos_antes, fotos_despues, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        reserva_id,
        fecha_inicio,
        fecha_fin || null,
        observaciones_inicio || null,
        observaciones_fin || null,
        productos_utilizados || null,
        fotos_antes || null,
        fotos_despues || null
      ]
    );

    res.status(201).json({
      message: 'Historial de servicio creado exitosamente',
      historial: {
        id: result.insertId,
        reserva_id,
        fecha_inicio,
        fecha_fin,
        observaciones_inicio,
        observaciones_fin
      }
    });
  } catch (error) {
    console.error('Error en createHistorial:', error.message);
    res.status(500).json({ error: 'Error al crear historial' });
  }
};

// PUT /historial-servicios/:id - PRIVADO (Tecnico owner/Admin) - Actualizar historial
const updateHistorial = async (req, res) => {
  const { id } = req.params;
  const {
    fecha_fin,
    observaciones_inicio,
    observaciones_fin,
    productos_utilizados,
    fotos_antes,
    fotos_despues
  } = req.body;

  try {
    // Verificar que el historial existe y obtener técnico
    const [historial] = await pool.query(`
      SELECT h.id, r.tecnico_id 
      FROM HistorialServicios h
      LEFT JOIN Reservas r ON h.reserva_id = r.id
      WHERE h.id = ?
    `, [id]);

    if (historial.length === 0) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    // Verificar permisos
    const isTecnico = historial[0].tecnico_id === req.user.id;
    const isAdminUser = req.user.rol_nombre === 'admin';

    if (!isTecnico && !isAdminUser) {
      return res.status(403).json({
        error: 'No tienes permiso para editar este historial'
      });
    }

    // Construir query dinámico
    const updates = [];
    const values = [];

    if (fecha_fin !== undefined) {
      updates.push('fecha_fin = ?');
      values.push(fecha_fin);
    }
    if (observaciones_inicio !== undefined) {
      updates.push('observaciones_inicio = ?');
      values.push(observaciones_inicio);
    }
    if (observaciones_fin !== undefined) {
      updates.push('observaciones_fin = ?');
      values.push(observaciones_fin);
    }
    if (productos_utilizados !== undefined) {
      updates.push('productos_utilizados = ?');
      values.push(productos_utilizados);
    }
    if (fotos_antes !== undefined) {
      updates.push('fotos_antes = ?');
      values.push(fotos_antes);
    }
    if (fotos_despues !== undefined) {
      updates.push('fotos_despues = ?');
      values.push(fotos_despues);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE HistorialServicios SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Historial actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateHistorial:', error.message);
    res.status(500).json({ error: 'Error al actualizar historial' });
  }
};

// DELETE /historial-servicios/:id - PRIVADO (Admin) - Eliminar historial
const deleteHistorial = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM HistorialServicios WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    res.json({ message: 'Historial eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteHistorial:', error.message);
    res.status(500).json({ error: 'Error al eliminar historial' });
  }
};

module.exports = {
  getAllHistoriales,
  getHistorialById,
  getHistorialByReserva,
  createHistorial,
  updateHistorial,
  deleteHistorial
};
