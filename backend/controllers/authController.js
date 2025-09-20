const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
  const { correo, contrasena, perfil_id = 1, estado_id = 1 } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }
  try {
    // Validar que el perfil_id exista en la tabla perfil
    const [perfilRows] = await pool.query('SELECT id FROM perfil WHERE id = ?', [perfil_id]);
    if (perfilRows.length === 0) {
      return res.status(400).json({ error: 'El perfil_id no existe en la tabla perfil' });
    }
    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query('SELECT id FROM usuario WHERE correo = ?', [correo]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO usuario (correo, contrasena, perfil_id, estado_id) VALUES (?, ?, ?, ?)',
      [correo, hashedPassword, perfil_id, estado_id]
    );
    const usuario_id = result.insertId;
    // Si el perfil es cliente (ajusta el id según tu base de datos, por ejemplo 2)
    if (perfil_id == 2) {
      await pool.query('INSERT INTO cliente (usuario_id) VALUES (?)', [usuario_id]);
    }
    return res.status(201).json({ id: usuario_id, correo, perfil_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el registro' });
  }
};

const login = async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Generar token JWT
    const payload = { id: user.id, correo: user.correo, perfil_id: user.perfil_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    return res.json({ token, user: { id: user.id, correo: user.correo, perfil_id: user.perfil_id } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el login' });
  }
};

module.exports = {
  register,
  login,
};
