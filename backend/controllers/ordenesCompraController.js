const pool = require('../config/db');

// ============================================
// ORDENES DE COMPRA CONTROLLER
// ============================================

// GET /ordenes-compra - PRIVADO (Admin: todas, Cliente: solo sus órdenes)
const getAllOrdenes = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const es_admin = req.user.rol_nombre === 'admin';

    let query = `
      SELECT 
        oc.*,
        r.cliente_id,
        CONCAT(u.nombre, ' ', u.apellido) as cliente_nombre,
        r.fecha_servicio,
        s.nombre as servicio_nombre
      FROM OrdenesCompra oc
      LEFT JOIN Reservas r ON oc.reserva_id = r.id
      LEFT JOIN Usuarios u ON r.cliente_id = u.id
      LEFT JOIN ServiciosTipos st ON r.servicio_tipo_id = st.id
      LEFT JOIN Servicios s ON st.servicio_id = s.id
    `;

    // Si no es admin, filtrar solo sus órdenes
    if (!es_admin) {
      query += ` WHERE r.cliente_id = ?`;
    }

    query += ` ORDER BY oc.created_at DESC`;

    const [ordenes] = es_admin 
      ? await pool.query(query)
      : await pool.query(query, [usuario_id]);

    res.json(ordenes);
  } catch (error) {
    console.error('Error en getAllOrdenes:', error.message);
    res.status(500).json({ error: 'Error al obtener órdenes de compra' });
  }
};

// GET /ordenes-compra/:id - PRIVADO (Admin o cliente propietario)
const getOrdenById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;
    const es_admin = req.user.rol_nombre === 'admin';

    const [orden] = await pool.query(`
      SELECT 
        oc.*,
        r.cliente_id,
        CONCAT(u.nombre, ' ', u.apellido) as cliente_nombre,
        u.email as cliente_email,
        r.fecha_servicio,
        r.observaciones,
        s.nombre as servicio_nombre,
        ts.nombre as tipo_servicio
      FROM OrdenesCompra oc
      LEFT JOIN Reservas r ON oc.reserva_id = r.id
      LEFT JOIN Usuarios u ON r.cliente_id = u.id
      LEFT JOIN ServiciosTipos st ON r.servicio_tipo_id = st.id
      LEFT JOIN Servicios s ON st.servicio_id = s.id
      LEFT JOIN TiposServicio ts ON st.tipo_id = ts.id
      WHERE oc.id = ?
    `, [id]);

    if (orden.length === 0) {
      return res.status(404).json({ error: 'Orden de compra no encontrada' });
    }

    // Verificar permisos
    if (!es_admin && orden[0].cliente_id !== usuario_id) {
      return res.status(403).json({ error: 'No autorizado para ver esta orden' });
    }

    res.json(orden[0]);
  } catch (error) {
    console.error('Error en getOrdenById:', error.message);
    res.status(500).json({ error: 'Error al obtener orden de compra' });
  }
};

// GET /ordenes-compra/reserva/:reservaId - PRIVADO (Admin o cliente propietario)
const getOrdenByReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;
    const usuario_id = req.user.id;
    const es_admin = req.user.rol_nombre === 'admin';

    const [orden] = await pool.query(`
      SELECT 
        oc.*,
        r.cliente_id,
        CONCAT(u.nombre, ' ', u.apellido) as cliente_nombre
      FROM OrdenesCompra oc
      LEFT JOIN Reservas r ON oc.reserva_id = r.id
      LEFT JOIN Usuarios u ON r.cliente_id = u.id
      WHERE oc.reserva_id = ?
    `, [reservaId]);

    if (orden.length === 0) {
      return res.status(404).json({ error: 'No se encontró orden para esta reserva' });
    }

    // Verificar permisos
    if (!es_admin && orden[0].cliente_id !== usuario_id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    res.json(orden[0]);
  } catch (error) {
    console.error('Error en getOrdenByReserva:', error.message);
    res.status(500).json({ error: 'Error al obtener orden de compra' });
  }
};

