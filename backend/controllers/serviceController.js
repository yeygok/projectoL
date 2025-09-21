const pool = require('../config/db');

const getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.nombre, s.descripcion, s.precio_base, s.duracion_estimada, 
             s.activo, s.created_at, 
             c.nombre as categoria_nombre, c.id as categoria_id
      FROM Servicios s
      LEFT JOIN CategoriasServicios c ON s.categoria_id = c.id
      WHERE s.activo = 1
      ORDER BY s.nombre
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllServices:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.nombre, s.descripcion, s.precio_base, s.duracion_estimada, 
             s.activo, s.created_at, s.updated_at,
             c.nombre as categoria_nombre, c.id as categoria_id
      FROM Servicios s
      LEFT JOIN CategoriasServicios c ON s.categoria_id = c.id
      WHERE s.id = ? AND s.activo = 1
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getServiceById:', error);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
};

const createService = async (req, res) => {
  const { nombre, descripcion, precio_base, duracion_estimada, categoria_id } = req.body;
  
  if (!nombre || !precio_base || !duracion_estimada || !categoria_id) {
    return res.status(400).json({ 
      error: 'Campos requeridos: nombre, precio_base, duracion_estimada, categoria_id' 
    });
  }
  
  try {
    // Verificar que la categoría existe
    const [categoriaRows] = await pool.query('SELECT id FROM CategoriasServicios WHERE id = ?', [categoria_id]);
    if (categoriaRows.length === 0) {
      return res.status(400).json({ error: 'La categoria_id no existe' });
    }

    const [result] = await pool.query(`
      INSERT INTO Servicios (categoria_id, nombre, descripcion, precio_base, duracion_estimada, activo) 
      VALUES (?, ?, ?, ?, ?, 1)
    `, [categoria_id, nombre, descripcion || null, precio_base, duracion_estimada]);
    
    res.status(201).json({ 
      id: result.insertId, 
      categoria_id,
      nombre, 
      descripcion, 
      precio_base, 
      duracion_estimada,
      activo: true
    });
  } catch (error) {
    console.error('Error en createService:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

const updateService = async (req, res) => {
  const { nombre, descripcion, precio_base, duracion_estimada, categoria_id, activo } = req.body;
  const { id } = req.params;
  
  if (!nombre && !descripcion && !precio_base && !duracion_estimada && !categoria_id && activo === undefined) {
    return res.status(400).json({ 
      error: 'Al menos un campo es requerido: nombre, descripcion, precio_base, duracion_estimada, categoria_id, activo' 
    });
  }
  
  try {
    // Verificar que el servicio existe
    const [existingService] = await pool.query('SELECT id FROM Servicios WHERE id = ?', [id]);
    if (existingService.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Si se proporciona categoria_id, verificar que existe
    if (categoria_id) {
      const [categoriaRows] = await pool.query('SELECT id FROM CategoriasServicios WHERE id = ?', [categoria_id]);
      if (categoriaRows.length === 0) {
        return res.status(400).json({ error: 'La categoria_id no existe' });
      }
    }

    // Construir query dinámico
    let updateFields = [];
    let updateValues = [];
    
    if (nombre) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    if (descripcion !== undefined) {
      updateFields.push('descripcion = ?');
      updateValues.push(descripcion);
    }
    if (precio_base) {
      updateFields.push('precio_base = ?');
      updateValues.push(precio_base);
    }
    if (duracion_estimada) {
      updateFields.push('duracion_estimada = ?');
      updateValues.push(duracion_estimada);
    }
    if (categoria_id) {
      updateFields.push('categoria_id = ?');
      updateValues.push(categoria_id);
    }
    if (activo !== undefined) {
      updateFields.push('activo = ?');
      updateValues.push(activo ? 1 : 0);
    }
    
    updateValues.push(id);
    
    const [result] = await pool.query(
      `UPDATE Servicios SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ 
      id, 
      message: 'Servicio actualizado correctamente',
      campos_actualizados: { nombre, descripcion, precio_base, duracion_estimada, categoria_id, activo }
    });
  } catch (error) {
    console.error('Error en updateService:', error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar que el servicio existe
    const [existingService] = await pool.query('SELECT id FROM Servicios WHERE id = ?', [id]);
    if (existingService.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Verificar si el servicio tiene reservas asociadas
    const [reservasCheck] = await pool.query('SELECT COUNT(*) as count FROM Reservas WHERE servicio_id = ?', [id]);
    if (reservasCheck[0].count > 0) {
      // En lugar de eliminar, desactivar el servicio
      await pool.query('UPDATE Servicios SET activo = 0 WHERE id = ?', [id]);
      return res.json({ 
        message: 'Servicio desactivado (tenía reservas asociadas)', 
        action: 'deactivated',
        reservas_asociadas: reservasCheck[0].count
      });
    }

    const [result] = await pool.query('DELETE FROM Servicios WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteService:', error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};

// Agregar función para obtener servicios por categoría
const getServicesByCategory = async (req, res) => {
  const { categoria_id } = req.params;
  
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.nombre, s.descripcion, s.precio_base, s.duracion_estimada, 
             s.activo, s.created_at,
             c.nombre as categoria_nombre
      FROM Servicios s
      INNER JOIN CategoriasServicios c ON s.categoria_id = c.id
      WHERE s.categoria_id = ? AND s.activo = 1
      ORDER BY s.nombre
    `, [categoria_id]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getServicesByCategory:', error);
    res.status(500).json({ error: 'Error al obtener servicios por categoría' });
  }
};

// Agregar función para obtener servicios con estadísticas
const getServicesWithStats = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.nombre, s.descripcion, s.precio_base, s.duracion_estimada, 
             s.activo, s.created_at,
             c.nombre as categoria_nombre,
             COUNT(r.id) as total_reservas,
             COALESCE(AVG(cal.puntuacion), 0) as calificacion_promedio
      FROM Servicios s
      LEFT JOIN CategoriasServicios c ON s.categoria_id = c.id
      LEFT JOIN Reservas r ON s.id = r.servicio_id
      LEFT JOIN Calificaciones cal ON s.id = cal.servicio_id
      WHERE s.activo = 1
      GROUP BY s.id, s.nombre, s.descripcion, s.precio_base, s.duracion_estimada, 
               s.activo, s.created_at, c.nombre
      ORDER BY total_reservas DESC, s.nombre
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getServicesWithStats:', error);
    res.status(500).json({ error: 'Error al obtener servicios con estadísticas' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  getServicesWithStats,
  createService,
  updateService,
  deleteService,
};
