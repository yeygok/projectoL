const pool = require('../config/db');

const getAllRolPermisos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        rp.rol_id,
        rp.permiso_id,
        r.nombre as rol_nombre,
        p.nombre as permiso_nombre,
        p.descripcion as permiso_descripcion,
        p.modulo as permiso_modulo
      FROM RolPermisos rp
      LEFT JOIN Roles r ON rp.rol_id = r.id
      LEFT JOIN Permisos p ON rp.permiso_id = p.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllRolPermisos:', error.message);
    res.status(500).json({ error: 'Error al obtener rol_permiso' });
  }
};

const getRolPermisoById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        rp.rol_id,
        rp.permiso_id,
        r.nombre as rol_nombre,
        p.nombre as permiso_nombre,
        p.descripcion as permiso_descripcion
      FROM RolPermisos rp
      LEFT JOIN Roles r ON rp.rol_id = r.id
      LEFT JOIN Permisos p ON rp.permiso_id = p.id
      WHERE rp.rol_id = ? AND rp.permiso_id = ?
    `, [req.params.id, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Rol_permiso no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getRolPermisoById:', error.message);
    res.status(500).json({ error: 'Error al obtener rol_permiso' });
  }
};

const createRolPermiso = async (req, res) => {
  const { rol_id, permiso_id } = req.body;
  if (!rol_id || !permiso_id) return res.status(400).json({ error: 'Campos requeridos: rol_id, permiso_id' });
  try {
    const [result] = await pool.query('INSERT INTO RolPermisos (rol_id, permiso_id) VALUES (?, ?)', [rol_id, permiso_id]);
    res.status(201).json({ rol_id, permiso_id, message: 'Permiso asignado al rol correctamente' });
  } catch (error) {
    console.error('Error en createRolPermiso:', error.message);
    res.status(500).json({ error: 'Error al crear rol_permiso' });
  }
};

const updateRolPermiso = async (req, res) => {
  const { rol_id, permiso_id } = req.body;
  if (!rol_id || !permiso_id) return res.status(400).json({ error: 'Campos requeridos: rol_id, permiso_id' });
  try {
    const [result] = await pool.query('UPDATE RolPermisos SET rol_id = ?, permiso_id = ? WHERE rol_id = ? AND permiso_id = ?', [rol_id, permiso_id, req.params.id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol_permiso no encontrado' });
    res.json({ rol_id, permiso_id, message: 'Rol_permiso actualizado correctamente' });
  } catch (error) {
    console.error('Error en updateRolPermiso:', error.message);
    res.status(500).json({ error: 'Error al actualizar rol_permiso' });
  }
};

const deleteRolPermiso = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM RolPermisos WHERE rol_id = ? AND permiso_id = ?', [req.params.id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol_permiso no encontrado' });
    res.json({ message: 'Rol_permiso eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteRolPermiso:', error.message);
    res.status(500).json({ error: 'Error al eliminar rol_permiso' });
  }
};

module.exports = {
  getAllRolPermisos,
  getRolPermisoById,
  createRolPermiso,
  updateRolPermiso,
  deleteRolPermiso,
};
