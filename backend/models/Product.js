const pool = require('../config/db');

class Product {
  static async getAll() {
    const [rows] = await pool.promise().query(
      'SELECT * FROM producto WHERE activo = 1'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.promise().query(
      'SELECT * FROM producto WHERE id = ? AND activo = 1',
      [id]
    );
    return rows[0];
  }

  static async create({ nombre, descripcion, precio_unitario, stock, marca_id }) {
    const [result] = await pool.promise().query(
      'INSERT INTO producto (nombre, descripcion, precio_unitario, stock, marca_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio_unitario, stock, marca_id]
    );
    return result.insertId;
  }

  static async update(id, { nombre, descripcion, precio_unitario, stock, marca_id }) {
    await pool.promise().query(
      'UPDATE producto SET nombre = ?, descripcion = ?, precio_unitario = ?, stock = ?, marca_id = ? WHERE id = ?',
      [nombre, descripcion, precio_unitario, stock, marca_id, id]
    );
    return id;
  }

  static async delete(id) {
    await pool.promise().query(
      'UPDATE producto SET activo = 0 WHERE id = ?',
      [id]
    );
  }
}

module.exports = Product;
