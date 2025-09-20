const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, correo, perfil_id, estado_id, fecha_registro FROM usuario');
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
  const { correo, contrasena, perfil_id = 1, estado_id = 1 } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Campos requeridos: correo, contrasena' });
  }
  try {
    // Validar que el perfil_id exista en la tabla perfil
    const [perfilRows] = await pool.query('SELECT id FROM perfil WHERE id = ?', [perfil_id]);
    if (perfilRows.length === 0) {
      return res.status(400).json({ error: 'El perfil_id no existe en la tabla perfil' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    const [result] = await pool.query(
      'INSERT INTO usuario (correo, contrasena, perfil_id, estado_id) VALUES (?, ?, ?, ?)',
      [correo, hashedPassword, perfil_id, estado_id]
    );
    res.status(201).json({ id: result.insertId, correo, perfil_id, estado_id });
  } catch (error) {
    console.error('Error en createUser:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { correo, contrasena, perfil_id, estado_id } = req.body;
  if (!correo || !contrasena || !perfil_id || !estado_id) {
    return res.status(400).json({ error: 'Campos requeridos: correo, contrasena, perfil_id, estado_id' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    const [result] = await pool.query(
      'UPDATE usuario SET correo = ?, contrasena = ?, perfil_id = ?, estado_id = ? WHERE id = ?',
      [correo, hashedPassword, perfil_id, estado_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ id, correo, perfil_id, estado_id });
  } catch (error) {
    console.error('Error en updateUser:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getAll,
  createUser,
  updateUser,
  deleteUser,
};
