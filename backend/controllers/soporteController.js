const pool = require('../config/db');

// ============================================
// SOPORTE CONTROLLER
// ============================================

// GET /soporte - PRIVADO - Listar tickets de soporte
const getAllTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdminUser = req.user.rol_nombre === 'admin';
    
    let query = `
      SELECT 
        s.id,
        s.usuario_id,
        s.reserva_id,
        s.titulo,
        s.mensaje,
        s.prioridad,
        s.estado_id,
        s.fecha_creacion,
        s.fecha_resolucion,
        s.created_at,
        CONCAT(u.nombre, ' ', u.apellido) as usuario_nombre,
        es.estado as estado_nombre,
        es.color as estado_color,
        CONCAT(resuelto.nombre, ' ', resuelto.apellido) as resuelto_por_nombre
      FROM Soporte s
      LEFT JOIN Usuarios u ON s.usuario_id = u.id
      LEFT JOIN EstadosSoporte es ON s.estado_id = es.id
      LEFT JOIN Usuarios resuelto ON s.resuelto_por = resuelto.id
    `;
    
    // Si no es admin, solo ve sus propios tickets
    if (!isAdminUser) {
      query += ' WHERE s.usuario_id = ?';
    }
    
    query += ' ORDER BY s.fecha_creacion DESC';
    
    const [rows] = await pool.query(query, isAdminUser ? [] : [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllTickets:', error.message);
    res.status(500).json({ error: 'Error al obtener tickets de soporte' });
  }
};

// GET /soporte/:id - PRIVADO - Obtener ticket por ID
const getTicketById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.*,
        CONCAT(u.nombre, ' ', u.apellido) as usuario_nombre,
        u.email as usuario_email,
        u.telefono as usuario_telefono,
        es.estado as estado_nombre,
        es.descripcion as estado_descripcion,
        es.color as estado_color,
        CONCAT(resuelto.nombre, ' ', resuelto.apellido) as resuelto_por_nombre,
        r.fecha_servicio as reserva_fecha
      FROM Soporte s
      LEFT JOIN Usuarios u ON s.usuario_id = u.id
      LEFT JOIN EstadosSoporte es ON s.estado_id = es.id
      LEFT JOIN Usuarios resuelto ON s.resuelto_por = resuelto.id
      LEFT JOIN Reservas r ON s.reserva_id = r.id
      WHERE s.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Verificar permisos
    const isOwner = rows[0].usuario_id === req.user.id;
    const isAdminUser = req.user.rol_nombre === 'admin';

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({
        error: 'No tienes permiso para ver este ticket'
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getTicketById:', error.message);
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
};

// GET /soporte/por-prioridad/:prioridad - PRIVADO (Admin) - Tickets por prioridad
const getTicketsByPrioridad = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id,
        s.titulo,
        s.mensaje,
        s.prioridad,
        s.fecha_creacion,
        CONCAT(u.nombre, ' ', u.apellido) as usuario_nombre,
        es.estado as estado_nombre
      FROM Soporte s
      LEFT JOIN Usuarios u ON s.usuario_id = u.id
      LEFT JOIN EstadosSoporte es ON s.estado_id = es.id
      WHERE s.prioridad = ?
      ORDER BY s.fecha_creacion DESC
    `, [req.params.prioridad]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getTicketsByPrioridad:', error.message);
    res.status(500).json({ error: 'Error al obtener tickets por prioridad' });
  }
};

// POST /soporte - PRIVADO - Crear ticket de soporte
const createTicket = async (req, res) => {
  const { reserva_id, titulo, mensaje, prioridad } = req.body;

  // Validaciones
  if (!titulo || !mensaje) {
    return res.status(400).json({
      error: 'Campos requeridos: titulo, mensaje'
    });
  }

  // Validar prioridad
  const prioridadesValidas = ['baja', 'media', 'alta', 'urgente'];
  if (prioridad && !prioridadesValidas.includes(prioridad)) {
    return res.status(400).json({
      error: 'Prioridad inválida. Valores permitidos: baja, media, alta, urgente'
    });
  }

  try {
    // Si incluye reserva_id, verificar que existe
    if (reserva_id) {
      const [reserva] = await pool.query(
        'SELECT id FROM Reservas WHERE id = ?',
        [reserva_id]
      );

      if (reserva.length === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
    }

    // Obtener estado inicial de soporte (ejemplo: "pendiente" con id=1)
    const [estadoInicial] = await pool.query(
      'SELECT id FROM EstadosSoporte WHERE estado = ? LIMIT 1',
      ['pendiente']
    );

    const estadoId = estadoInicial.length > 0 ? estadoInicial[0].id : 1;

    // Crear ticket
    const [result] = await pool.query(
      `INSERT INTO Soporte 
       (usuario_id, reserva_id, titulo, mensaje, prioridad, estado_id, 
        fecha_creacion, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
      [
        req.user.id,
        reserva_id || null,
        titulo,
        mensaje,
        prioridad || 'media',
        estadoId
      ]
    );

    res.status(201).json({
      message: 'Ticket de soporte creado exitosamente',
      ticket: {
        id: result.insertId,
        titulo,
        mensaje,
        prioridad: prioridad || 'media',
        usuario_id: req.user.id
      }
    });
  } catch (error) {
    console.error('Error en createTicket:', error.message);
    res.status(500).json({ error: 'Error al crear ticket de soporte' });
  }
};

// PUT /soporte/:id - PRIVADO (Admin) - Actualizar ticket (estado, resolución)
const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { estado_id, fecha_resolucion, mensaje_respuesta } = req.body;

  try {
    // Verificar que el ticket existe
    const [ticket] = await pool.query(
      'SELECT id, usuario_id FROM Soporte WHERE id = ?',
      [id]
    );

    if (ticket.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Construir query dinámico
    const updates = [];
    const values = [];

    if (estado_id !== undefined) {
      updates.push('estado_id = ?');
      values.push(estado_id);
    }
    
    if (fecha_resolucion !== undefined) {
      updates.push('fecha_resolucion = ?');
      values.push(fecha_resolucion);
      updates.push('resuelto_por = ?');
      values.push(req.user.id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE Soporte SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Si se marcó como resuelto, enviar notificación al usuario
    if (fecha_resolucion) {
      await pool.query(
        `INSERT INTO Notificaciones 
         (usuario_id, titulo, mensaje, tipo, leido, fecha_envio, created_at, updated_at) 
         VALUES (?, ?, ?, 'success', 0, NOW(), NOW(), NOW())`,
        [
          ticket[0].usuario_id,
          'Ticket de soporte resuelto',
          mensaje_respuesta || 'Tu ticket de soporte ha sido resuelto.'
        ]
      );
    }

    res.json({ message: 'Ticket actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateTicket:', error.message);
    res.status(500).json({ error: 'Error al actualizar ticket' });
  }
};

// DELETE /soporte/:id - PRIVADO (Admin) - Eliminar ticket
const deleteTicket = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Soporte WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json({ message: 'Ticket eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteTicket:', error.message);
    res.status(500).json({ error: 'Error al eliminar ticket' });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  getTicketsByPrioridad,
  createTicket,
  updateTicket,
  deleteTicket
};
