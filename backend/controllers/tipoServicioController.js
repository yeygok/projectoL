const pool = require('../config/db');

/**
 * Controlador para gestión de Tipos de Servicio
 * Implementa CRUD completo con validaciones robustas
 * @author Lavado Vapor Bogotá
 * @date 2025-10-02
 */
class TipoServicioController {
  
  /**
   * GET /api/tipos-servicio
   * Obtener todos los tipos de servicio con conteo de reservas
   */
  async getAllTipos(req, res) {
    try {
      const [tipos] = await pool.query(`
        SELECT 
          ts.*,
          COUNT(DISTINCT r.id) as total_reservas,
          COUNT(DISTINCT CASE WHEN r.estado_id IN (
            SELECT id FROM EstadosReserva WHERE estado IN ('pendiente', 'confirmada', 'en_proceso')
          ) THEN r.id END) as reservas_activas
        FROM TiposServicio ts
        LEFT JOIN Reservas r ON ts.id = r.servicio_tipo_id
        GROUP BY ts.id
        ORDER BY ts.nombre ASC
      `);
      
      console.log(`✅ ${tipos.length} tipos de servicio obtenidos exitosamente`);
      res.json(tipos);
      
    } catch (error) {
      console.error('❌ Error al obtener tipos de servicio:', error);
      res.status(500).json({ 
        error: 'Error al obtener tipos de servicio',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * GET /api/tipos-servicio/:id
   * Obtener un tipo de servicio específico por ID
   */
  async getTipoById(req, res) {
    const { id } = req.params;
    
    try {
      const [tipo] = await pool.query(`
        SELECT 
          ts.*,
          COUNT(DISTINCT r.id) as total_reservas
        FROM TiposServicio ts
        LEFT JOIN Reservas r ON ts.id = r.servicio_tipo_id
        WHERE ts.id = ?
        GROUP BY ts.id
      `, [id]);
      
      if (tipo.length === 0) {
        return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
      }
      
      console.log(`✅ Tipo de servicio ${id} obtenido exitosamente`);
      res.json(tipo[0]);
      
    } catch (error) {
      console.error('❌ Error al obtener tipo de servicio:', error);
      res.status(500).json({ 
        error: 'Error al obtener tipo de servicio',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * POST /api/tipos-servicio
   * Crear nuevo tipo de servicio (solo admin)
   */
  async createTipo(req, res) {
    const { nombre, descripcion, multiplicador_precio, color } = req.body;
    
    // Validaciones
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    if (nombre.length > 50) {
      return res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres' });
    }
    
    // Validar multiplicador_precio
    const multiplicador = multiplicador_precio || 1.00;
    if (multiplicador < 0 || multiplicador > 10) {
      return res.status(400).json({ 
        error: 'El multiplicador de precio debe estar entre 0 y 10',
        valor_recibido: multiplicador
      });
    }
    
    // Validar formato de color (#RRGGBB)
    if (color && !/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return res.status(400).json({ 
        error: 'El color debe estar en formato hexadecimal (#RRGGBB)',
        ejemplo: '#FF5733',
        valor_recibido: color
      });
    }
    
    try {
      // Verificar que el nombre no exista
      const [existente] = await pool.query(
        'SELECT id, nombre FROM TiposServicio WHERE nombre = ?',
        [nombre.trim()]
      );
      
      if (existente.length > 0) {
        return res.status(409).json({ 
          error: 'Ya existe un tipo de servicio con ese nombre',
          tipo_existente: existente[0]
        });
      }
      
      // Insertar nuevo tipo de servicio
      const [result] = await pool.query(`
        INSERT INTO TiposServicio 
        (nombre, descripcion, multiplicador_precio, color, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [
        nombre.trim(), 
        descripcion?.trim() || null, 
        multiplicador, 
        color?.toUpperCase() || null
      ]);
      
      const nuevoTipo = {
        id: result.insertId,
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        multiplicador_precio: parseFloat(multiplicador),
        color: color?.toUpperCase() || null
      };
      
      console.log(`✅ Tipo de servicio creado exitosamente: ID ${result.insertId} - ${nombre}`);
      
      res.status(201).json({
        mensaje: 'Tipo de servicio creado exitosamente',
        tipo: nuevoTipo
      });
      
    } catch (error) {
      console.error('❌ Error al crear tipo de servicio:', error);
      res.status(500).json({ 
        error: 'Error al crear tipo de servicio',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * PUT /api/tipos-servicio/:id
   * Actualizar tipo de servicio existente (solo admin)
   */
  async updateTipo(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, multiplicador_precio, color } = req.body;
    
    // Validaciones
    if (nombre && nombre.length > 50) {
      return res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres' });
    }
    
    if (multiplicador_precio !== undefined && (multiplicador_precio < 0 || multiplicador_precio > 10)) {
      return res.status(400).json({ 
        error: 'El multiplicador de precio debe estar entre 0 y 10',
        valor_recibido: multiplicador_precio
      });
    }
    
    if (color && !/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return res.status(400).json({ 
        error: 'El color debe estar en formato hexadecimal (#RRGGBB)',
        ejemplo: '#FF5733',
        valor_recibido: color
      });
    }
    
    try {
      // Verificar que el tipo existe
      const [tipo] = await pool.query(
        'SELECT id, nombre FROM TiposServicio WHERE id = ?',
        [id]
      );
      
      if (tipo.length === 0) {
        return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
      }
      
      // Verificar nombre único (excluyendo el mismo tipo)
      if (nombre && nombre.trim() !== '') {
        const [existente] = await pool.query(
          'SELECT id, nombre FROM TiposServicio WHERE nombre = ? AND id != ?',
          [nombre.trim(), id]
        );
        
        if (existente.length > 0) {
          return res.status(409).json({ 
            error: 'Ya existe otro tipo de servicio con ese nombre',
            tipo_existente: existente[0]
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
      if (multiplicador_precio !== undefined) {
        updates.push('multiplicador_precio = ?');
        values.push(parseFloat(multiplicador_precio));
      }
      if (color !== undefined) {
        updates.push('color = ?');
        values.push(color ? color.toUpperCase() : null);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      }
      
      updates.push('updated_at = NOW()');
      values.push(id);
      
      // Actualizar
      await pool.query(`
        UPDATE TiposServicio 
        SET ${updates.join(', ')}
        WHERE id = ?
      `, values);
      
      // Obtener tipo actualizado
      const [tipoActualizado] = await pool.query(
        'SELECT * FROM TiposServicio WHERE id = ?',
        [id]
      );
      
      console.log(`✅ Tipo de servicio ${id} actualizado exitosamente`);
      
      res.json({ 
        mensaje: 'Tipo de servicio actualizado exitosamente',
        tipo: tipoActualizado[0]
      });
      
    } catch (error) {
      console.error('❌ Error al actualizar tipo de servicio:', error);
      res.status(500).json({ 
        error: 'Error al actualizar tipo de servicio',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * DELETE /api/tipos-servicio/:id
   * Eliminar tipo de servicio (solo admin)
   * HARD DELETE - elimina permanentemente (no hay campo 'activo' en TiposServicio)
   */
  async deleteTipo(req, res) {
    const { id } = req.params;
    
    try {
      // Verificar que el tipo existe
      const [tipo] = await pool.query(
        'SELECT id, nombre FROM TiposServicio WHERE id = ?',
        [id]
      );
      
      if (tipo.length === 0) {
        return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
      }
      
      // Verificar que no tenga reservas asociadas
      const [reservas] = await pool.query(
        'SELECT COUNT(*) as total FROM Reservas WHERE servicio_tipo_id = ?',
        [id]
      );
      
      if (reservas[0].total > 0) {
        return res.status(400).json({ 
          error: `No se puede eliminar el tipo de servicio porque tiene ${reservas[0].total} reserva(s) asociada(s)`,
          total_reservas: reservas[0].total,
          sugerencia: 'No se recomienda eliminar tipos con reservas existentes por integridad de datos'
        });
      }
      
      // Eliminar permanentemente
      await pool.query('DELETE FROM TiposServicio WHERE id = ?', [id]);
      
      console.log(`✅ Tipo de servicio ${id} eliminado exitosamente`);
      
      res.json({ 
        mensaje: 'Tipo de servicio eliminado exitosamente',
        tipo_eliminado: {
          id: id,
          nombre: tipo[0].nombre
        }
      });
      
    } catch (error) {
      console.error('❌ Error al eliminar tipo de servicio:', error);
      res.status(500).json({ 
        error: 'Error al eliminar tipo de servicio',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new TipoServicioController();
