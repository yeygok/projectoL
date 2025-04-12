const connection = require('../config/db');

class Service {
  static async getAll() {
    const [rows] = await connection.promise().query(
      'SELECT * FROM services WHERE is_active = true'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await connection.promise().query(
      'SELECT * FROM services WHERE id = ? AND is_active = true',
      [id]
    );
    return rows[0];
  }

  static async create({ name, description, price, duration }) {
    const [result] = await connection.promise().query(
      'INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
      [name, description, price, duration]
    );
    return result.insertId;
  }

  static async update(id, { name, description, price, duration }) {
    await connection.promise().query(
      'UPDATE services SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?',
      [name, description, price, duration, id]
    );
    return id;
  }

  static async delete(id) {
    await connection.promise().query(
      'UPDATE services SET is_active = false WHERE id = ?',
      [id]
    );
  }
}

module.exports = Service;
