const pool = require('../config/db');

// Obtener todos los clientes (usuarios con rol de cliente)
const getAllClientes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo, u.created_at,
             r.nombre as rol_nombre
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE r.nombre = 'cliente' OR r.id = 2
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllClientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

const getClienteById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo, u.created_at,
             r.nombre as rol_nombre
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ? AND (r.nombre = 'cliente' OR r.id = 2)
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getClienteById:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

// Obtener clientes con sus reservas
const getClienteConReservas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo,
             COUNT(r.id) as total_reservas,
             MAX(r.fechaReserva) as ultima_reserva
      FROM Usuarios u
      LEFT JOIN Reservas r ON u.id = r.usuario_id
      INNER JOIN Roles rol ON u.rol_id = rol.id
      WHERE rol.nombre = 'cliente' OR rol.id = 2
      GROUP BY u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo
      ORDER BY total_reservas DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getClienteConReservas:', error);
    res.status(500).json({ error: 'Error al obtener clientes con reservas' });
  }
};

// Crear nuevo cliente
const createCliente = async (req, res) => {
  const { email, nombre, apellido, telefono, password } = req.body;
  
  if (!email || !nombre || !apellido || !password) {
    return res.status(400).json({ 
      error: 'Todos los campos son requeridos: email, nombre, apellido, password' 
    });
  }
  
  try {
    // Verificar si el email ya existe
    const [existingUser] = await pool.query('SELECT id FROM Usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Obtener el ID del rol Cliente
    const [rolCliente] = await pool.query('SELECT id FROM Roles WHERE nombre = ?', ['cliente']);
    if (rolCliente.length === 0) {
      return res.status(500).json({ error: 'Rol cliente no encontrado en el sistema' });
    }

    const rolClienteId = rolCliente[0].id;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo cliente
    const [result] = await pool.query(
      'INSERT INTO Usuarios (email, password, nombre, apellido, telefono, rol_id, activo) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [email, hashedPassword, nombre, apellido, telefono, rolClienteId]
    );
    
    res.status(201).json({ 
      message: 'Cliente creado exitosamente',
      id: result.insertId,
      email,
      nombre,
      apellido,
      telefono
    });
  } catch (error) {
    console.error('Error en createCliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

// Convertir usuario existente a cliente (cambiar su rol)
const convertirACliente = async (req, res) => {
  const { usuario_id } = req.body;
  
  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id es requerido' });
  }
  
  try {
    // Validar que el usuario exista
    const [usuarioRows] = await pool.query('SELECT id, rol_id FROM Usuarios WHERE id = ?', [usuario_id]);
    if (usuarioRows.length === 0) {
      return res.status(400).json({ error: 'El usuario no existe' });
    }

    // Obtener el ID del rol Cliente
    const [rolCliente] = await pool.query('SELECT id FROM Roles WHERE nombre = ?', ['cliente']);
    if (rolCliente.length === 0) {
      return res.status(500).json({ error: 'Rol cliente no encontrado en el sistema' });
    }

    const rolClienteId = rolCliente[0].id;

    // Verificar si ya es cliente
    if (usuarioRows[0].rol_id === rolClienteId) {
      return res.status(400).json({ error: 'El usuario ya tiene rol de cliente' });
    }

    // Actualizar el rol del usuario a Cliente
    const [result] = await pool.query('UPDATE Usuarios SET rol_id = ? WHERE id = ?', [rolClienteId, usuario_id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se pudo actualizar el usuario' });
    }

    res.status(200).json({ 
      message: 'Usuario convertido a cliente exitosamente',
      usuario_id,
      nuevo_rol_id: rolClienteId
    });
  } catch (error) {
    console.error('Error en convertirACliente:', error);
    res.status(500).json({ error: 'Error al convertir usuario a cliente' });
  }
};

// Actualizar información de cliente
const updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, email } = req.body;
  
  if (!nombre && !apellido && !telefono && !email) {
    return res.status(400).json({ error: 'Al menos un campo es requerido: nombre, apellido, telefono, email' });
  }
  
  try {
    // Verificar que el usuario existe y es cliente
    const [usuarioRows] = await pool.query(`
      SELECT u.id FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ? AND (r.nombre = 'cliente' OR r.id = 2)
    `, [id]);
    
    if (usuarioRows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Construir query dinámico
    let updateFields = [];
    let updateValues = [];
    
    if (nombre) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    if (apellido) {
      updateFields.push('apellido = ?');
      updateValues.push(apellido);
    }
    if (telefono) {
      updateFields.push('telefono = ?');
      updateValues.push(telefono);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    updateValues.push(id);
    
    const [result] = await pool.query(
      `UPDATE Usuarios SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ 
      id, 
      message: 'Cliente actualizado correctamente',
      campos_actualizados: { nombre, apellido, telefono, email }
    });
  } catch (error) {
    console.error('Error en updateCliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

// Desactivar cliente (no eliminar para mantener historial)
const deleteCliente = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar que el usuario existe y es cliente
    const [usuarioRows] = await pool.query(`
      SELECT u.id FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.id = ? AND (r.nombre = 'cliente' OR r.id = 2)
    `, [id]);
    
    if (usuarioRows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si tiene reservas activas
    const [reservasActivas] = await pool.query(`
      SELECT COUNT(*) as count FROM Reservas r
      INNER JOIN EstadosReserva er ON r.estado_id = er.id
      WHERE r.usuario_id = ? AND er.nombre IN ('Programada', 'En proceso')
    `, [id]);

    if (reservasActivas[0].count > 0) {
      return res.status(400).json({ 
        error: 'No se puede desactivar cliente con reservas activas',
        reservas_activas: reservasActivas[0].count
      });
    }

    // Desactivar cliente en lugar de eliminar
    const [result] = await pool.query('UPDATE Usuarios SET activo = 0 WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ 
      message: 'Cliente desactivado correctamente',
      id,
      action: 'deactivated'
    });
  } catch (error) {
    console.error('Error en deleteCliente:', error);
    res.status(500).json({ error: 'Error al desactivar cliente' });
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  getClienteConReservas,
  convertirACliente,
  updateCliente,
  deleteCliente,
};
