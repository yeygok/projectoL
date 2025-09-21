const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo, u.created_at, 
             r.nombre as rol_nombre, r.id as rol_id
      FROM Usuarios u
      LEFT JOIN Roles r ON u.rol_id = r.id
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAll usuarios:', error.message);
    if (error.sqlMessage) {
      console.error('SQL Error:', error.sqlMessage);
    }
    console.error(error.stack);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const createUser = async (req, res) => {
  const { email, password, nombre, apellido, telefono, rol_id = 2 } = req.body; // rol_id 2 = cliente por defecto
  
  if (!email || !password || !nombre || !apellido) {
    return res.status(400).json({ error: 'Campos requeridos: email, password, nombre, apellido' });
  }
  
  try {
    // Verificar si el email ya existe
    const [existingUser] = await pool.query('SELECT id FROM Usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Validar que el rol_id exista en la tabla Roles
    const [rolRows] = await pool.query('SELECT id FROM Roles WHERE id = ?', [rol_id]);
    if (rolRows.length === 0) {
      return res.status(400).json({ error: 'El rol_id no existe en la tabla Roles' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query(`
      INSERT INTO Usuarios (email, password, nombre, apellido, telefono, rol_id, activo) 
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [email, hashedPassword, nombre, apellido, telefono || null, rol_id]);
    
    res.status(201).json({ 
      id: result.insertId, 
      email, 
      nombre, 
      apellido,
      telefono, 
      rol_id,
      activo: true
    });
  } catch (error) {
    console.error('Error en createUser:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, nombre, apellido, telefono, rol_id, activo } = req.body;
  
  if (!email || !nombre || !apellido) {
    return res.status(400).json({ error: 'Campos requeridos: email, nombre, apellido' });
  }
  
  try {
    // Verificar que el usuario existe
    const [existingUser] = await pool.query('SELECT id FROM Usuarios WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el email ya existe en otro usuario
    const [emailCheck] = await pool.query('SELECT id FROM Usuarios WHERE email = ? AND id != ?', [email, id]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
    }

    // Si se proporciona un rol_id, validar que existe
    if (rol_id) {
      const [rolRows] = await pool.query('SELECT id FROM Roles WHERE id = ?', [rol_id]);
      if (rolRows.length === 0) {
        return res.status(400).json({ error: 'El rol_id no existe en la tabla Roles' });
      }
    }

    let updateQuery = 'UPDATE Usuarios SET email = ?, nombre = ?, apellido = ?, telefono = ?';
    let updateParams = [email, nombre, apellido, telefono || null];

    // Si se proporciona password, encriptarlo
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery += ', password = ?';
      updateParams.push(hashedPassword);
    }

    // Si se proporciona rol_id, agregarlo
    if (rol_id) {
      updateQuery += ', rol_id = ?';
      updateParams.push(rol_id);
    }

    // Si se proporciona activo, agregarlo
    if (activo !== undefined) {
      updateQuery += ', activo = ?';
      updateParams.push(activo ? 1 : 0);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(id);

    const [result] = await pool.query(updateQuery, updateParams);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ 
      id, 
      email, 
      nombre, 
      apellido,
      telefono, 
      rol_id, 
      activo,
      message: 'Usuario actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error en updateUser:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar que el usuario existe
    const [existingUser] = await pool.query('SELECT id FROM Usuarios WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene reservas asociadas
    const [reservasCheck] = await pool.query('SELECT COUNT(*) as count FROM Reservas WHERE usuario_id = ?', [id]);
    if (reservasCheck[0].count > 0) {
      // En lugar de eliminar, desactivar el usuario
      await pool.query('UPDATE Usuarios SET activo = 0 WHERE id = ?', [id]);
      return res.json({ 
        message: 'Usuario desactivado (tenía reservas asociadas)', 
        action: 'deactivated' 
      });
    }

    const [result] = await pool.query('DELETE FROM Usuarios WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Agregar función para obtener usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo, u.created_at,
             r.nombre as rol_nombre, r.id as rol_id
      FROM Usuarios u
      LEFT JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getUserById:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

module.exports = {
  getAll,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
