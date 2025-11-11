const pool = require('../config/db');

// Listar todas las calificaciones (público)
exports.listarCalificaciones = async (req, res) => {
  try {
    const [calificaciones] = await pool.query(`
      SELECT 
        c.*,
        CONCAT(u1.nombre, ' ', u1.apellido) as cliente_nombre,
        CONCAT(u2.nombre, ' ', u2.apellido) as tecnico_nombre
      FROM Calificaciones c
      LEFT JOIN Usuarios u1 ON c.cliente_id = u1.id
      LEFT JOIN Usuarios u2 ON c.tecnico_id = u2.id
      ORDER BY c.created_at DESC
    `);
    res.json(calificaciones);
  } catch (error) {
    console.error('Error al listar calificaciones:', error);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};

// Obtener calificación por ID (público)
exports.obtenerCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const [calificacion] = await pool.query(`
      SELECT 
        c.*,
        CONCAT(u1.nombre, ' ', u1.apellido) as cliente_nombre,
        CONCAT(u2.nombre, ' ', u2.apellido) as tecnico_nombre
      FROM Calificaciones c
      LEFT JOIN Usuarios u1 ON c.cliente_id = u1.id
      LEFT JOIN Usuarios u2 ON c.tecnico_id = u2.id
      WHERE c.id = ?
    `, [id]);
    
    if (calificacion.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }
    
    res.json(calificacion[0]);
  } catch (error) {
    console.error('Error al obtener calificación:', error);
    res.status(500).json({ error: 'Error al obtener calificación' });
  }
};

