const pool = require('../config/db');
const emailService = require('../services/emailService');

const getAllAgendamientos = async (req, res) => {
  try {
    // Consulta optimizada con JOINs usando nombres reales de tablas
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        uc.id as cliente_id,
        uc.nombre as cliente_nombre,
        uc.apellido as cliente_apellido,
        uc.email as cliente_email,
        uc.telefono as cliente_telefono,
        ut.nombre as tecnico_nombre,
        ut.apellido as tecnico_apellido,
        er.estado as estado_nombre,
        ts.nombre as tipo_servicio,
        ts.multiplicador_precio,
        v.modelo as vehiculo_modelo,
        v.placa as vehiculo_placa
      FROM Reservas r
      LEFT JOIN Usuarios uc ON r.cliente_id = uc.id
      LEFT JOIN Usuarios ut ON r.tecnico_id = ut.id
      LEFT JOIN EstadosReserva er ON r.estado_id = er.id
      LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
      LEFT JOIN Vehiculos v ON r.vehiculo_id = v.id
      ORDER BY r.fecha_servicio DESC, r.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener reservas:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const getAgendamientoById = async (req, res) => {
  try {
    // Consulta con JOIN para obtener información completa de la reserva
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        uc.nombre as cliente_nombre,
        uc.apellido as cliente_apellido,
        uc.email as cliente_email,
        uc.telefono as cliente_telefono,
        ut.nombre as tecnico_nombre,
        ut.apellido as tecnico_apellido,
        er.estado as estado_nombre,
        ts.nombre as tipo_servicio,
        ts.descripcion as tipo_servicio_descripcion,
        ts.multiplicador_precio,
        v.modelo as vehiculo_modelo,
        v.placa as vehiculo_placa
      FROM Reservas r
      LEFT JOIN Usuarios uc ON r.cliente_id = uc.id
      LEFT JOIN Usuarios ut ON r.tecnico_id = ut.id
      LEFT JOIN EstadosReserva er ON r.estado_id = er.id
      LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
      LEFT JOIN Vehiculos v ON r.vehiculo_id = v.id
      WHERE r.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener reserva:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
};

const createAgendamiento = async (req, res) => {
  const { 
    cliente_id, 
    tecnico_id, 
    vehiculo_id, 
    servicio_tipo_id, 
    ubicacion_servicio_id, 
    ubicacion, // Nuevo: datos de ubicación si no existe el ID
    vehiculo, // Nuevo: datos de vehículo si no existe el ID
    fecha_servicio, 
    precio_total, 
    estado_id = 1, // Por defecto: 'pendiente'
    observaciones 
  } = req.body;
  
  // Validación de campos básicos según la estructura real
  if (!cliente_id || !servicio_tipo_id || !fecha_servicio || !precio_total) {
    return res.status(400).json({ 
      error: 'Campos requeridos: cliente_id, servicio_tipo_id, fecha_servicio, precio_total',
      received: { cliente_id, servicio_tipo_id, fecha_servicio, precio_total }
    });
  }
  
  // Si no hay ubicacion_servicio_id, debe haber datos de ubicacion
  if (!ubicacion_servicio_id && !ubicacion) {
    return res.status(400).json({ 
      error: 'Debe proporcionar ubicacion_servicio_id o datos de ubicacion (direccion, barrio, localidad)',
    });
  }

  // Validación de formato de fecha
  const fechaServicio = new Date(fecha_servicio);
  if (isNaN(fechaServicio.getTime())) {
    return res.status(400).json({ error: 'Formato de fecha_servicio inválido. Use formato ISO: YYYY-MM-DDTHH:MM:SS' });
  }
  
  // Convertir a formato MySQL: YYYY-MM-DD HH:MM:SS
  const mysqlFechaServicio = fechaServicio.toISOString().slice(0, 19).replace('T', ' ');

  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Validar que el cliente exista y tenga rol de cliente
    const [clienteRows] = await connection.query(
      'SELECT id, nombre, apellido, email, telefono FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "cliente")', 
      [cliente_id]
    );
    
    if (clienteRows.length === 0) {
      // Verificar si el usuario existe pero con otro rol
      const [usuarioRows] = await connection.query('SELECT id, rol_id FROM Usuarios WHERE id = ?', [cliente_id]);
      if (usuarioRows.length === 0) {
        throw new Error(`Usuario con ID ${cliente_id} no existe en la base de datos`);
      } else {
        const [rolRows] = await connection.query('SELECT nombre FROM Roles WHERE id = ?', [usuarioRows[0].rol_id]);
        throw new Error(`Usuario con ID ${cliente_id} existe pero tiene rol "${rolRows[0].nombre}" en lugar de "cliente"`);
      }
    }
    
    // Validar que el técnico exista si se especifica
    if (tecnico_id) {
      const [tecnicoRows] = await connection.query(
        'SELECT id, nombre, apellido, email, telefono FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "tecnico")', 
        [tecnico_id]
      );
      if (tecnicoRows.length === 0) {
        throw new Error(`Técnico con ID ${tecnico_id} no encontrado o no tiene rol de técnico`);
      }
    }
    
    // Validar que el estado exista
    const [estadoRows] = await connection.query('SELECT id FROM EstadosReserva WHERE id = ?', [estado_id]);
    if (estadoRows.length === 0) {
      throw new Error(`Estado con ID ${estado_id} no encontrado`);
    }
    
    // Validar que el tipo de servicio exista
    const [tipoServicioRows] = await connection.query('SELECT id, nombre, multiplicador_precio, descripcion FROM TiposServicio WHERE id = ?', [servicio_tipo_id]);
    if (tipoServicioRows.length === 0) {
      throw new Error(`Tipo de servicio con ID ${servicio_tipo_id} no encontrado`);
    }
    
    // Crear o validar ubicación
    let ubicacionId = ubicacion_servicio_id;
    let ubicacionData = null;
    
    if (!ubicacionId && ubicacion) {
      // Crear nueva ubicación
      const [ubicacionResult] = await connection.query(
        'INSERT INTO Ubicaciones (direccion, barrio, localidad, zona, activa) VALUES (?, ?, ?, ?, 1)',
        [ubicacion.direccion, ubicacion.barrio, ubicacion.localidad, ubicacion.zona || 'norte']
      );
      ubicacionId = ubicacionResult.insertId;
      console.log(`✅ Nueva ubicación creada con ID: ${ubicacionId}`);
      
      // Obtener los datos de la ubicación recién creada
      const [ubicacionRows] = await connection.query(
        'SELECT id, direccion, barrio, localidad, zona FROM Ubicaciones WHERE id = ?', 
        [ubicacionId]
      );
      ubicacionData = ubicacionRows[0];
    } else if (ubicacionId) {
      // Validar que la ubicación exista
      const [ubicacionRows] = await connection.query('SELECT id, direccion, barrio, localidad, zona FROM Ubicaciones WHERE id = ? AND activa = 1', [ubicacionId]);
      if (ubicacionRows.length === 0) {
        throw new Error(`Ubicación con ID ${ubicacionId} no encontrada o inactiva`);
      }
      ubicacionData = ubicacionRows[0];
    }
    
    // Crear o validar vehículo (si aplica)
    let vehiculoId = vehiculo_id;
    if (!vehiculoId && vehiculo && vehiculo.modelo && vehiculo.placa) {
      // Verificar si ya existe un vehículo con esa placa
      const [vehiculoExistente] = await connection.query(
        'SELECT id FROM Vehiculos WHERE placa = ? AND activo = 1',
        [vehiculo.placa]
      );
      
      if (vehiculoExistente.length > 0) {
        vehiculoId = vehiculoExistente[0].id;
        console.log(`✅ Vehículo existente encontrado con ID: ${vehiculoId}`);
      } else {
        // Crear nuevo vehículo
        const [vehiculoResult] = await connection.query(
          'INSERT INTO Vehiculos (modelo, placa, cliente_id, activo) VALUES (?, ?, ?, 1)',
          [vehiculo.modelo, vehiculo.placa, cliente_id]
        );
        vehiculoId = vehiculoResult.insertId;
        console.log(`✅ Nuevo vehículo creado con ID: ${vehiculoId}`);
      }
    } else if (vehiculoId) {
      // Validar que el vehículo exista
      const [vehiculoRows] = await connection.query('SELECT id, modelo, placa FROM Vehiculos WHERE id = ? AND activo = 1', [vehiculoId]);
      if (vehiculoRows.length === 0) {
        throw new Error(`Vehículo con ID ${vehiculoId} no encontrado o inactivo`);
      }
    }
    
    // Verificar disponibilidad del técnico en la fecha/hora (si se especifica técnico)
    if (tecnico_id) {
      const [reservasConflicto] = await connection.query(
        'SELECT id FROM Reservas WHERE tecnico_id = ? AND fecha_servicio = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE estado IN ("completada", "cancelada"))',
        [tecnico_id, fecha_servicio]
      );
      
      if (reservasConflicto.length > 0) {
        throw new Error('El técnico ya tiene una reserva asignada en esa fecha y hora');
      }
    }
    
    // Crear la reserva principal
    const [result] = await connection.query(
      `INSERT INTO Reservas (
        cliente_id, 
        tecnico_id, 
        vehiculo_id, 
        servicio_tipo_id, 
        ubicacion_servicio_id, 
        fecha_reserva,
        fecha_servicio, 
        precio_total, 
        estado_id, 
        observaciones
      ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
      [
        cliente_id, 
        tecnico_id || null, 
        vehiculoId || null, 
        servicio_tipo_id, 
        ubicacionId, 
        mysqlFechaServicio, // ✅ Usar formato MySQL
        precio_total, 
        estado_id, 
        observaciones || null
      ]
    );
    
    const reservaId = result.insertId;
    
    await connection.commit();
    
    // Preparar datos para emails
    const clienteData = clienteRows[0];
    const tipoServicioData = tipoServicioRows[0];
    
    let tecnicoData = null;
    if (tecnico_id) {
      const [tecnicoQuery] = await connection.query(
        'SELECT nombre, apellido, email, telefono FROM Usuarios WHERE id = ?', 
        [tecnico_id]
      );
      tecnicoData = tecnicoQuery[0];
    }
    
    // Enviar correos de notificación usando el nuevo servicio
    try {
      const reservaData = {
        cliente: clienteData,
        reserva: {
          id: reservaId,
          fecha_servicio: mysqlFechaServicio, // ✅ Usar formato MySQL
          precio_total: precio_total,
          observaciones: observaciones,
          estado: 'pendiente'
        },
        servicio: {
          tipo: tipoServicioData.nombre,
          descripcion: tipoServicioData.descripcion || 'Servicio de limpieza con vapor profesional'
        },
        ubicacion: ubicacionData,
        tecnico: tecnicoData
      };

      // Email de confirmación al cliente
      const emailResult = await emailService.sendReservaConfirmation(reservaData);
      if (emailResult.success) {
        console.log(`✅ Email de confirmación enviado a: ${clienteData.email}`);
      } else {
        console.log(`❌ Error enviando email de confirmación: ${emailResult.error}`);
      }
      
      // Email al técnico si está asignado
      if (tecnicoData && tecnicoData.email) {
        const tecnicoEmailResult = await emailService.sendTecnicoNotification(reservaData);
        if (tecnicoEmailResult.success) {
          console.log(`✅ Email de notificación enviado al técnico: ${tecnicoData.email}`);
        } else {
          console.log(`❌ Error enviando email al técnico: ${tecnicoEmailResult.error}`);
        }
      }
      
    } catch (emailError) {
      console.error('❌ Error al enviar emails de notificación:', emailError.message);
      // No fallar la respuesta si los correos fallan
    }
    
    res.status(201).json({ 
      id: reservaId,
      mensaje: 'Reserva creada exitosamente y emails enviados',
      cliente: `${clienteData.nombre} ${clienteData.apellido}`,
      fecha_servicio: mysqlFechaServicio, // ✅ Usar formato MySQL
      precio_total: precio_total,
      tipo_servicio: tipoServicioData.nombre,
      ubicacion: `${ubicacionData.direccion}, ${ubicacionData.barrio}`,
      tecnico: tecnicoData ? `${tecnicoData.nombre} ${tecnicoData.apellido}` : 'Por asignar'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error al crear reserva:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Respuesta de error más específica
    if (error.message.includes('no encontrado') || error.message.includes('no existe')) {
      return res.status(404).json({ error: error.message });
    } else if (error.message.includes('ya tiene una reserva')) {
      return res.status(409).json({ error: error.message });
    } else if (error.message.includes('formato') || error.message.includes('inválido')) {
      return res.status(400).json({ error: error.message });
    } else if (error.message.includes('tiene rol')) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ 
        error: 'Error interno al crear reserva',
        detalle: error.message,
        stack: error.stack
      });
    }
  } finally {
    connection.release();
  }
};

const updateAgendamiento = async (req, res) => {
  const { 
    cliente_id,
    tecnico_id, 
    vehiculo_id, 
    servicio_tipo_id, 
    ubicacion_servicio_id, 
    fecha_servicio, 
    precio_total, 
    estado_id, 
    observaciones,
    notas_tecnico 
  } = req.body;
  
  // Validación de campos requeridos
  if (!servicio_tipo_id || !ubicacion_servicio_id || !fecha_servicio || !precio_total || !estado_id) {
    return res.status(400).json({ 
      error: 'Campos requeridos: servicio_tipo_id, ubicacion_servicio_id, fecha_servicio, precio_total, estado_id',
      received: { servicio_tipo_id, ubicacion_servicio_id, fecha_servicio, precio_total, estado_id }
    });
  }

  // Validación de formato de fecha
  const fechaServicio = new Date(fecha_servicio);
  if (isNaN(fechaServicio.getTime())) {
    return res.status(400).json({ error: 'Formato de fecha_servicio inválido. Use formato ISO: YYYY-MM-DDTHH:MM:SS' });
  }
  
  const connection = await pool.getConnection();
  
  try {
    // Obtener estado anterior para notificaciones
    const [reservaAnterior] = await connection.query(`
      SELECT r.*, er.estado as estado_anterior, 
             uc.email as cliente_email, uc.nombre as cliente_nombre, uc.apellido as cliente_apellido,
             ut.email as tecnico_email, ut.nombre as tecnico_nombre, ut.apellido as tecnico_apellido
      FROM Reservas r 
      LEFT JOIN EstadosReserva er ON r.estado_id = er.id
      LEFT JOIN Usuarios uc ON r.cliente_id = uc.id
      LEFT JOIN Usuarios ut ON r.tecnico_id = ut.id
      WHERE r.id = ?
    `, [req.params.id]);
    
    if (reservaAnterior.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    await connection.beginTransaction();

    // Validar que la reserva exista
    if (reservaAnterior.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Validar que el estado exista
    const [estadoRows] = await connection.query('SELECT id, estado FROM EstadosReserva WHERE id = ?', [estado_id]);
    if (estadoRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: `Estado con ID ${estado_id} no encontrado` });
    }

    // Validar que el tipo de servicio exista
    const [tipoServicioRows] = await connection.query('SELECT id FROM TiposServicio WHERE id = ?', [servicio_tipo_id]);
    if (tipoServicioRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: `Tipo de servicio con ID ${servicio_tipo_id} no encontrado` });
    }

    // Validar que la ubicación exista
    const [ubicacionRows] = await connection.query('SELECT id FROM Ubicaciones WHERE id = ? AND activa = 1', [ubicacion_servicio_id]);
    if (ubicacionRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: `Ubicación con ID ${ubicacion_servicio_id} no encontrada o inactiva` });
    }

    // Validar que el técnico exista si se especifica
    if (tecnico_id) {
      const [tecnicoRows] = await connection.query(
        'SELECT id FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "tecnico")', 
        [tecnico_id]
      );
      if (tecnicoRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: `Técnico con ID ${tecnico_id} no encontrado o no tiene rol de técnico` });
      }
    }

    // Validar que el vehículo exista si se especifica
    if (vehiculo_id) {
      const [vehiculoRows] = await connection.query('SELECT id FROM Vehiculos WHERE id = ? AND activo = 1', [vehiculo_id]);
      if (vehiculoRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: `Vehículo con ID ${vehiculo_id} no encontrado o inactivo` });
      }
    }

    // Actualizar la reserva
    const [result] = await connection.query(
      `UPDATE Reservas SET 
        cliente_id = COALESCE(?, cliente_id),
        tecnico_id = ?, 
        vehiculo_id = ?, 
        servicio_tipo_id = ?, 
        ubicacion_servicio_id = ?, 
        fecha_servicio = ?, 
        precio_total = ?, 
        estado_id = ?, 
        observaciones = ?,
        notas_tecnico = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        cliente_id || null,
        tecnico_id || null, 
        vehiculo_id || null, 
        servicio_tipo_id, 
        ubicacion_servicio_id, 
        fecha_servicio, 
        precio_total, 
        estado_id, 
        observaciones || null,
        notas_tecnico || null,
        req.params.id
      ]
    );
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Error al actualizar la reserva' });
    }

    await connection.commit();
    console.log(`✅ Reserva ${req.params.id} actualizada exitosamente`);
    
    // Obtener nuevo estado para notificaciones
    const nuevoEstado = estadoRows[0];
    
    // Enviar notificación de cambio de estado si cambió
    if (reservaAnterior[0].estado_id !== estado_id && reservaAnterior[0].cliente_email) {
      try {
        const reservaData = {
          cliente: {
            nombre: reservaAnterior[0].cliente_nombre,
            apellido: reservaAnterior[0].cliente_apellido,
            email: reservaAnterior[0].cliente_email
          },
          reserva: {
            id: req.params.id,
            fecha_servicio: fecha_servicio,
            precio_total: precio_total
          },
          tecnico: tecnico_id && reservaAnterior[0].tecnico_nombre ? {
            nombre: reservaAnterior[0].tecnico_nombre,
            apellido: reservaAnterior[0].tecnico_apellido,
            telefono: reservaAnterior[0].tecnico_telefono
          } : null
        };
        
        await emailService.sendStatusUpdate(
          reservaData, 
          nuevoEstado.estado, 
          reservaAnterior[0].estado_anterior
        );
        console.log(`✅ Email de actualización enviado por cambio de estado`);
        
      } catch (emailError) {
        console.error('❌ Error enviando email de actualización:', emailError.message);
      }
    }
    
    res.json({ 
      id: req.params.id, 
      mensaje: 'Reserva actualizada exitosamente',
      estado_anterior: reservaAnterior[0].estado_anterior,
      estado_nuevo: nuevoEstado.estado,
      campos_actualizados: {
        cliente_id: cliente_id || reservaAnterior[0].cliente_id,
        tecnico_id: tecnico_id || null,
        vehiculo_id: vehiculo_id || null,
        servicio_tipo_id,
        ubicacion_servicio_id,
        fecha_servicio,
        precio_total,
        estado_id
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error al actualizar reserva:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Respuesta de error más específica
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    } else if (error.message.includes('formato') || error.message.includes('inválido')) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ 
        error: 'Error interno al actualizar reserva',
        detalle: error.message 
      });
    }
  } finally {
    connection.release();
  }
};

