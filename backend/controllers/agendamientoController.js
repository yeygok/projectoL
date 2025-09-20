const pool = require('../config/db');
const transporter = require('../config/mailer');

const getAllAgendamientos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agendamiento');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener agendamientos' });
  }
};

const getAgendamientoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agendamiento WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Agendamiento no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener agendamiento' });
  }
};

const createAgendamiento = async (req, res) => {
  const { fecha, hora, descripcion, direccion_servicio, cliente_id, estado_orden_id, servicios, productos } = req.body;
  // Validar campos básicos
  if (!fecha || !hora || !direccion_servicio || !cliente_id || !estado_orden_id || !servicios || !Array.isArray(servicios) || servicios.length === 0) {
    return res.status(400).json({ error: 'Campos requeridos: fecha, hora, direccion_servicio, cliente_id, estado_orden_id, servicios' });
  }
  try {
    // Validar disponibilidad de fecha/hora para el cliente
    const [agendas] = await pool.query(
      'SELECT * FROM agendamiento WHERE fecha = ? AND hora = ? AND cliente_id = ?',
      [fecha, hora, cliente_id]
    );
    if (agendas.length > 0) {
      return res.status(409).json({ error: 'La fecha y hora seleccionadas ya están ocupadas para este cliente.' });
    }
    // Crear agendamiento
    const [result] = await pool.query(
      'INSERT INTO agendamiento (fecha, hora, descripcion, direccion_servicio, cliente_id, estado_orden_id) VALUES (?, ?, ?, ?, ?, ?)',
      [fecha, hora, descripcion || null, direccion_servicio, cliente_id, estado_orden_id]
    );
    const agendamientoId = result.insertId;
    let costoTotal = 0;
    // Registrar servicios asociados
    for (const s of servicios) {
      // s: { servicio_id, tipo_servicio_id, cantidad }
      // Obtener precio del servicio
      const [[serv]] = await pool.query('SELECT precio FROM servicio WHERE id = ?', [s.servicio_id]);
      if (!serv) continue;
      const precio = serv.precio;
      const subtotal = precio * (s.cantidad || 1);
      costoTotal += subtotal;
      await pool.query(
        'INSERT INTO agendamiento_servicio (agendamiento_id, servicio_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [agendamientoId, s.servicio_id, s.cantidad || 1, precio, subtotal]
      );
      // Relacionar tipo de servicio si aplica
      if (s.tipo_servicio_id) {
        await pool.query(
          'INSERT IGNORE INTO servicio_tipo (servicio_id, tipo_servicio_id) VALUES (?, ?)',
          [s.servicio_id, s.tipo_servicio_id]
        );
      }
    }
    // Registrar productos asociados si aplica
    if (productos && Array.isArray(productos)) {
      for (const p of productos) {
        // p: { producto_id, cantidad }
        await pool.query(
          'INSERT INTO agendamiento_producto (agendamiento_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [agendamientoId, p.producto_id, p.cantidad || 1]
        );
      }
    }
    // Obtener correo del cliente
    const [[user]] = await pool.query(
      'SELECT u.correo FROM usuario u INNER JOIN cliente c ON u.id = c.usuario_id WHERE c.id = ?',
      [cliente_id]
    );
    // Enviar correo de confirmación
    if (user && user.correo) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'tucorreo@gmail.com',
        to: user.correo,
        subject: 'Confirmación de agendamiento',
        html: `<h3>¡Tu cita ha sido agendada!</h3>
        <p>Fecha: <b>${fecha}</b></p>
        <p>Hora: <b>${hora}</b></p>
        <p>Dirección: <b>${direccion_servicio}</b></p>
        <p>Servicios: <b>${servicios.map(s => `ID:${s.servicio_id} (Tipo:${s.tipo_servicio_id || 'N/A'}) x${s.cantidad || 1}`).join(', ')}</b></p>
        <p>Costo total: <b>$${costoTotal.toFixed(2)}</b></p>`
      });
    }
    res.status(201).json({ id: agendamientoId, costoTotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear agendamiento' });
  }
};

const updateAgendamiento = async (req, res) => {
  const { fecha, hora, descripcion, direccion_servicio, cliente_id, estado_orden_id } = req.body;
  if (!fecha || !hora || !direccion_servicio || !cliente_id || !estado_orden_id) {
    return res.status(400).json({ error: 'Campos requeridos: fecha, hora, direccion_servicio, cliente_id, estado_orden_id' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE agendamiento SET fecha = ?, hora = ?, descripcion = ?, direccion_servicio = ?, cliente_id = ?, estado_orden_id = ? WHERE id = ?',
      [fecha, hora, descripcion || null, direccion_servicio, cliente_id, estado_orden_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamiento no encontrado' });
    }
    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar agendamiento' });
  }
};

const deleteAgendamiento = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM agendamiento WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamiento no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar agendamiento' });
  }
};

// Endpoint para consultar disponibilidad de fecha/hora
const checkDisponibilidad = async (req, res) => {
  const { fecha, hora, cliente_id } = req.query;
  if (!fecha || !hora || !cliente_id) {
    return res.status(400).json({ error: 'Campos requeridos: fecha, hora, cliente_id' });
  }
  try {
    const [agendas] = await pool.query(
      'SELECT * FROM agendamiento WHERE fecha = ? AND hora = ? AND cliente_id = ?',
      [fecha, hora, cliente_id]
    );
    if (agendas.length > 0) {
      return res.json({ disponible: false, mensaje: 'No disponible' });
    }
    res.json({ disponible: true, mensaje: 'Disponible' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
};

// Endpoint para obtener detalle completo de un agendamiento
const getAgendamientoDetalle = async (req, res) => {
  const { id } = req.params;
  try {
    // Agendamiento principal
    const [[agendamiento]] = await pool.query('SELECT * FROM agendamiento WHERE id = ?', [id]);
    if (!agendamiento) {
      return res.status(404).json({ error: 'Agendamiento no encontrado' });
    }
    // Servicios asociados
    const [servicios] = await pool.query(
      `SELECT s.*, ast.cantidad, ast.precio_unitario, ast.subtotal, ts.nombre as tipo_servicio
       FROM agendamiento_servicio ast
       JOIN servicio s ON ast.servicio_id = s.id
       LEFT JOIN servicio_tipo st ON s.id = st.servicio_id
       LEFT JOIN tipo_servicio ts ON st.tipo_servicio_id = ts.id
       WHERE ast.agendamiento_id = ?`,
      [id]
    );
    // Productos asociados
    const [productos] = await pool.query(
      `SELECT p.*, ap.cantidad
       FROM agendamiento_producto ap
       JOIN producto p ON ap.producto_id = p.id
       WHERE ap.agendamiento_id = ?`,
      [id]
    );
    // Costo total
    const costoTotal = servicios.reduce((acc, s) => acc + Number(s.subtotal), 0);
    res.json({ ...agendamiento, servicios, productos, costoTotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener detalle de agendamiento' });
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
