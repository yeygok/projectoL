const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

class User {
  static async create({ name, email, password, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.promise().query(
      'INSERT INTO usuario (nombre, email, contrasena, rol_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 2] // 2 = rol por defecto (cliente)
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await connection.promise().query(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuario u
       JOIN rol r ON u.rol_id = r.id
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  static async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
