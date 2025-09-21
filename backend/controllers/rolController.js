const pool = require('../config/db');

const getAllRoles = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.nombre, r.descripcion, r.created_at, r.updated_at,
             COUNT(u.id) as usuarios_con_rol
      FROM Roles r
      LEFT JOIN Usuarios u ON r.id = u.rol_id
      GROUP BY r.id, r.nombre, r.descripcion, r.created_at, r.updated_at
      ORDER BY r.nombre
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllRoles:', error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

const getRolById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.nombre, r.descripcion, r.created_at, r.updated_at,
             COUNT(u.id) as usuarios_con_rol
      FROM Roles r
      LEFT JOIN Usuarios u ON r.id = u.rol_id
      WHERE r.id = ?
      GROUP BY r.id, r.nombre, r.descripcion, r.created_at, r.updated_at
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    
    // Obtener permisos del rol
    const [permisos] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion
      FROM RolPermisos rp
      INNER JOIN Permisos p ON rp.permiso_id = p.id
      WHERE rp.rol_id = ?
    `, [req.params.id]);
    
    const rol = rows[0];
    rol.permisos = permisos;
    
    res.json(rol);
  } catch (error) {
    console.error('Error en getRolById:', error);
    res.status(500).json({ error: 'Error al obtener rol' });
  }
};

const createRol = async (req, res) => {
  const { nombre, descripcion } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'Campo requerido: nombre' });
  }
  
  try {
    // Verificar que el nombre del rol no existe
    const [existingRol] = await pool.query('SELECT id FROM Roles WHERE nombre = ?', [nombre]);
    if (existingRol.length > 0) {
      return res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
    }

    const [result] = await pool.query(
      'INSERT INTO Roles (nombre, descripcion) VALUES (?, ?)', 
      [nombre, descripcion || null]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, 
      descripcion,
      message: 'Rol creado exitosamente'
    });
  } catch (error) {
    console.error('Error en createRol:', error);
    res.status(500).json({ error: 'Error al crear rol' });
  }
};

const updateRol = async (req, res) => {
  const { nombre, descripcion } = req.body;
  const { id } = req.params;
  
  if (!nombre) {
    return res.status(400).json({ error: 'Campo requerido: nombre' });
  }
  
  try {
    // Verificar que el rol existe
    const [existingRol] = await pool.query('SELECT id FROM Roles WHERE id = ?', [id]);
    if (existingRol.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Verificar que el nombre no existe en otro rol
    const [nameCheck] = await pool.query('SELECT id FROM Roles WHERE nombre = ? AND id != ?', [nombre, id]);
    if (nameCheck.length > 0) {
      return res.status(400).json({ error: 'Ya existe otro rol con ese nombre' });
    }

    const [result] = await pool.query(
      'UPDATE Roles SET nombre = ?, descripcion = ? WHERE id = ?', 
      [nombre, descripcion || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    
    res.json({ 
      id, 
      nombre, 
      descripcion,
      message: 'Rol actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en updateRol:', error);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

const deleteRol = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar que el rol existe
    const [existingRol] = await pool.query('SELECT id, nombre FROM Roles WHERE id = ?', [id]);
    if (existingRol.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Verificar si hay usuarios con este rol
    const [usersWithRole] = await pool.query('SELECT COUNT(*) as count FROM Usuarios WHERE rol_id = ?', [id]);
    if (usersWithRole[0].count > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el rol porque tiene usuarios asociados',
        usuarios_asociados: usersWithRole[0].count,
        rol_nombre: existingRol[0].nombre
      });
    }

    // Eliminar permisos del rol primero
    await pool.query('DELETE FROM RolPermisos WHERE rol_id = ?', [id]);

    // Eliminar el rol
    const [result] = await pool.query('DELETE FROM Roles WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    
    res.json({ 
      message: 'Rol eliminado exitosamente',
      rol_eliminado: existingRol[0].nombre
    });
  } catch (error) {
    console.error('Error en deleteRol:', error);
    res.status(500).json({ error: 'Error al eliminar rol' });
  }
};

// Agregar función para asignar permisos a un rol
const assignPermissionsToRole = async (req, res) => {
  const { id } = req.params;
  const { permisos } = req.body; // Array de IDs de permisos
  
  if (!permisos || !Array.isArray(permisos)) {
    return res.status(400).json({ error: 'Se requiere un array de permisos' });
  }
  
  try {
    // Verificar que el rol existe
    const [rolExists] = await pool.query('SELECT id FROM Roles WHERE id = ?', [id]);
    if (rolExists.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Verificar que todos los permisos existen
    const permisosPlaceholders = permisos.map(() => '?').join(',');
    const [permisosExist] = await pool.query(
      `SELECT id FROM Permisos WHERE id IN (${permisosPlaceholders})`, 
      permisos
    );
    
    if (permisosExist.length !== permisos.length) {
      return res.status(400).json({ error: 'Algunos permisos no existen' });
    }

    // Eliminar permisos actuales del rol
    await pool.query('DELETE FROM RolPermisos WHERE rol_id = ?', [id]);

    // Asignar nuevos permisos
    if (permisos.length > 0) {
      const values = permisos.map(permiso_id => [id, permiso_id]);
      const placeholders = values.map(() => '(?, ?)').join(',');
      const flatValues = values.flat();
      
      await pool.query(
        `INSERT INTO RolPermisos (rol_id, permiso_id) VALUES ${placeholders}`,
        flatValues
      );
    }

    res.json({ 
      message: 'Permisos asignados exitosamente',
      rol_id: id,
      permisos_asignados: permisos.length
    });
  } catch (error) {
    console.error('Error en assignPermissionsToRole:', error);
    res.status(500).json({ error: 'Error al asignar permisos al rol' });
  }
};

module.exports = {
  getAllRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
  assignPermissionsToRole,
};