// Listar calificaciones por servicio/reserva (público)
exports.listarPorServicio = async (req, res) => {
  try {
    const { servicioId } = req.params;
    const [calificaciones] = await pool.query(`
      SELECT 
        c.*,
        CONCAT(u1.nombre, ' ', u1.apellido) as cliente_nombre,
        CONCAT(u2.nombre, ' ', u2.apellido) as tecnico_nombre
      FROM Calificaciones c
      LEFT JOIN Usuarios u1 ON c.cliente_id = u1.id
      LEFT JOIN Usuarios u2 ON c.tecnico_id = u2.id
      INNER JOIN Reservas r ON c.reserva_id = r.id
      WHERE r.servicio_tipo_id = ?
      ORDER BY c.created_at DESC
    `, [servicioId]);
    res.json(calificaciones);
  } catch (error) {
    console.error('Error al listar calificaciones por servicio:', error);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};

// Listar calificaciones por técnico (público)
exports.listarPorTecnico = async (req, res) => {
  try {
    const { tecnicoId } = req.params;
    const [calificaciones] = await pool.query(`
      SELECT 
        c.*,
        CONCAT(u1.nombre, ' ', u1.apellido) as cliente_nombre
      FROM Calificaciones c
      LEFT JOIN Usuarios u1 ON c.cliente_id = u1.id
      WHERE c.tecnico_id = ?
      ORDER BY c.created_at DESC
    `, [tecnicoId]);
    
    // Calcular promedio
    const [promedio] = await pool.query(`
      SELECT 
        AVG(puntuacion_servicio) as promedio_servicio,
        AVG(puntuacion_tecnico) as promedio_tecnico,
        AVG(puntuacion_puntualidad) as promedio_puntualidad,
        COUNT(*) as total_calificaciones
      FROM Calificaciones
      WHERE tecnico_id = ?
    `, [tecnicoId]);
    
    res.json({
      calificaciones,
      estadisticas: promedio[0]
    });
  } catch (error) {
    console.error('Error al listar calificaciones por técnico:', error);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};

// Crear calificación (privado - cliente que hizo la reserva o admin)
exports.crearCalificacion = async (req, res) => {
  try {
    const { 
      reserva_id, 
      puntuacion_servicio, 
      puntuacion_tecnico, 
      puntuacion_puntualidad,
      comentario 
    } = req.body;
    
    const usuario_id = req.user.id;
    const es_admin = req.user.rol_nombre === 'admin';

    // Validar campos requeridos
    if (!reserva_id || !puntuacion_servicio || !puntuacion_tecnico || !puntuacion_puntualidad) {
      return res.status(400).json({ 
        error: 'Campos requeridos: reserva_id, puntuacion_servicio, puntuacion_tecnico, puntuacion_puntualidad' 
      });
    }

    // Validar rango de puntuaciones (1-5)
    if (puntuacion_servicio < 1 || puntuacion_servicio > 5 ||
        puntuacion_tecnico < 1 || puntuacion_tecnico > 5 ||
        puntuacion_puntualidad < 1 || puntuacion_puntualidad > 5) {
      return res.status(400).json({ error: 'Las puntuaciones deben estar entre 1 y 5' });
    }

    // Verificar que la reserva existe
    const [reserva] = await pool.query('SELECT * FROM Reservas WHERE id = ?', [reserva_id]);

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Si no es admin, verificar que sea el cliente de la reserva
    if (!es_admin && reserva[0].cliente_id !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para calificar esta reserva' });
    }

    // Usar cliente_id de la reserva si es admin, sino el usuario actual
    const cliente_id = es_admin ? reserva[0].cliente_id : usuario_id;

    // Verificar que no exista ya una calificación para esta reserva
    const [existente] = await pool.query(
      'SELECT id FROM Calificaciones WHERE reserva_id = ?',
      [reserva_id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe una calificación para esta reserva' });
    }

    // Crear calificación
    const [result] = await pool.query(
      `INSERT INTO Calificaciones 
       (reserva_id, cliente_id, tecnico_id, puntuacion_servicio, puntuacion_tecnico, puntuacion_puntualidad, comentario) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [reserva_id, cliente_id, reserva[0].tecnico_id, puntuacion_servicio, puntuacion_tecnico, puntuacion_puntualidad, comentario || null]
    );

    const [nuevaCalificacion] = await pool.query(
      'SELECT * FROM Calificaciones WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ 
      mensaje: 'Calificación creada exitosamente', 
      calificacion: nuevaCalificacion[0] 
    });
  } catch (error) {
    console.error('Error al crear calificación:', error);
    res.status(500).json({ error: 'Error al crear calificación' });
  }
};

// Actualizar calificación (privado - cliente propietario o admin)
exports.actualizarCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntuacion_servicio, puntuacion_tecnico, puntuacion_puntualidad, comentario } = req.body;
    const usuario_id = req.user.id;
    const es_admin = req.user.rol_nombre === 'admin';

    // Verificar que la calificación existe
    const [calificacion] = await pool.query('SELECT * FROM Calificaciones WHERE id = ?', [id]);

    if (calificacion.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    // Si no es admin, verificar que sea el cliente propietario
    if (!es_admin && calificacion[0].cliente_id !== usuario_id) {
      return res.status(403).json({ error: 'No autorizado para editar esta calificación' });
    }

    await pool.query(
      `UPDATE Calificaciones 
       SET puntuacion_servicio = ?, puntuacion_tecnico = ?, puntuacion_puntualidad = ?, comentario = ?
       WHERE id = ?`,
      [puntuacion_servicio, puntuacion_tecnico, puntuacion_puntualidad, comentario, id]
    );

    const [actualizada] = await pool.query('SELECT * FROM Calificaciones WHERE id = ?', [id]);
    res.json({ mensaje: 'Calificación actualizada', calificacion: actualizada[0] });
  } catch (error) {
    console.error('Error al actualizar calificación:', error);
    res.status(500).json({ error: 'Error al actualizar calificación' });
  }
};

// Eliminar calificación (privado - admin o cliente propietario)
exports.eliminarCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;
    const es_admin = req.user.rol_nombre === 'admin';

    // Verificar permisos
    const [calificacion] = await pool.query('SELECT * FROM Calificaciones WHERE id = ?', [id]);
    
    if (calificacion.length === 0) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    if (!es_admin && calificacion[0].cliente_id !== usuario_id) {
      return res.status(403).json({ error: 'No autorizado para eliminar esta calificación' });
    }

    await pool.query('DELETE FROM Calificaciones WHERE id = ?', [id]);
    res.json({ mensaje: 'Calificación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar calificación:', error);
    res.status(500).json({ error: 'Error al eliminar calificación' });
  }
};
