const connection = require('../config/db');

class Product {
  static async getAll() {
    const [rows] = await connection.promise().query(
      'SELECT * FROM products WHERE is_active = true'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await connection.promise().query(
      'SELECT * FROM products WHERE id = ? AND is_active = true',
      [id]
    );
    return rows[0];
  }

  static async create({ name, description, price, stock }) {
    const [result] = await connection.promise().query(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description, price, stock]
    );
    return result.insertId;
  }

  static async update(id, { name, description, price, stock }) {
    await connection.promise().query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
      [name, description, price, stock, id]
    );
    return id;
  }

  static async delete(id) {
    await connection.promise().query(
      'UPDATE products SET is_active = false WHERE id = ?',
      [id]
    );
  }
}

module.exports = Product;
