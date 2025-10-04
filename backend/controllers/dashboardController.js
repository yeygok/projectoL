const pool = require('../config/db');

class DashboardController {
  
  // ============= DASHBOARD PRINCIPAL =============
  async getDashboardStats(req, res) {
    try {
      // Métricas generales
      const [usuarios] = await pool.query('SELECT COUNT(*) as total FROM Usuarios WHERE activo = 1');
      const [clientes] = await pool.query('SELECT COUNT(*) as total FROM Usuarios u JOIN Roles r ON u.rol_id = r.id WHERE r.nombre = "cliente" AND u.activo = 1');
      const [tecnicos] = await pool.query('SELECT COUNT(*) as total FROM Usuarios u JOIN Roles r ON u.rol_id = r.id WHERE r.nombre = "tecnico" AND u.activo = 1');
      const [servicios] = await pool.query('SELECT COUNT(*) as total FROM Servicios WHERE activo = 1');
      const [ubicaciones] = await pool.query('SELECT COUNT(*) as total FROM Ubicaciones WHERE activa = 1');
      const [vehiculos] = await pool.query('SELECT COUNT(*) as total FROM Vehiculos WHERE activo = 1');
      
      // Métricas de reservas
      const [totalReservas] = await pool.query('SELECT COUNT(*) as total FROM Reservas');
      const [reservasHoy] = await pool.query('SELECT COUNT(*) as total FROM Reservas WHERE DATE(fecha_servicio) = CURDATE()');
      const [reservasPendientes] = await pool.query('SELECT COUNT(*) as total FROM Reservas r JOIN EstadosReserva er ON r.estado_id = er.id WHERE er.estado = "pendiente"');
      const [reservasEnProceso] = await pool.query('SELECT COUNT(*) as total FROM Reservas r JOIN EstadosReserva er ON r.estado_id = er.id WHERE er.estado = "en_proceso"');
      
      // Métricas financieras
      const [ingresos] = await pool.query('SELECT COALESCE(SUM(precio_total), 0) as total FROM Reservas r JOIN EstadosReserva er ON r.estado_id = er.id WHERE er.estado = "completada"');
      const [ingresosMes] = await pool.query('SELECT COALESCE(SUM(precio_total), 0) as total FROM Reservas r JOIN EstadosReserva er ON r.estado_id = er.id WHERE er.estado = "completada" AND MONTH(r.fecha_servicio) = MONTH(CURDATE()) AND YEAR(r.fecha_servicio) = YEAR(CURDATE())');
      const [promedioTicket] = await pool.query('SELECT COALESCE(AVG(precio_total), 0) as promedio FROM Reservas r JOIN EstadosReserva er ON r.estado_id = er.id WHERE er.estado = "completada"');
      
      // Reservas por estado
      const [reservasPorEstado] = await pool.query(`
        SELECT er.estado, er.descripcion, er.color, COUNT(r.id) as cantidad
        FROM EstadosReserva er
        LEFT JOIN Reservas r ON er.id = r.estado_id
        GROUP BY er.id
        ORDER BY cantidad DESC
      `);
      
      // Servicios más solicitados
      const [serviciosMasSolicitados] = await pool.query(`
        SELECT ts.nombre, ts.descripcion, COUNT(r.id) as cantidad
        FROM TiposServicio ts
        LEFT JOIN Reservas r ON ts.id = r.servicio_tipo_id
        GROUP BY ts.id
        ORDER BY cantidad DESC
        LIMIT 5
      `);
      
      // Técnicos más activos
      const [tecnicosMasActivos] = await pool.query(`
        SELECT u.nombre, u.apellido, COUNT(r.id) as reservas_asignadas
        FROM Usuarios u
        JOIN Roles rol ON u.rol_id = rol.id
        LEFT JOIN Reservas r ON u.id = r.tecnico_id
        WHERE rol.nombre = 'tecnico' AND u.activo = 1
        GROUP BY u.id
        ORDER BY reservas_asignadas DESC
        LIMIT 5
      `);
      
      // Actividad reciente
      const [actividadReciente] = await pool.query(`
        SELECT 
          r.id,
          r.fecha_reserva,
          r.fecha_servicio,
          r.precio_total,
          c.nombre as cliente_nombre,
          c.apellido as cliente_apellido,
          t.nombre as tecnico_nombre,
          ts.nombre as tipo_servicio,
          er.estado
        FROM Reservas r
        LEFT JOIN Usuarios c ON r.cliente_id = c.id
        LEFT JOIN Usuarios t ON r.tecnico_id = t.id
        LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
        LEFT JOIN EstadosReserva er ON r.estado_id = er.id
        ORDER BY r.created_at DESC
        LIMIT 10
      `);

      res.json({
        totalUsuarios: usuarios[0].total,
        totalClientes: clientes[0].total,
        totalReservas: totalReservas[0].total,
        totalServicios: servicios[0].total,
        reservasHoy: reservasHoy[0].total,
        reservasPendientes: reservasPendientes[0].total,
        ingresosMes: parseFloat(ingresosMes[0].total),
        clientesActivos: clientes[0].total
      });

    } catch (error) {
      console.error('Error en dashboard stats:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
    }
  }

  async getRecentReservas(req, res) {
    try {
      const [reservas] = await pool.query(`
        SELECT 
          r.id,
          r.fecha_reserva,
          r.fecha_servicio,
          r.precio_total,
          r.observaciones,
          r.created_at,
          u.nombre as cliente_nombre,
          u.apellido as cliente_apellido,
          u.email as cliente_email,
          u.telefono as cliente_telefono,
          ts.nombre as servicio_nombre,
          ts.descripcion as servicio_descripcion,
          er.estado as estado_nombre,
          er.color as estado_color,
          t.nombre as tecnico_nombre,
          t.apellido as tecnico_apellido
        FROM Reservas r
        LEFT JOIN Usuarios u ON r.cliente_id = u.id
        LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
        LEFT JOIN EstadosReserva er ON r.estado_id = er.id
        LEFT JOIN Usuarios t ON r.tecnico_id = t.id
        ORDER BY r.created_at DESC
        LIMIT 10
      `);
      
      res.json(reservas);
    } catch (error) {
      console.error('Error al obtener reservas recientes:', error);
      res.status(500).json({ error: 'Error al obtener reservas recientes' });
    }
  }

  // ============= GESTIÓN DE USUARIOS =============
  async getAllUsers(req, res) {
    try {
      const [usuarios] = await pool.query(`
        SELECT u.*, r.nombre as rol_nombre, ub.direccion as ubicacion_direccion
        FROM Usuarios u
        LEFT JOIN Roles r ON u.rol_id = r.id
        LEFT JOIN Ubicaciones ub ON u.ubicacion_id = ub.id
        ORDER BY u.created_at DESC
      `);
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  async createUser(req, res) {
    const { nombre, apellido, email, telefono, ubicacion_id, rol_id, password } = req.body;
    
    if (!nombre || !apellido || !email || !rol_id || !password) {
      return res.status(400).json({ error: 'Campos requeridos: nombre, apellido, email, rol_id, password' });
    }

    try {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(`
        INSERT INTO Usuarios (nombre, apellido, email, telefono, ubicacion_id, rol_id, password, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [nombre, apellido, email, telefono, ubicacion_id, rol_id, hashedPassword]);
      
      res.status(201).json({
        id: result.insertId,
        mensaje: 'Usuario creado exitosamente',
        usuario: { nombre, apellido, email }
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'El email ya está registrado' });
      } else {
        res.status(500).json({ error: 'Error al crear usuario' });
      }
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, ubicacion_id, rol_id, activo } = req.body;
    
    try {
      // Construir query dinámicamente para solo actualizar campos proporcionados
      const updates = [];
      const values = [];
      
      if (nombre !== undefined) {
        updates.push('nombre = ?');
        values.push(nombre);
      }
      if (apellido !== undefined) {
        updates.push('apellido = ?');
        values.push(apellido);
      }
      if (email !== undefined) {
        updates.push('email = ?');
        values.push(email);
      }
      if (telefono !== undefined) {
        updates.push('telefono = ?');
        values.push(telefono);
      }
      if (ubicacion_id !== undefined) {
        updates.push('ubicacion_id = ?');
        values.push(ubicacion_id);
      }
      if (rol_id !== undefined) {
        updates.push('rol_id = ?');
        values.push(rol_id);
      }
      if (activo !== undefined) {
        updates.push('activo = ?');
        values.push(activo);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      }
      
      updates.push('updated_at = NOW()');
      values.push(id);
      
      const query = `UPDATE Usuarios SET ${updates.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Obtener el usuario actualizado para devolverlo
      const [updatedUser] = await pool.query(`
        SELECT u.*, r.nombre as rol_nombre
        FROM Usuarios u
        LEFT JOIN Roles r ON u.rol_id = r.id
        WHERE u.id = ?
      `, [id]);
      
      res.json({ 
        id, 
        mensaje: 'Usuario actualizado exitosamente',
        usuario: updatedUser[0]
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'El email ya está registrado' });
      } else {
        res.status(500).json({ error: 'Error al actualizar usuario', detalles: error.message });
      }
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    
    try {
      // Soft delete - marcar como inactivo
      const [result] = await pool.query('UPDATE Usuarios SET activo = 0 WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ mensaje: 'Usuario desactivado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }

  // ============= GESTIÓN DE SERVICIOS =============
  async getAllServices(req, res) {
    try {
      const [servicios] = await pool.query(`
        SELECT s.*, cs.nombre as categoria_nombre
        FROM Servicios s
        LEFT JOIN CategoriasServicios cs ON s.categoria_id = cs.id
        ORDER BY s.created_at DESC
      `);
      res.json(servicios);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      res.status(500).json({ error: 'Error al obtener servicios' });
    }
  }

  async createService(req, res) {
    const { categoria_id, nombre, descripcion, precio_base, duracion_estimada } = req.body;
    
    if (!categoria_id || !nombre || !precio_base || !duracion_estimada) {
      return res.status(400).json({ error: 'Campos requeridos: categoria_id, nombre, precio_base, duracion_estimada' });
    }

    try {
      const [result] = await pool.query(`
        INSERT INTO Servicios (categoria_id, nombre, descripcion, precio_base, duracion_estimada, activo)
        VALUES (?, ?, ?, ?, ?, 1)
      `, [categoria_id, nombre, descripcion, precio_base, duracion_estimada]);
      
      res.status(201).json({
        id: result.insertId,
        mensaje: 'Servicio creado exitosamente',
        servicio: { nombre, precio_base, duracion_estimada }
      });
    } catch (error) {
      console.error('Error al crear servicio:', error);
      res.status(500).json({ error: 'Error al crear servicio' });
    }
  }

  async updateService(req, res) {
    const { id } = req.params;
    const { categoria_id, nombre, descripcion, precio_base, duracion_estimada, activo } = req.body;
    
    try {
      const [result] = await pool.query(`
        UPDATE Servicios SET categoria_id = ?, nombre = ?, descripcion = ?, precio_base = ?, duracion_estimada = ?, activo = ?, updated_at = NOW()
        WHERE id = ?
      `, [categoria_id, nombre, descripcion, precio_base, duracion_estimada, activo, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      res.json({ id, mensaje: 'Servicio actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      res.status(500).json({ error: 'Error al actualizar servicio' });
    }
  }

  async deleteService(req, res) {
    const { id } = req.params;
    
    try {
      const [result] = await pool.query('UPDATE Servicios SET activo = 0 WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      res.json({ mensaje: 'Servicio desactivado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      res.status(500).json({ error: 'Error al eliminar servicio' });
    }
  }

  // ============= GESTIÓN DE UBICACIONES =============
  async getAllUbicaciones(req, res) {
    try {
      const [ubicaciones] = await pool.query(`
        SELECT ub.*, COUNT(r.id) as total_reservas
        FROM Ubicaciones ub
        LEFT JOIN Reservas r ON ub.id = r.ubicacion_servicio_id
        GROUP BY ub.id
        ORDER BY ub.created_at DESC
      `);
      res.json(ubicaciones);
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      res.status(500).json({ error: 'Error al obtener ubicaciones' });
    }
  }

  async createUbicacion(req, res) {
    const { direccion, barrio, localidad, latitud, longitud, zona } = req.body;
    
    if (!direccion || !barrio || !zona) {
      return res.status(400).json({ error: 'Campos requeridos: direccion, barrio, zona' });
    }

    try {
      const [result] = await pool.query(`
        INSERT INTO Ubicaciones (direccion, barrio, localidad, latitud, longitud, zona, activa)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `, [direccion, barrio, localidad, latitud, longitud, zona]);
      
      res.status(201).json({
        id: result.insertId,
        mensaje: 'Ubicación creada exitosamente',
        ubicacion: { direccion, barrio, zona }
      });
    } catch (error) {
      console.error('Error al crear ubicación:', error);
      res.status(500).json({ error: 'Error al crear ubicación' });
    }
  }

  async updateUbicacion(req, res) {
    const { id } = req.params;
    const { direccion, barrio, localidad, latitud, longitud, zona, activa } = req.body;
    
    try {
      const [result] = await pool.query(`
        UPDATE Ubicaciones SET direccion = ?, barrio = ?, localidad = ?, latitud = ?, longitud = ?, zona = ?, activa = ?, updated_at = NOW()
        WHERE id = ?
      `, [direccion, barrio, localidad, latitud, longitud, zona, activa, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ubicación no encontrada' });
      }
      
      res.json({ id, mensaje: 'Ubicación actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar ubicación:', error);
      res.status(500).json({ error: 'Error al actualizar ubicación' });
    }
  }

  async deleteUbicacion(req, res) {
    const { id } = req.params;
    
    try {
      const [result] = await pool.query('UPDATE Ubicaciones SET activa = 0 WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ubicación no encontrada' });
      }
      
      res.json({ mensaje: 'Ubicación desactivada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);
      res.status(500).json({ error: 'Error al eliminar ubicación' });
    }
  }

  // ============= GESTIÓN DE VEHÍCULOS =============
  async getAllVehiculos(req, res) {
    try {
      const [vehiculos] = await pool.query(`
        SELECT v.*, ub.direccion as ubicacion_actual, COUNT(r.id) as servicios_asignados
        FROM Vehiculos v
        LEFT JOIN Ubicaciones ub ON v.ubicacion_actual_id = ub.id
        LEFT JOIN Reservas r ON v.id = r.vehiculo_id
        GROUP BY v.id
        ORDER BY v.created_at DESC
      `);
      res.json(vehiculos);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      res.status(500).json({ error: 'Error al obtener vehículos' });
    }
  }

  async createVehiculo(req, res) {
    const { modelo, placa, capacidad_tanque, ubicacion_actual_id } = req.body;
    
    if (!modelo || !placa || !capacidad_tanque) {
      return res.status(400).json({ error: 'Campos requeridos: modelo, placa, capacidad_tanque' });
    }

    try {
      const [result] = await pool.query(`
        INSERT INTO Vehiculos (modelo, placa, capacidad_tanque, ubicacion_actual_id, activo, en_servicio)
        VALUES (?, ?, ?, ?, 1, 0)
      `, [modelo, placa, capacidad_tanque, ubicacion_actual_id]);
      
      res.status(201).json({
        id: result.insertId,
        mensaje: 'Vehículo creado exitosamente',
        vehiculo: { modelo, placa, capacidad_tanque }
      });
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'La placa ya está registrada' });
      } else {
        res.status(500).json({ error: 'Error al crear vehículo' });
      }
    }
  }

  async updateVehiculo(req, res) {
    const { id } = req.params;
    const { modelo, placa, capacidad_tanque, ubicacion_actual_id, activo, en_servicio } = req.body;
    
    try {
      const [result] = await pool.query(`
        UPDATE Vehiculos SET modelo = ?, placa = ?, capacidad_tanque = ?, ubicacion_actual_id = ?, activo = ?, en_servicio = ?, updated_at = NOW()
        WHERE id = ?
      `, [modelo, placa, capacidad_tanque, ubicacion_actual_id, activo, en_servicio, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      res.json({ id, mensaje: 'Vehículo actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      res.status(500).json({ error: 'Error al actualizar vehículo' });
    }
  }

  async deleteVehiculo(req, res) {
    const { id } = req.params;
    
    try {
      const [result] = await pool.query('UPDATE Vehiculos SET activo = 0 WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      res.json({ mensaje: 'Vehículo desactivado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      res.status(500).json({ error: 'Error al eliminar vehículo' });
    }
  }

  // ============= DATOS AUXILIARES =============
  async getRoles(req, res) {
    try {
      const [roles] = await pool.query('SELECT * FROM Roles ORDER BY nombre');
      res.json(roles);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      res.status(500).json({ error: 'Error al obtener roles' });
    }
  }

  async getCategorias(req, res) {
    try {
      const [categorias] = await pool.query('SELECT * FROM CategoriasServicios ORDER BY nombre');
      res.json(categorias);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }

  async getTiposServicio(req, res) {
    try {
      const [tipos] = await pool.query('SELECT * FROM TiposServicio ORDER BY nombre');
      res.json(tipos);
    } catch (error) {
      console.error('Error al obtener tipos de servicio:', error);
      res.status(500).json({ error: 'Error al obtener tipos de servicio' });
    }
  }

  async getEstadosReserva(req, res) {
    try {
      const [estados] = await pool.query('SELECT * FROM EstadosReserva ORDER BY id');
      res.json(estados);
    } catch (error) {
      console.error('Error al obtener estados de reserva:', error);
      res.status(500).json({ error: 'Error al obtener estados de reserva' });
    }
  }
}

module.exports = new DashboardController();
