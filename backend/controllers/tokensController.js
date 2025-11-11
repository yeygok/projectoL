const pool = require('../config/db');

// ============================================
// TOKENS CONTROLLER (Uso interno - Admin only)
// ============================================

// GET /tokens/activos - PRIVADO (Solo admin) - Ver tokens activos
const getTokensActivos = async (req, res) => {
  try {
    const [tokens] = await pool.query(`
      SELECT 
        t.id,
        t.usuario_id,
        t.tipo,
        t.expiracion,
        t.activo,
        t.created_at,
        CONCAT(u.nombre, ' ', u.apellido) as usuario_nombre,
        u.email as usuario_email
      FROM Tokens t
      LEFT JOIN Usuarios u ON t.usuario_id = u.id
      WHERE t.activo = 1 AND t.expiracion > NOW()
      ORDER BY t.created_at DESC
    `);

    res.json(tokens);
  } catch (error) {
    console.error('Error en getTokensActivos:', error.message);
    res.status(500).json({ error: 'Error al obtener tokens activos' });
  }
};

// GET /tokens/usuario/:usuarioId - PRIVADO (Solo admin) - Tokens de un usuario
const getTokensByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [tokens] = await pool.query(`
      SELECT 
        id,
        tipo,
        expiracion,
        activo,
        created_at,
        CASE 
          WHEN expiracion < NOW() THEN 'expirado'
          WHEN activo = 0 THEN 'inactivo'
          ELSE 'activo'
        END as estado
      FROM Tokens
      WHERE usuario_id = ?
      ORDER BY created_at DESC
    `, [usuarioId]);

    res.json(tokens);
  } catch (error) {
    console.error('Error en getTokensByUsuario:', error.message);
    res.status(500).json({ error: 'Error al obtener tokens del usuario' });
  }
};

// DELETE /tokens/usuario/:usuarioId - PRIVADO (Solo admin) - Invalidar tokens de usuario
const invalidarTokensUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [result] = await pool.query(
      'UPDATE Tokens SET activo = 0 WHERE usuario_id = ? AND activo = 1',
      [usuarioId]
    );

    res.json({
      message: 'Tokens del usuario invalidados exitosamente',
      tokens_invalidados: result.affectedRows
    });
  } catch (error) {
    console.error('Error en invalidarTokensUsuario:', error.message);
    res.status(500).json({ error: 'Error al invalidar tokens' });
  }
};

// DELETE /tokens/limpiar-expirados - PRIVADO (Admin/Cron) - Limpiar tokens expirados
const limpiarTokensExpirados = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Tokens WHERE expiracion < NOW() OR (activo = 0 AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY))'
    );

    res.json({
      message: 'Tokens expirados eliminados exitosamente',
      tokens_eliminados: result.affectedRows
    });
  } catch (error) {
    console.error('Error en limpiarTokensExpirados:', error.message);
    res.status(500).json({ error: 'Error al limpiar tokens expirados' });
  }
};

// GET /tokens/estadisticas - PRIVADO (Solo admin) - Estadísticas de tokens
const getEstadisticasTokens = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_tokens,
        SUM(CASE WHEN activo = 1 AND expiracion > NOW() THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN expiracion < NOW() THEN 1 ELSE 0 END) as expirados,
        SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) as invalidados,
        COUNT(DISTINCT usuario_id) as usuarios_con_tokens
      FROM Tokens
    `);

    const [por_tipo] = await pool.query(`
      SELECT 
        tipo,
        COUNT(*) as cantidad,
        SUM(CASE WHEN activo = 1 AND expiracion > NOW() THEN 1 ELSE 0 END) as activos
      FROM Tokens
      GROUP BY tipo
    `);

    res.json({
      resumen: stats[0],
      por_tipo
    });
  } catch (error) {
    console.error('Error en getEstadisticasTokens:', error.message);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

module.exports = {
  getTokensActivos,
  getTokensByUsuario,
  invalidarTokensUsuario,
  limpiarTokensExpirados,
  getEstadisticasTokens
};
