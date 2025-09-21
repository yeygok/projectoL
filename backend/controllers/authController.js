const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
  const { email, password, nombre, apellido, telefono, rol_id = 2 } = req.body; // 2 = cliente por defecto
  
  if (!email || !password || !nombre || !apellido) {
    return res.status(400).json({ error: 'Email, password, nombre y apellido son requeridos' });
  }
  
  try {
    // Validar que el rol_id exista en la tabla Roles
    const [rolRows] = await pool.query('SELECT id, nombre FROM Roles WHERE id = ?', [rol_id]);
    if (rolRows.length === 0) {
      return res.status(400).json({ error: 'El rol_id no existe en la tabla Roles' });
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query('SELECT id FROM Usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar usuario
    const [result] = await pool.query(`
      INSERT INTO Usuarios (email, password, nombre, apellido, telefono, rol_id, activo) 
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [email, hashedPassword, nombre, apellido, telefono || null, rol_id]);

    const usuario_id = result.insertId;

    // Obtener información completa del usuario registrado
    const [newUser] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo, 
             r.id as rol_id, r.nombre as rol_nombre
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [usuario_id]);

    return res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ error: 'Error en el registro' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }
  
  try {
    // Buscar usuario con información del rol
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.password, u.nombre, u.apellido, u.telefono, u.activo,
             r.id as rol_id, r.nombre as rol_nombre, r.descripcion as rol_descripcion
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.email = ?
    `, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({ error: 'Usuario inactivo. Contacte al administrador.' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener permisos del rol
    const [permisos] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion
      FROM RolPermisos rp
      INNER JOIN Permisos p ON rp.permiso_id = p.id
      WHERE rp.rol_id = ?
    `, [user.rol_id]);

    // Generar token JWT con información del usuario y rol
    const payload = { 
      id: user.id, 
      email: user.email, 
      nombre: user.nombre,
      apellido: user.apellido,
      rol_id: user.rol_id, 
      rol_nombre: user.rol_nombre,
      permisos: permisos.map(p => p.nombre)
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });

    return res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        rol: {
          id: user.rol_id,
          nombre: user.rol_nombre,
          descripcion: user.rol_descripcion
        },
        permisos: permisos
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el login' });
  }
};

// Verificar token y obtener usuario actual
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Obtener información actualizada del usuario
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo,
             r.id as rol_id, r.nombre as rol_nombre, r.descripcion as rol_descripcion
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [decoded.id]);

    if (rows.length === 0 || !rows[0].activo) {
      return res.status(401).json({ error: 'Usuario no válido o inactivo' });
    }

    const user = rows[0];

    // Obtener permisos actualizados
    const [permisos] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion
      FROM RolPermisos rp
      INNER JOIN Permisos p ON rp.permiso_id = p.id
      WHERE rp.rol_id = ?
    `, [user.rol_id]);

    return res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        rol: {
          id: user.rol_id,
          nombre: user.rol_nombre,
          descripcion: user.rol_descripcion
        },
        permisos: permisos
      }
    });
  } catch (error) {
    console.error('Error en verifyToken:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Viene del middleware de autenticación

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Obtener contraseña actual del usuario
    const [userRows] = await pool.query('SELECT password FROM Usuarios WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, userRows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    const [result] = await pool.query(
      'UPDATE Usuarios SET password = ? WHERE id = ?',
      [hashedNewPassword, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Error al actualizar contraseña' });
    }

    return res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en changePassword:', error);
    return res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  changePassword,
};
