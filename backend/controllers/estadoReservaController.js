const pool = require('../config/db');

/**
 * Controlador para gestión de Estados de Reserva
 * Implementa CRUD completo con validaciones robustas
 * @author Lavado Vapor Bogotá
 * @date 2025-10-02
 */
class EstadoReservaController {
  
  /**
   * GET /api/estados-reserva
   * Obtener todos los estados con conteo de reservas asociadas
   */
  async getAllEstados(req, res) {
    try {
      const [estados] = await pool.query(`
        SELECT 
          er.*,
          COUNT(DISTINCT r.id) as total_reservas,
          COUNT(DISTINCT CASE WHEN DATE(r.fecha_servicio) >= CURDATE() THEN r.id END) as reservas_futuras,
          COUNT(DISTINCT CASE WHEN DATE(r.fecha_servicio) < CURDATE() THEN r.id END) as reservas_pasadas
        FROM EstadosReserva er
        LEFT JOIN Reservas r ON er.id = r.estado_id
        GROUP BY er.id
        ORDER BY er.id ASC
      `);
      
      console.log(`✅ ${estados.length} estados de reserva obtenidos exitosamente`);
      res.json(estados);
      
    } catch (error) {
      console.error('❌ Error al obtener estados de reserva:', error);
      res.status(500).json({ 
        error: 'Error al obtener estados de reserva',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * GET /api/estados-reserva/:id
   * Obtener un estado específico por ID con detalles
   */
  async getEstadoById(req, res) {
    const { id } = req.params;
    
    try {
      const [estado] = await pool.query(`
        SELECT 
          er.*,
          COUNT(DISTINCT r.id) as total_reservas
        FROM EstadosReserva er
        LEFT JOIN Reservas r ON er.id = r.estado_id
        WHERE er.id = ?
        GROUP BY er.id
      `, [id]);
      
      if (estado.length === 0) {
        return res.status(404).json({ error: 'Estado de reserva no encontrado' });
      }
      
      // Obtener muestra de reservas en este estado
      const [reservasMuestra] = await pool.query(`
        SELECT 
          r.id,
          r.fecha_servicio,
          r.precio_total,
          u.nombre as cliente_nombre,
          u.apellido as cliente_apellido
        FROM Reservas r
        LEFT JOIN Usuarios u ON r.cliente_id = u.id
        WHERE r.estado_id = ?
        ORDER BY r.fecha_servicio DESC
        LIMIT 5
      `, [id]);
      
      const result = {
        ...estado[0],
        reservas_muestra: reservasMuestra
      };
      
      console.log(`✅ Estado de reserva ${id} obtenido exitosamente`);
      res.json(result);
      
    } catch (error) {
      console.error('❌ Error al obtener estado de reserva:', error);
      res.status(500).json({ 
        error: 'Error al obtener estado de reserva',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * POST /api/estados-reserva
   * Crear nuevo estado de reserva (solo admin)
   */
  async createEstado(req, res) {
    const { estado, descripcion, color } = req.body;
    
    // Validaciones
    if (!estado || estado.trim() === '') {
      return res.status(400).json({ error: 'El estado es requerido' });
    }
    
    if (estado.length > 50) {
      return res.status(400).json({ error: 'El estado no puede exceder 50 caracteres' });
    }
    
    // Validar formato de color (#RRGGBB)
    if (color && !/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return res.status(400).json({ 
        error: 'El color debe estar en formato hexadecimal (#RRGGBB)',
        ejemplo: '#28A745',
        valor_recibido: color
      });
    }
    
    try {
      // Verificar que el estado no exista
      const [existente] = await pool.query(
        'SELECT id, estado FROM EstadosReserva WHERE estado = ?',
        [estado.trim()]
      );
      
      if (existente.length > 0) {
        return res.status(409).json({ 
          error: 'Ya existe un estado de reserva con ese nombre',
          estado_existente: existente[0]
        });
      }
      
      // Insertar nuevo estado
      const [result] = await pool.query(`
        INSERT INTO EstadosReserva 
        (estado, descripcion, color, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
      `, [estado.trim(), descripcion?.trim() || null, color?.toUpperCase() || null]);
      
      const nuevoEstado = {
        id: result.insertId,
        estado: estado.trim(),
        descripcion: descripcion?.trim() || null,
        color: color?.toUpperCase() || null
      };
      
      console.log(`✅ Estado de reserva creado exitosamente: ID ${result.insertId} - ${estado}`);
      
      res.status(201).json({
        mensaje: 'Estado de reserva creado exitosamente',
        estado: nuevoEstado
      });
      
    } catch (error) {
      console.error('❌ Error al crear estado de reserva:', error);
      res.status(500).json({ 
        error: 'Error al crear estado de reserva',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * PUT /api/estados-reserva/:id
   * Actualizar estado de reserva existente (solo admin)
   */
  async updateEstado(req, res) {
    const { id } = req.params;
    const { estado, descripcion, color } = req.body;
    
    // Validaciones
    if (estado && estado.length > 50) {
      return res.status(400).json({ error: 'El estado no puede exceder 50 caracteres' });
    }
    
    if (color && !/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return res.status(400).json({ 
        error: 'El color debe estar en formato hexadecimal (#RRGGBB)',
        ejemplo: '#28A745',
        valor_recibido: color
      });
    }
    
    try {
      // Verificar que el estado existe
      const [estadoExistente] = await pool.query(
        'SELECT id, estado FROM EstadosReserva WHERE id = ?',
        [id]
      );
      
      if (estadoExistente.length === 0) {
        return res.status(404).json({ error: 'Estado de reserva no encontrado' });
      }
      
      // Verificar nombre único (excluyendo el mismo estado)
      if (estado && estado.trim() !== '') {
        const [duplicado] = await pool.query(
          'SELECT id, estado FROM EstadosReserva WHERE estado = ? AND id != ?',
          [estado.trim(), id]
        );
        
        if (duplicado.length > 0) {
          return res.status(409).json({ 
            error: 'Ya existe otro estado de reserva con ese nombre',
            estado_existente: duplicado[0]
          });
        }
      }
      
      // Construir query dinámica solo con campos proporcionados
      const updates = [];
      const values = [];
      
      if (estado !== undefined && estado.trim() !== '') {
        updates.push('estado = ?');
        values.push(estado.trim());
      }
      if (descripcion !== undefined) {
        updates.push('descripcion = ?');
        values.push(descripcion?.trim() || null);
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
        UPDATE EstadosReserva 
        SET ${updates.join(', ')}
        WHERE id = ?
      `, values);
      
      // Obtener estado actualizado
      const [estadoActualizado] = await pool.query(
        'SELECT * FROM EstadosReserva WHERE id = ?',
        [id]
      );
      
      console.log(`✅ Estado de reserva ${id} actualizado exitosamente`);
      
      res.json({ 
        mensaje: 'Estado de reserva actualizado exitosamente',
        estado: estadoActualizado[0]
      });
      
    } catch (error) {
      console.error('❌ Error al actualizar estado de reserva:', error);
      res.status(500).json({ 
        error: 'Error al actualizar estado de reserva',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * DELETE /api/estados-reserva/:id
   * Eliminar estado de reserva (solo admin)
   * HARD DELETE - elimina permanentemente
   * ⚠️ CUIDADO: Los estados son fundamentales para el flujo de negocio
   */
  async deleteEstado(req, res) {
    const { id } = req.params;
    
    try {
      // Verificar que el estado existe
      const [estadoExistente] = await pool.query(
        'SELECT id, estado FROM EstadosReserva WHERE id = ?',
        [id]
      );
      
      if (estadoExistente.length === 0) {
        return res.status(404).json({ error: 'Estado de reserva no encontrado' });
      }
      
      // Verificar que no tenga reservas asociadas
      const [reservas] = await pool.query(
        'SELECT COUNT(*) as total FROM Reservas WHERE estado_id = ?',
        [id]
      );
      
      if (reservas[0].total > 0) {
        return res.status(400).json({ 
          error: `No se puede eliminar el estado porque tiene ${reservas[0].total} reserva(s) asociada(s)`,
          total_reservas: reservas[0].total,
          sugerencia: 'No se recomienda eliminar estados con reservas existentes por integridad de datos'
        });
      }
      
      // Verificar que no sea un estado crítico del sistema
      const estadosCriticos = ['pendiente', 'confirmada', 'completada', 'cancelada'];
      const estadoNombre = estadoExistente[0].estado.toLowerCase();
      
      if (estadosCriticos.includes(estadoNombre)) {
        return res.status(400).json({ 
          error: 'No se puede eliminar un estado crítico del sistema',
          estado: estadoExistente[0].estado,
          estados_criticos: estadosCriticos,
          sugerencia: 'Los estados críticos son necesarios para el funcionamiento del sistema'
        });
      }
      
      // Eliminar permanentemente
      await pool.query('DELETE FROM EstadosReserva WHERE id = ?', [id]);
      
      console.log(`✅ Estado de reserva ${id} eliminado exitosamente`);
      
      res.json({ 
        mensaje: 'Estado de reserva eliminado exitosamente',
        estado_eliminado: {
          id: id,
          estado: estadoExistente[0].estado
        }
      });
      
    } catch (error) {
      console.error('❌ Error al eliminar estado de reserva:', error);
      res.status(500).json({ 
        error: 'Error al eliminar estado de reserva',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * GET /api/estados-reserva/stats/resumen
   * Obtener estadísticas de reservas por estado
   */
  async getEstadisticas(req, res) {
    try {
      const [stats] = await pool.query(`
        SELECT 
          er.id,
          er.estado,
          er.color,
          COUNT(r.id) as total_reservas,
          COUNT(CASE WHEN DATE(r.fecha_servicio) >= CURDATE() THEN 1 END) as futuras,
          COUNT(CASE WHEN DATE(r.fecha_servicio) < CURDATE() THEN 1 END) as pasadas,
          COALESCE(SUM(r.precio_total), 0) as ingresos_totales,
          COALESCE(AVG(r.precio_total), 0) as precio_promedio
        FROM EstadosReserva er
        LEFT JOIN Reservas r ON er.id = r.estado_id
        GROUP BY er.id
        ORDER BY total_reservas DESC
      `);
      
      console.log('✅ Estadísticas de estados obtenidas exitosamente');
      res.json({
        estadisticas: stats,
        total_estados: stats.length,
        fecha_consulta: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
}

module.exports = new EstadoReservaController();