// POST /ordenes-compra - PRIVADO (Sistema/Admin - crear orden al confirmar reserva)
const createOrden = async (req, res) => {
  const {
    reserva_id,
    subtotal,
    impuestos,
    descuentos,
    total,
    metodo_pago
  } = req.body;

  // Validaciones
  if (!reserva_id || !subtotal || total === undefined || !metodo_pago) {
    return res.status(400).json({
      error: 'Campos requeridos: reserva_id, subtotal, total, metodo_pago'
    });
  }

  try {
    const es_admin = req.user.rol_nombre === 'admin';

    // Verificar que la reserva existe
    const [reserva] = await pool.query(
      'SELECT cliente_id, precio_total FROM Reservas WHERE id = ?',
      [reserva_id]
    );

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Solo admin puede crear órdenes
    if (!es_admin) {
      return res.status(403).json({ error: 'Solo administradores pueden crear órdenes' });
    }

    // Verificar que no exista ya una orden para esta reserva
    const [existente] = await pool.query(
      'SELECT id FROM OrdenesCompra WHERE reserva_id = ?',
      [reserva_id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe una orden para esta reserva' });
    }

    // Generar número de orden único
    const numero_orden = `ORD-${Date.now()}-${reserva_id}`;

    // Crear orden
    const [result] = await pool.query(
      `INSERT INTO OrdenesCompra 
       (reserva_id, numero_orden, subtotal, impuestos, descuentos, total, metodo_pago, 
        estado_pago, fecha_factura, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW(), NOW())`,
      [
        reserva_id,
        numero_orden,
        subtotal,
        impuestos || 0,
        descuentos || 0,
        total,
        metodo_pago
      ]
    );

    res.status(201).json({
      message: 'Orden de compra creada exitosamente',
      orden: {
        id: result.insertId,
        numero_orden,
        reserva_id,
        total,
        metodo_pago,
        estado_pago: 'pendiente'
      }
    });
  } catch (error) {
    console.error('Error en createOrden:', error.message);
    res.status(500).json({ error: 'Error al crear orden de compra' });
  }
};

// PUT /ordenes-compra/:id - PRIVADO (Solo admin - actualizar estado de pago)
const updateOrden = async (req, res) => {
  const { id } = req.params;
  const { estado_pago, metodo_pago } = req.body;

  try {
    const es_admin = req.user.rol_nombre === 'admin';

    if (!es_admin) {
      return res.status(403).json({ error: 'Solo administradores pueden actualizar órdenes' });
    }

    // Verificar que la orden existe
    const [orden] = await pool.query('SELECT id FROM OrdenesCompra WHERE id = ?', [id]);

    if (orden.length === 0) {
      return res.status(404).json({ error: 'Orden de compra no encontrada' });
    }

    // Construir query dinámico
    const updates = [];
    const values = [];

    if (estado_pago) {
      updates.push('estado_pago = ?');
      values.push(estado_pago);
    }
    if (metodo_pago) {
      updates.push('metodo_pago = ?');
      values.push(metodo_pago);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE OrdenesCompra SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Orden de compra actualizada exitosamente' });
  } catch (error) {
    console.error('Error en updateOrden:', error.message);
    res.status(500).json({ error: 'Error al actualizar orden de compra' });
  }
};

// DELETE /ordenes-compra/:id - PRIVADO (Solo admin)
const deleteOrden = async (req, res) => {
  try {
    const es_admin = req.user.rol_nombre === 'admin';

    if (!es_admin) {
      return res.status(403).json({ error: 'Solo administradores pueden eliminar órdenes' });
    }

    const [result] = await pool.query(
      'DELETE FROM OrdenesCompra WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Orden de compra no encontrada' });
    }

    res.json({ message: 'Orden de compra eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteOrden:', error.message);
    res.status(500).json({ error: 'Error al eliminar orden de compra' });
  }
};

module.exports = {
  getAllOrdenes,
  getOrdenById,
  getOrdenByReserva,
  createOrden,
  updateOrden,
  deleteOrden
};
