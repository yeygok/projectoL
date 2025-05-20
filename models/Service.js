const pool = require('../config/db');

class Service {
  static async getAll() {
    const [rows] = await pool.promise().query(
      'SELECT * FROM servicio WHERE activo = 1'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.promise().query(
      'SELECT * FROM servicio WHERE id = ? AND activo = 1',
      [id]
    );
    return rows[0];
  }

  static async create({ nombre, descripcion, precio, duracion_minutos }) {
    const [result] = await pool.promise().query(
      'INSERT INTO servicio (nombre, descripcion, precio, duracion_minutos) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, duracion_minutos]
    );
    return result.insertId;
  }

  static async update(id, { nombre, descripcion, precio, duracion_minutos }) {
    await pool.promise().query(
      'UPDATE servicio SET nombre = ?, descripcion = ?, precio = ?, duracion_minutos = ? WHERE id = ?',
      [nombre, descripcion, precio, duracion_minutos, id]
    );
    return id;
  }

  static async delete(id) {
    await pool.promise().query(
      'UPDATE servicio SET activo = 0 WHERE id = ?',
      [id]
    );
  }
}

module.exports = Service;
