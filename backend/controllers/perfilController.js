const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Obtener perfil del usuario autenticado
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Del middleware authMiddleware
    
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.apellido, 
        u.email, 
        u.telefono, 
        u.activo,
        u.created_at,
        u.updated_at,
        r.nombre as rol_nombre
      FROM Usuarios u
      LEFT JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar perfil del usuario autenticado
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellido, telefono, password, password_actual } = req.body;
    
    // Obtener datos actuales del usuario
    const [currentUser] = await pool.query(
      'SELECT nombre, apellido, telefono, password FROM Usuarios WHERE id = ?', 
      [userId]
    );
    
    if (currentUser.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Usar valores actuales si no se proporcionan nuevos
    const nuevoNombre = nombre || currentUser[0].nombre;
    const nuevoApellido = apellido || currentUser[0].apellido;
    const nuevoTelefono = telefono !== undefined ? telefono : currentUser[0].telefono;
    
    // Validaciones básicas
    if (!nuevoNombre || !nuevoApellido) {
      return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
    }
    
    let nuevaPassword = null;
    
    // Si quiere cambiar la contraseña, debe proporcionar la actual
    if (password) {
      if (!password_actual) {
        return res.status(400).json({ 
          error: 'Debe proporcionar la contraseña actual para cambiarla' 
        });
      }
      
      // Verificar contraseña actual
      const isMatch = await bcrypt.compare(password_actual, currentUser[0].password);
      
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }
      
      // Validar longitud de nueva contraseña
      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'La nueva contraseña debe tener al menos 6 caracteres' 
        });
      }
      
      // Hashear nueva contraseña
      nuevaPassword = await bcrypt.hash(password, 10);
    }
    
    // Actualizar perfil (con o sin nueva contraseña)
    if (nuevaPassword) {
      await pool.query(
        'UPDATE Usuarios SET nombre = ?, apellido = ?, telefono = ?, password = ?, updated_at = NOW() WHERE id = ?',
        [nuevoNombre, nuevoApellido, nuevoTelefono, nuevaPassword, userId]
      );
    } else {
      await pool.query(
        'UPDATE Usuarios SET nombre = ?, apellido = ?, telefono = ?, updated_at = NOW() WHERE id = ?',
        [nuevoNombre, nuevoApellido, nuevoTelefono, userId]
      );
    }
    
    res.json({ 
      message: nuevaPassword 
        ? 'Perfil y contraseña actualizados exitosamente' 
        : 'Perfil actualizado exitosamente',
      usuario: { 
        id: userId, 
        nombre: nuevoNombre, 
        apellido: nuevoApellido, 
        telefono: nuevoTelefono 
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

const getAllPerfiles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM perfil');
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllPerfiles:', error.message);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};

const getPerfilById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM perfil WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getPerfilById:', error.message);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const createPerfil = async (req, res) => {
  const { documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id } = req.body;
  if (!documento || !nombre || !fecha_nacimiento || !correo || !telefono || !tipo_documento_id) {
    return res.status(400).json({ error: 'Campos requeridos: documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO perfil (documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id) VALUES (?, ?, ?, ?, ?, ?)',
      [documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id]
    );
    res.status(201).json({ id: result.insertId, documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id });
  } catch (error) {
    console.error('Error en createPerfil:', error);
    res.status(500).json({ error: error.sqlMessage || 'Error al crear perfil' });
  }
};

const updatePerfil = async (req, res) => {
  const { id } = req.params;
  const { documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id } = req.body;
  if (!documento || !nombre || !fecha_nacimiento || !correo || !telefono || !tipo_documento_id) {
    return res.status(400).json({ error: 'Campos requeridos: documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE perfil SET documento = ?, nombre = ?, fecha_nacimiento = ?, correo = ?, telefono = ?, tipo_documento_id = ? WHERE id = ?',
      [documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json({ id, documento, nombre, fecha_nacimiento, correo, telefono, tipo_documento_id });
  } catch (error) {
    console.error('Error en updatePerfil:', error);
    res.status(500).json({ error: error.sqlMessage || 'Error al actualizar perfil' });
  }
};

const deletePerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM perfil WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json({ message: 'Perfil eliminado correctamente' });
  } catch (error) {
    console.error('Error en deletePerfil:', error);
    res.status(500).json({ error: error.sqlMessage || 'Error al eliminar perfil' });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllPerfiles,
  getPerfilById,
  createPerfil,
  updatePerfil,
  deletePerfil,
};
