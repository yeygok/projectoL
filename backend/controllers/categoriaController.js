const pool = require('../config/db');

/**
 * Controlador para gestión de Categorías de Servicios
 * Implementa CRUD completo con validaciones robustas
 * @author Lavado Vapor Bogotá
 * @date 2025-10-02
 */
class CategoriaController {
  
  /**
   * GET /api/categorias
   * Obtener todas las categorías con conteo de servicios asociados
   */
  async getAllCategorias(req, res) {
    try {
      const [categorias] = await pool.query(`
        SELECT 
          cs.*,
          COUNT(DISTINCT s.id) as total_servicios,
          COUNT(DISTINCT CASE WHEN s.activo = 1 THEN s.id END) as servicios_activos
        FROM CategoriasServicios cs
        LEFT JOIN Servicios s ON cs.id = s.categoria_id
        GROUP BY cs.id
        ORDER BY cs.orden ASC, cs.nombre ASC
      `);
      
      res.json(categorias);
      
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      res.status(500).json({ 
        error: 'Error al obtener categorías',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * GET /api/categorias/:id
   * Obtener una categoría específica por ID
   */
  async getCategoriaById(req, res) {
    const { id } = req.params;
    
    try {
      const [categoria] = await pool.query(`
        SELECT 
          cs.*,
          COUNT(DISTINCT s.id) as total_servicios,
          COUNT(DISTINCT CASE WHEN s.activo = 1 THEN s.id END) as servicios_activos
        FROM CategoriasServicios cs
        LEFT JOIN Servicios s ON cs.id = s.categoria_id
        WHERE cs.id = ?
        GROUP BY cs.id
      `, [id]);
      
      if (categoria.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      // Obtener servicios de esta categoría
      const [servicios] = await pool.query(`
        SELECT id, nombre, descripcion, precio_base, activo
        FROM Servicios
        WHERE categoria_id = ?
        ORDER BY nombre ASC
      `, [id]);
      
      const result = {
        ...categoria[0],
        servicios: servicios
      };
      
      res.json(result);
      
    } catch (error) {
      console.error('❌ Error al obtener categoría:', error);
      res.status(500).json({ 
        error: 'Error al obtener categoría',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * POST /api/categorias
   * Crear nueva categoría (solo admin)
   */
  async createCategoria(req, res) {
    const { nombre, descripcion, icono, orden } = req.body;
    
    // Validaciones
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    if (nombre.length > 100) {
      return res.status(400).json({ error: 'El nombre no puede exceder 100 caracteres' });
    }
    
    try {
      // Verificar que el nombre no exista
      const [existente] = await pool.query(
        'SELECT id, nombre FROM CategoriasServicios WHERE nombre = ?',
        [nombre.trim()]
      );
      
      if (existente.length > 0) {
        return res.status(409).json({ 
          error: 'Ya existe una categoría con ese nombre',
          categoria_existente: existente[0]
        });
      }
      
      // Si no se especifica orden, usar el siguiente disponible
      let ordenFinal = orden;
      if (!ordenFinal || ordenFinal < 0) {
        const [maxOrden] = await pool.query(
          'SELECT COALESCE(MAX(orden), 0) as max_orden FROM CategoriasServicios'
        );
        ordenFinal = maxOrden[0].max_orden + 1;
      }
      
      // Insertar nueva categoría
      const [result] = await pool.query(`
        INSERT INTO CategoriasServicios 
        (nombre, descripcion, icono, orden, activa, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, NOW(), NOW())
      `, [nombre.trim(), descripcion?.trim() || null, icono?.trim() || null, ordenFinal]);
      
      const nuevaCategoria = {
        id: result.insertId,
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        icono: icono?.trim() || null,
        orden: ordenFinal,
        activa: 1
      };
      
      
      res.status(201).json({
        mensaje: 'Categoría creada exitosamente',
        categoria: nuevaCategoria
      });
      
    } catch (error) {
      console.error('❌ Error al crear categoría:', error);
      res.status(500).json({ 
        error: 'Error al crear categoría',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * PUT /api/categorias/:id
   * Actualizar categoría existente (solo admin)
   */
  async updateCategoria(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, icono, orden, activa } = req.body;
    
    // Validaciones
    if (nombre && nombre.length > 100) {
      return res.status(400).json({ error: 'El nombre no puede exceder 100 caracteres' });
    }
    
    if (orden !== undefined && orden < 0) {
      return res.status(400).json({ error: 'El orden debe ser un número positivo' });
    }
    
    try {
      // Verificar que la categoría existe
      const [categoria] = await pool.query(
        'SELECT id, nombre, activa FROM CategoriasServicios WHERE id = ?',
        [id]
      );
      
      if (categoria.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      // Verificar nombre único (excluyendo la misma categoría)
      if (nombre && nombre.trim() !== '') {
        const [existente] = await pool.query(
          'SELECT id, nombre FROM CategoriasServicios WHERE nombre = ? AND id != ?',
          [nombre.trim(), id]
        );
        
        if (existente.length > 0) {
          return res.status(409).json({ 
            error: 'Ya existe otra categoría con ese nombre',
            categoria_existente: existente[0]
          });
        }
      }
      
      // Construir query dinámica solo con campos proporcionados
      const updates = [];
      const values = [];
      
      if (nombre !== undefined && nombre.trim() !== '') {
        updates.push('nombre = ?');
        values.push(nombre.trim());
      }
      if (descripcion !== undefined) {
        updates.push('descripcion = ?');
        values.push(descripcion?.trim() || null);
      }
      if (icono !== undefined) {
        updates.push('icono = ?');
        values.push(icono?.trim() || null);
      }
      if (orden !== undefined) {
        updates.push('orden = ?');
        values.push(orden);
      }
      if (activa !== undefined) {
        updates.push('activa = ?');
        values.push(activa ? 1 : 0);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      }
      
      updates.push('updated_at = NOW()');
      values.push(id);
      
      // Actualizar
      const [result] = await pool.query(`
        UPDATE CategoriasServicios 
        SET ${updates.join(', ')}
        WHERE id = ?
      `, values);
      
      // Obtener categoría actualizada
      const [categoriaActualizada] = await pool.query(
        'SELECT * FROM CategoriasServicios WHERE id = ?',
        [id]
      );
      
      
      res.json({ 
        mensaje: 'Categoría actualizada exitosamente',
        categoria: categoriaActualizada[0]
      });
      
    } catch (error) {
      console.error('❌ Error al actualizar categoría:', error);
      res.status(500).json({ 
        error: 'Error al actualizar categoría',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * DELETE /api/categorias/:id
   * Eliminar (desactivar) categoría (solo admin)
   * Soft delete - marca como inactiva en lugar de eliminar
   */
  async deleteCategoria(req, res) {
    const { id } = req.params;
    
    try {
      // Verificar que la categoría existe
      const [categoria] = await pool.query(
        'SELECT id, nombre, activa FROM CategoriasServicios WHERE id = ?',
        [id]
      );
      
      if (categoria.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      if (categoria[0].activa === 0) {
        return res.status(400).json({ 
          error: 'La categoría ya está desactivada',
          categoria: categoria[0]
        });
      }
      
      // Verificar que no tenga servicios activos
      const [servicios] = await pool.query(
        'SELECT COUNT(*) as total FROM Servicios WHERE categoria_id = ? AND activo = 1',
        [id]
      );
      
      if (servicios[0].total > 0) {
        return res.status(400).json({ 
          error: `No se puede desactivar la categoría porque tiene ${servicios[0].total} servicio(s) activo(s)`,
          servicios_activos: servicios[0].total,
          sugerencia: 'Primero desactiva o reasigna los servicios asociados'
        });
      }
      
      // Soft delete - marcar como inactiva
      const [result] = await pool.query(
        'UPDATE CategoriasServicios SET activa = 0, updated_at = NOW() WHERE id = ?',
        [id]
      );
      
      
      res.json({ 
        mensaje: 'Categoría desactivada exitosamente',
        categoria: {
          id: id,
          nombre: categoria[0].nombre,
          activa: 0
        }
      });
      
    } catch (error) {
      console.error('❌ Error al eliminar categoría:', error);
      res.status(500).json({ 
        error: 'Error al eliminar categoría',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * PUT /api/categorias/:id/reactivar
   * Reactivar categoría desactivada (solo admin)
   */
  async reactivarCategoria(req, res) {
    const { id } = req.params;
    
    try {
      const [categoria] = await pool.query(
        'SELECT id, nombre, activa FROM CategoriasServicios WHERE id = ?',
        [id]
      );
      
      if (categoria.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      if (categoria[0].activa === 1) {
        return res.status(400).json({ error: 'La categoría ya está activa' });
      }
      
      await pool.query(
        'UPDATE CategoriasServicios SET activa = 1, updated_at = NOW() WHERE id = ?',
        [id]
      );
      
      
      res.json({ 
        mensaje: 'Categoría reactivada exitosamente',
        categoria: {
          id: id,
          nombre: categoria[0].nombre,
          activa: 1
        }
      });
      
    } catch (error) {
      console.error('❌ Error al reactivar categoría:', error);
      res.status(500).json({ error: 'Error al reactivar categoría' });
    }
  }
}

module.exports = new CategoriaController();