const deleteAgendamiento = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Reservas WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar reserva:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
};

// Endpoint para consultar disponibilidad de fecha/hora
const checkDisponibilidad = async (req, res) => {
  const { fecha_servicio, tecnico_id, cliente_id } = req.query;
  
  if (!fecha_servicio || !cliente_id) {
    return res.status(400).json({ 
      error: 'Campos requeridos: fecha_servicio, cliente_id',
      received: { fecha_servicio, tecnico_id, cliente_id }
    });
  }
  
  // Validación de formato de fecha
  const fechaServicio = new Date(fecha_servicio);
  if (isNaN(fechaServicio.getTime())) {
    return res.status(400).json({ error: 'Formato de fecha_servicio inválido. Use formato ISO: YYYY-MM-DDTHH:MM:SS' });
  }
  
  try {
    // Verificar que el cliente exista
    const [clienteExists] = await pool.query(
      'SELECT id FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "cliente")', 
      [cliente_id]
    );
    if (clienteExists.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Verificar disponibilidad para el cliente específico
    const [reservasCliente] = await pool.query(
      'SELECT id, fecha_servicio FROM Reservas WHERE fecha_servicio = ? AND cliente_id = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE estado IN ("completada", "cancelada"))',
      [fecha_servicio, cliente_id]
    );
    
    if (reservasCliente.length > 0) {
      return res.json({ 
        disponible: false, 
        mensaje: 'No disponible - Ya tienes una reserva en este horario',
        reserva_existente: reservasCliente[0].id
      });
    }
    
    // Si se especifica técnico, verificar su disponibilidad
    if (tecnico_id) {
      const [tecnicoExists] = await pool.query(
        'SELECT id FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "tecnico")', 
        [tecnico_id]
      );
      if (tecnicoExists.length === 0) {
        return res.status(404).json({ error: 'Técnico no encontrado' });
      }
      
      const [reservasTecnico] = await pool.query(
        'SELECT id FROM Reservas WHERE fecha_servicio = ? AND tecnico_id = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE estado IN ("completada", "cancelada"))',
        [fecha_servicio, tecnico_id]
      );
      
      if (reservasTecnico.length > 0) {
        return res.json({ 
          disponible: false, 
          mensaje: 'No disponible - El técnico ya tiene una reserva asignada en este horario',
          tecnico_ocupado: true
        });
      }
    }
    
    // Verificar capacidad general del horario
    const [totalReservas] = await pool.query(
      'SELECT COUNT(*) as total FROM Reservas WHERE fecha_servicio = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE estado IN ("completada", "cancelada"))',
      [fecha_servicio]
    );
    
    // Límite de reservas simultáneas (ajustar según capacidad del negocio)
    const LIMITE_RESERVAS_SIMULTANEAS = 10;
    
    if (totalReservas[0].total >= LIMITE_RESERVAS_SIMULTANEAS) {
      return res.json({ 
        disponible: false, 
        mensaje: 'No disponible - Capacidad máxima alcanzada para este horario',
        reservas_programadas: totalReservas[0].total
      });
    }
    
    res.json({ 
      disponible: true, 
      mensaje: 'Horario disponible',
      reservas_programadas: totalReservas[0].total,
      capacidad_restante: LIMITE_RESERVAS_SIMULTANEAS - totalReservas[0].total
    });
    
  } catch (error) {
    console.error('Error al consultar disponibilidad:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
};

// Endpoint para obtener detalle completo de una reserva
const getAgendamientoDetalle = async (req, res) => {
  const { id } = req.params;
  try {
    // Reserva principal con toda la información relacionada
    const [reservas] = await pool.query(`
      SELECT 
        r.*,
        uc.nombre as cliente_nombre,
        uc.apellido as cliente_apellido,
        uc.email as cliente_email,
        uc.telefono as cliente_telefono,
        ut.nombre as tecnico_nombre,
        ut.apellido as tecnico_apellido,
        ut.email as tecnico_email,
        er.estado as estado_nombre,
        er.descripcion as estado_descripcion,
        ts.nombre as tipo_servicio,
        ts.descripcion as tipo_servicio_descripcion,
        ts.multiplicador_precio,
        v.modelo as vehiculo_modelo,
        v.placa as vehiculo_placa,
        v.capacidad_tanque,
        ub.direccion as ubicacion_direccion,
        ub.barrio as ubicacion_barrio,
        ub.localidad as ubicacion_localidad,
        ub.zona as ubicacion_zona
      FROM Reservas r
      LEFT JOIN Usuarios uc ON r.cliente_id = uc.id
      LEFT JOIN Usuarios ut ON r.tecnico_id = ut.id
      LEFT JOIN EstadosReserva er ON r.estado_id = er.id
      LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
      LEFT JOIN Vehiculos v ON r.vehiculo_id = v.id
      LEFT JOIN Ubicaciones ub ON r.ubicacion_servicio_id = ub.id
      WHERE r.id = ?
    `, [id]);
    
    if (reservas.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    const reserva = reservas[0];
    
    // Calcular costo con multiplicador
    const costoBase = parseFloat(reserva.precio_total) || 0;
    const multiplicador = parseFloat(reserva.multiplicador_precio) || 1;
    const costoFinal = costoBase * multiplicador;
    
    const response = {
      ...reserva,
      costo_calculado: {
        base: costoBase,
        multiplicador: multiplicador,
        total: costoFinal
      },
      cliente: {
        id: reserva.cliente_id,
        nombre: reserva.cliente_nombre,
        apellido: reserva.cliente_apellido,
        email: reserva.cliente_email,
        telefono: reserva.cliente_telefono
      },
      tecnico: reserva.tecnico_id ? {
        id: reserva.tecnico_id,
        nombre: reserva.tecnico_nombre,
        apellido: reserva.tecnico_apellido,
        email: reserva.tecnico_email
      } : null,
      vehiculo: reserva.vehiculo_id ? {
        id: reserva.vehiculo_id,
        modelo: reserva.vehiculo_modelo,
        placa: reserva.vehiculo_placa,
        capacidad_tanque: reserva.capacidad_tanque
      } : null,
      ubicacion: {
        id: reserva.ubicacion_servicio_id,
        direccion: reserva.ubicacion_direccion,
        barrio: reserva.ubicacion_barrio,
        localidad: reserva.ubicacion_localidad,
        zona: reserva.ubicacion_zona
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error al obtener detalle de reserva:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al obtener detalle de reserva' });
  }
};

// Endpoint para test de emails
const testEmail = async (req, res) => {
  try {
    const testResult = await emailService.testConnection();
    res.json({
      mensaje: 'Test de conexión de email',
      resultado: testResult
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error en test de email',
      detalle: error.message
    });
  }
};

// Endpoint para obtener reservas de un cliente específico
const getReservasByCliente = async (req, res) => {
  const { clienteId } = req.params;
  
  try {
    // Verificar que el cliente exista
    const [clienteExists] = await pool.query(
      'SELECT id FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "cliente")',
      [clienteId]
    );
    
    if (clienteExists.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Obtener todas las reservas del cliente con información completa
    const [reservas] = await pool.query(`
      SELECT 
        r.*,
        uc.nombre as cliente_nombre,
        uc.apellido as cliente_apellido,
        uc.email as cliente_email,
        uc.telefono as cliente_telefono,
        ut.nombre as tecnico_nombre,
        ut.apellido as tecnico_apellido,
        ut.telefono as tecnico_telefono,
        er.estado as estado_nombre,
        er.descripcion as estado_descripcion,
        ts.nombre as tipo_servicio,
        ts.descripcion as tipo_servicio_descripcion,
        ts.multiplicador_precio,
        v.modelo as vehiculo_modelo,
        v.placa as vehiculo_placa,
        ub.direccion as ubicacion_direccion,
        ub.barrio as ubicacion_barrio,
        ub.localidad as ubicacion_localidad,
        ub.zona as ubicacion_zona
      FROM Reservas r
      LEFT JOIN Usuarios uc ON r.cliente_id = uc.id
      LEFT JOIN Usuarios ut ON r.tecnico_id = ut.id
      LEFT JOIN EstadosReserva er ON r.estado_id = er.id
      LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
      LEFT JOIN Vehiculos v ON r.vehiculo_id = v.id
      LEFT JOIN Ubicaciones ub ON r.ubicacion_servicio_id = ub.id
      WHERE r.cliente_id = ?
      ORDER BY r.fecha_servicio DESC, r.created_at DESC
    `, [clienteId]);
    
    console.log(`✅ ${reservas.length} reservas encontradas para cliente ${clienteId}`);
    res.json(reservas);
    
  } catch (error) {
    console.error('Error al obtener reservas del cliente:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al obtener reservas del cliente' });
  }
};

module.exports = {
  getAllAgendamientos,
  getAgendamientoById,
  createAgendamiento,
  updateAgendamiento,
  deleteAgendamiento,
  checkDisponibilidad,
  getAgendamientoDetalle,
  getReservasByCliente,
  testEmail
};
