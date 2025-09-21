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
        er.nombre as estado_nombre,
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
        er.nombre as estado_nombre,
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
    fecha_servicio, 
    precio_total, 
    estado_id = 1, // Por defecto: 'pendiente'
    observaciones 
  } = req.body;
  
  // Validación de campos básicos según la estructura real
  if (!cliente_id || !servicio_tipo_id || !ubicacion_servicio_id || !fecha_servicio || !precio_total) {
    return res.status(400).json({ 
      error: 'Campos requeridos: cliente_id, servicio_tipo_id, ubicacion_servicio_id, fecha_servicio, precio_total',
      received: { cliente_id, servicio_tipo_id, ubicacion_servicio_id, fecha_servicio, precio_total }
    });
  }

  // Validación de formato de fecha
  const fechaServicio = new Date(fecha_servicio);
  if (isNaN(fechaServicio.getTime())) {
    return res.status(400).json({ error: 'Formato de fecha_servicio inválido. Use formato ISO: YYYY-MM-DDTHH:MM:SS' });
  }

  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Validar que el cliente exista y tenga rol de cliente
    const [clienteRows] = await connection.query(
      'SELECT id, nombre, apellido, email, telefono FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "cliente")', 
      [cliente_id]
    );
    
    if (clienteRows.length === 0) {
      throw new Error(`Cliente con ID ${cliente_id} no encontrado o no tiene rol de cliente`);
    }
    
    // Validar que el técnico exista si se especifica
    if (tecnico_id) {
      const [tecnicoRows] = await connection.query(
        'SELECT id FROM Usuarios WHERE id = ? AND rol_id = (SELECT id FROM Roles WHERE nombre = "tecnico")', 
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
    const [tipoServicioRows] = await connection.query('SELECT id, nombre, multiplicador_precio FROM TiposServicio WHERE id = ?', [servicio_tipo_id]);
    if (tipoServicioRows.length === 0) {
      throw new Error(`Tipo de servicio con ID ${servicio_tipo_id} no encontrado`);
    }
    
    // Validar que la ubicación exista
    const [ubicacionRows] = await connection.query('SELECT id FROM Ubicaciones WHERE id = ?', [ubicacion_servicio_id]);
    if (ubicacionRows.length === 0) {
      throw new Error(`Ubicación con ID ${ubicacion_servicio_id} no encontrada`);
    }
    
    // Validar que el vehículo exista si se especifica
    if (vehiculo_id) {
      const [vehiculoRows] = await connection.query('SELECT id, modelo, placa FROM Vehiculos WHERE id = ? AND activo = 1', [vehiculo_id]);
      if (vehiculoRows.length === 0) {
        throw new Error(`Vehículo con ID ${vehiculo_id} no encontrado o inactivo`);
      }
    }
    
    // Verificar disponibilidad del técnico en la fecha/hora (si se especifica técnico)
    if (tecnico_id) {
      const [reservasConflicto] = await connection.query(
        'SELECT id FROM Reservas WHERE tecnico_id = ? AND fecha_servicio = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE nombre IN ("completada", "cancelada"))',
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
        vehiculo_id || null, 
        servicio_tipo_id, 
        ubicacion_servicio_id, 
        fecha_servicio, 
        precio_total, 
        estado_id, 
        observaciones || null
      ]
    );
    
    const reservaId = result.insertId;
    
    await connection.commit();
    
    // Enviar correo de confirmación (fuera de la transacción)
    const clienteData = clienteRows[0];
    const tipoServicioData = tipoServicioRows[0];
    
    if (clienteData && clienteData.email) {
      try {
        const fechaFormateada = new Date(fecha_servicio).toLocaleString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'yeygok777@gmail.com',
          to: clienteData.email,
          subject: 'Confirmación de Reserva - Lavado Vapor Bogotá',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2c3e50;">¡Tu reserva ha sido confirmada!</h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #34495e;">Detalles de tu reserva:</h3>
                <p><strong>🏷️ ID de Reserva:</strong> ${reservaId}</p>
                <p><strong>� Cliente:</strong> ${clienteData.nombre} ${clienteData.apellido}</p>
                <p><strong>� Fecha y Hora:</strong> ${fechaFormateada}</p>
                <p><strong>🚿 Tipo de Servicio:</strong> ${tipoServicioData.nombre}</p>
                <p><strong>💰 Precio Total:</strong> $${parseFloat(precio_total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
                ${observaciones ? `<p><strong>📝 Observaciones:</strong> ${observaciones}</p>` : ''}
              </div>
              <p style="color: #27ae60; font-weight: bold; text-align: center; font-size: 18px;">¡Gracias por confiar en Lavado Vapor Bogotá!</p>
              <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #856404; margin: 0;"><strong>Nota:</strong> Guarda este correo como comprobante de tu reserva. Nos pondremos en contacto contigo para confirmar los detalles.</p>
              </div>
            </div>
          `
        });
        console.log(`Correo de confirmación enviado a: ${clienteData.email}`);
      } catch (emailError) {
        console.error('Error al enviar correo de confirmación:', emailError.message);
        // No fallar la respuesta si el correo falla
      }
    }
    
    res.status(201).json({ 
      id: reservaId,
      mensaje: 'Reserva creada exitosamente',
      cliente: `${clienteData.nombre} ${clienteData.apellido}`,
      fecha_servicio: fecha_servicio,
      precio_total: precio_total,
      tipo_servicio: tipoServicioData.nombre
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear reserva:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Respuesta de error más específica
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    } else if (error.message.includes('ya tiene una reserva')) {
      return res.status(409).json({ error: error.message });
    } else if (error.message.includes('formato') || error.message.includes('inválido')) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Error interno al crear reserva' });
    }
  } finally {
    connection.release();
  }
};

const updateAgendamiento = async (req, res) => {
  const { 
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
  
  if (!servicio_tipo_id || !ubicacion_servicio_id || !fecha_servicio || !precio_total || !estado_id) {
    return res.status(400).json({ 
      error: 'Campos requeridos: servicio_tipo_id, ubicacion_servicio_id, fecha_servicio, precio_total, estado_id' 
    });
  }
  
  try {
    const [result] = await pool.query(
      `UPDATE Reservas SET 
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
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json({ 
      id: req.params.id, 
      mensaje: 'Reserva actualizada exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar reserva:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al actualizar reserva' });
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
      'SELECT id, fecha_servicio FROM Reservas WHERE fecha_servicio = ? AND cliente_id = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE nombre IN ("completada", "cancelada"))',
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
        'SELECT id FROM Reservas WHERE fecha_servicio = ? AND tecnico_id = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE nombre IN ("completada", "cancelada"))',
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
      'SELECT COUNT(*) as total FROM Reservas WHERE fecha_servicio = ? AND estado_id NOT IN (SELECT id FROM EstadosReserva WHERE nombre IN ("completada", "cancelada"))',
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
        er.nombre as estado_nombre,
        er.descripcion as estado_descripcion,
        ts.nombre as tipo_servicio,
        ts.descripcion as tipo_servicio_descripcion,
        ts.multiplicador_precio,
        v.modelo as vehiculo_modelo,
        v.placa as vehiculo_placa,
        v.capacidad_tanque,
        ub.nombre as ubicacion_nombre,
        ub.direccion as ubicacion_direccion,
        ub.barrio as ubicacion_barrio,
        ub.ciudad as ubicacion_ciudad
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
    
    // Obtener servicios relacionados (si existe tabla de relación)
    let servicios = [];
    try {
      const [serviciosData] = await pool.query(`
        SELECT 
          s.id,
          s.nombre,
          s.descripcion,
          s.precio_base,
          s.duracion_estimada,
          cs.nombre as categoria
        FROM Servicios s
        LEFT JOIN CategoriasServicios cs ON s.categoria_id = cs.id
        WHERE s.activo = 1
        LIMIT 5
      `);
      servicios = serviciosData;
    } catch (error) {
      console.log('No se pudieron obtener servicios relacionados:', error.message);
    }
    
    // Calcular costo con multiplicador
    const costoBase = parseFloat(reserva.precio_total) || 0;
    const multiplicador = parseFloat(reserva.multiplicador_precio) || 1;
    const costoFinal = costoBase * multiplicador;
    
    const response = {
      ...reserva,
      servicios: servicios,
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
        nombre: reserva.ubicacion_nombre,
        direccion: reserva.ubicacion_direccion,
        barrio: reserva.ubicacion_barrio,
        ciudad: reserva.ubicacion_ciudad
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error al obtener detalle de reserva:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error al obtener detalle de reserva' });
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
};
