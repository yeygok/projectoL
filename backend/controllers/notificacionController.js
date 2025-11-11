const pool = require('../config/db');

// ============================================
// NOTIFICACIONES CONTROLLER
// ============================================

// GET /notificaciones - PRIVADO - Listar notificaciones del usuario autenticado
const getMyNotificaciones = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.query(`
      SELECT 
        id,
        titulo,
        mensaje,
        tipo,
        leido,
        fecha_envio,
        created_at
      FROM Notificaciones
      WHERE usuario_id = ?
      ORDER BY created_at DESC
    `, [userId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getMyNotificaciones:', error.message);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

// GET /notificaciones/no-leidas - PRIVADO - Notificaciones no leídas del usuario
const getNotificacionesNoLeidas = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.query(`
      SELECT 
        id,
        titulo,
        mensaje,
        tipo,
        fecha_envio,
        created_at
      FROM Notificaciones
      WHERE usuario_id = ? AND leido = 0
      ORDER BY created_at DESC
    `, [userId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getNotificacionesNoLeidas:', error.message);
    res.status(500).json({ error: 'Error al obtener notificaciones no leídas' });
  }
};

// GET /notificaciones/:id - PRIVADO - Obtener notificación por ID (solo owner)
const getNotificacionById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM Notificaciones WHERE id = ? AND usuario_id = ?
    `, [req.params.id, req.user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getNotificacionById:', error.message);
    res.status(500).json({ error: 'Error al obtener notificación' });
  }
};

// PUT /notificaciones/:id/leer - PRIVADO - Marcar notificación como leída
const marcarComoLeida = async (req, res) => {
  try {
    const [result] = await pool.query(
      `UPDATE Notificaciones 
       SET leido = 1, updated_at = NOW() 
       WHERE id = ? AND usuario_id = ?`,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error en marcarComoLeida:', error.message);
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
};

// PUT /notificaciones/leer-todas - PRIVADO - Marcar todas como leídas
const marcarTodasComoLeidas = async (req, res) => {
  try {
    const [result] = await pool.query(
      `UPDATE Notificaciones 
       SET leido = 1, updated_at = NOW() 
       WHERE usuario_id = ? AND leido = 0`,
      [req.user.id]
    );

    res.json({
      message: `${result.affectedRows} notificaciones marcadas como leídas`
    });
  } catch (error) {
    console.error('Error en marcarTodasComoLeidas:', error.message);
    res.status(500).json({ error: 'Error al marcar todas las notificaciones' });
  }
};

// POST /notificaciones - PRIVADO (Admin) - Enviar notificación a un usuario
const enviarNotificacion = async (req, res) => {
  const { usuario_id, titulo, mensaje, tipo } = req.body;

  // Validaciones
  if (!usuario_id || !titulo || !mensaje) {
    return res.status(400).json({
      error: 'Campos requeridos: usuario_id, titulo, mensaje'
    });
  }

  // Validar tipo de notificación
  const tiposValidos = ['info', 'warning', 'success', 'error'];
  if (tipo && !tiposValidos.includes(tipo)) {
    return res.status(400).json({
      error: 'Tipo de notificación inválido. Valores permitidos: info, warning, success, error'
    });
  }

  try {
    // Verificar que el usuario existe
    const [usuario] = await pool.query(
      'SELECT id FROM Usuarios WHERE id = ?',
      [usuario_id]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear notificación
    const [result] = await pool.query(
      `INSERT INTO Notificaciones 
       (usuario_id, titulo, mensaje, tipo, leido, fecha_envio, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 0, NOW(), NOW(), NOW())`,
      [usuario_id, titulo, mensaje, tipo || 'info']
    );

    res.status(201).json({
      message: 'Notificación enviada exitosamente',
      notificacion: {
        id: result.insertId,
        usuario_id,
        titulo,
        mensaje,
        tipo: tipo || 'info'
      }
    });
  } catch (error) {
    console.error('Error en enviarNotificacion:', error.message);
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
};

// POST /notificaciones/broadcast - PRIVADO (Admin) - Enviar notificación a múltiples usuarios
const enviarBroadcast = async (req, res) => {
  const { usuarios_ids, titulo, mensaje, tipo } = req.body;

  // Validaciones
  if (!usuarios_ids || !Array.isArray(usuarios_ids) || usuarios_ids.length === 0) {
    return res.status(400).json({
      error: 'Debe proporcionar un array de usuarios_ids'
    });
  }

  if (!titulo || !mensaje) {
    return res.status(400).json({
      error: 'Campos requeridos: titulo, mensaje'
    });
  }

  try {
    // Crear notificaciones para cada usuario
    const valores = usuarios_ids.map(userId => [
      userId,
      titulo,
      mensaje,
      tipo || 'info',
      0, // leido
      new Date(), // fecha_envio
      new Date(), // created_at
      new Date()  // updated_at
    ]);

    await pool.query(
      `INSERT INTO Notificaciones 
       (usuario_id, titulo, mensaje, tipo, leido, fecha_envio, created_at, updated_at) 
       VALUES ?`,
      [valores]
    );

    res.status(201).json({
      message: `Notificación enviada a ${usuarios_ids.length} usuarios`,
      usuarios_notificados: usuarios_ids.length
    });
  } catch (error) {
    console.error('Error en enviarBroadcast:', error.message);
    res.status(500).json({ error: 'Error al enviar notificaciones masivas' });
  }
};

// DELETE /notificaciones/:id - PRIVADO - Eliminar notificación (usuario owner o admin)
const deleteNotificacion = async (req, res) => {
  try {
    // Admin puede eliminar cualquiera, usuario solo las suyas
    const isAdminUser = req.user.rol_nombre === 'admin';
    
    let query = 'DELETE FROM Notificaciones WHERE id = ?';
    const params = [req.params.id];
    
    if (!isAdminUser) {
      query += ' AND usuario_id = ?';
      params.push(req.user.id);
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteNotificacion:', error.message);
    res.status(500).json({ error: 'Error al eliminar notificación' });
  }
};

module.exports = {
  getMyNotificaciones,
  getNotificacionesNoLeidas,
  getNotificacionById,
  marcarComoLeida,
  marcarTodasComoLeidas,
  enviarNotificacion,
  enviarBroadcast,
  deleteNotificacion
};
