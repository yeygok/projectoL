const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Token faltante o mal formado');
    return res.status(401).json({ error: 'No autorizado, token faltante' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    
    // Verificar que el usuario aún existe y está activo
    const [userRows] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.activo,
             r.id as rol_id, r.nombre as rol_nombre
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [decoded.id]);

    if (userRows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = userRows[0];

    if (!user.activo) {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol_id: user.rol_id,
      rol_nombre: user.rol_nombre
    };

    next();
  } catch (error) {
    console.error('Token inválido:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar permisos específicos
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      // Obtener permisos del usuario
      const [permisos] = await pool.query(`
        SELECT p.nombre
        FROM RolPermisos rp
        INNER JOIN Permisos p ON rp.permiso_id = p.id
        WHERE rp.rol_id = ?
      `, [req.user.rol_id]);

      const userPermissions = permisos.map(p => p.nombre);

      // Verificar si el usuario tiene el permiso requerido
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ 
          error: 'Acceso denegado', 
          required_permission: requiredPermission 
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return res.status(500).json({ error: 'Error verificando permisos' });
    }
  };
};

// Middleware para verificar roles específicos
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    if (!roles.includes(req.user.rol_nombre)) {
      return res.status(403).json({ 
        error: 'Acceso denegado', 
        required_roles: roles,
        user_role: req.user.rol_nombre
      });
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 * Simplificación de checkRole(['admin'])
 */
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (req.user.rol_nombre !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado. Solo administradores pueden realizar esta acción.',
        required_role: 'admin',
        user_role: req.user.rol_nombre
      });
    }
    
    next();
    
  } catch (error) {
    console.error('❌ Error en middleware isAdmin:', error);
    res.status(500).json({ error: 'Error en verificación de permisos' });
  }
};

module.exports = {
  authMiddleware,
  checkPermission,
  checkRole,
  isAdmin,
};
