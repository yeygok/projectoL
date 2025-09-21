const pool = require('../config/db');

const getAllPermisos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion, p.created_at, p.updated_at,
             COUNT(rp.rol_id) as roles_con_permiso
      FROM Permisos p
      LEFT JOIN RolPermisos rp ON p.id = rp.permiso_id
      GROUP BY p.id, p.nombre, p.descripcion, p.created_at, p.updated_at
      ORDER BY p.nombre
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllPermisos:', error);
    res.status(500).json({ error: 'Error al obtener permisos' });
  }
};

const getPermisoById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion, p.created_at, p.updated_at,
             COUNT(rp.rol_id) as roles_con_permiso
      FROM Permisos p
      LEFT JOIN RolPermisos rp ON p.id = rp.permiso_id
      WHERE p.id = ?
      GROUP BY p.id, p.nombre, p.descripcion, p.created_at, p.updated_at
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    // Obtener roles que tienen este permiso
    const [roles] = await pool.query(`
      SELECT r.id, r.nombre, r.descripcion
      FROM RolPermisos rp
      INNER JOIN Roles r ON rp.rol_id = r.id
      WHERE rp.permiso_id = ?
    `, [req.params.id]);

    const permiso = rows[0];
    permiso.roles = roles;

    res.json(permiso);
  } catch (error) {
    console.error('Error en getPermisoById:', error);
    res.status(500).json({ error: 'Error al obtener permiso' });
  }
};

const createPermiso = async (req, res) => {
  const { nombre, descripcion } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'Campo requerido: nombre' });
  }
  
  try {
    // Verificar que el nombre del permiso no existe
    const [existingPermiso] = await pool.query('SELECT id FROM Permisos WHERE nombre = ?', [nombre]);
    if (existingPermiso.length > 0) {
      return res.status(400).json({ error: 'Ya existe un permiso con ese nombre' });
    }

    const [result] = await pool.query(
      'INSERT INTO Permisos (nombre, descripcion) VALUES (?, ?)', 
      [nombre, descripcion || null]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, 
      descripcion,
      message: 'Permiso creado exitosamente'
    });
  } catch (error) {
    console.error('Error en createPermiso:', error);
    res.status(500).json({ error: 'Error al crear permiso' });
  }
};

const updatePermiso = async (req, res) => {
  const { nombre, descripcion } = req.body;
  const { id } = req.params;
  
  if (!nombre) {
    return res.status(400).json({ error: 'Campo requerido: nombre' });
  }
  
  try {
    // Verificar que el permiso existe
    const [existingPermiso] = await pool.query('SELECT id FROM Permisos WHERE id = ?', [id]);
    if (existingPermiso.length === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    // Verificar que el nombre no existe en otro permiso
    const [nameCheck] = await pool.query('SELECT id FROM Permisos WHERE nombre = ? AND id != ?', [nombre, id]);
    if (nameCheck.length > 0) {
      return res.status(400).json({ error: 'Ya existe otro permiso con ese nombre' });
    }

    const [result] = await pool.query(
      'UPDATE Permisos SET nombre = ?, descripcion = ? WHERE id = ?', 
      [nombre, descripcion || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }
    
    res.json({ 
      id, 
      nombre, 
      descripcion,
      message: 'Permiso actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en updatePermiso:', error);
    res.status(500).json({ error: 'Error al actualizar permiso' });
  }
};

const deletePermiso = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar que el permiso existe
    const [existingPermiso] = await pool.query('SELECT id, nombre FROM Permisos WHERE id = ?', [id]);
    if (existingPermiso.length === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    // Verificar si hay roles con este permiso
    const [rolesWithPermission] = await pool.query('SELECT COUNT(*) as count FROM RolPermisos WHERE permiso_id = ?', [id]);
    if (rolesWithPermission[0].count > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el permiso porque está asignado a roles',
        roles_con_permiso: rolesWithPermission[0].count,
        permiso_nombre: existingPermiso[0].nombre
      });
    }

    // Eliminar el permiso
    const [result] = await pool.query('DELETE FROM Permisos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }
    
    res.json({ 
      message: 'Permiso eliminado exitosamente',
      permiso_eliminado: existingPermiso[0].nombre
    });
  } catch (error) {
    console.error('Error en deletePermiso:', error);
    res.status(500).json({ error: 'Error al eliminar permiso' });
  }
};

// Agregar función para obtener permisos por rol
const getPermisosByRole = async (req, res) => {
  const { rol_id } = req.params;
  
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion, p.created_at
      FROM RolPermisos rp
      INNER JOIN Permisos p ON rp.permiso_id = p.id
      WHERE rp.rol_id = ?
      ORDER BY p.nombre
    `, [rol_id]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getPermisosByRole:', error);
    res.status(500).json({ error: 'Error al obtener permisos del rol' });
  }
};

// Agregar función para obtener permisos disponibles (no asignados a un rol específico)
const getAvailablePermissionsForRole = async (req, res) => {
  const { rol_id } = req.params;
  
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion, p.created_at
      FROM Permisos p
      WHERE p.id NOT IN (
        SELECT rp.permiso_id 
        FROM RolPermisos rp 
        WHERE rp.rol_id = ?
      )
      ORDER BY p.nombre
    `, [rol_id]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getAvailablePermissionsForRole:', error);
    res.status(500).json({ error: 'Error al obtener permisos disponibles' });
  }
};

module.exports = {
  getAllPermisos,
  getPermisoById,
  getPermisosByRole,
  getAvailablePermissionsForRole,
  createPermiso,
  updatePermiso,
  deletePermiso,
};
