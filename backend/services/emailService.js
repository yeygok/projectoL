const transporter = require('../config/mailer');

class EmailService {
  constructor() {
    this.fromEmail = process.env.EMAIL_USER || 'yeygok777@gmail.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Lavado Vapor Bogotá';
  }

  // Plantilla base para todos los emails
  getBaseTemplate(content, title = 'Lavado Vapor Bogotá') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .button { background: #28a745; color: white; padding: 12px 25px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; 
                   border-radius: 5px; margin: 15px 0; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; }
          .info { background: #d1ecf1; border: 1px solid #bee5eb; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚿 Lavado Vapor Bogotá</h1>
            <p>Servicio de limpieza profesional con vapor</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© 2025 Lavado Vapor Bogotá - Bogotá, Colombia</p>
            <p>📧 yeygok777@gmail.com | 📱 WhatsApp: +57 300 123 4567</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 1. Email de confirmación de nueva reserva (para cliente)
  async sendReservaConfirmation(reservaData) {
    const { cliente, reserva, servicio, ubicacion, tecnico } = reservaData;
    
    const content = `
      <h2>¡Reserva Confirmada! ✅</h2>
      <div class="alert success">
        <p><strong>Hola ${cliente.nombre} ${cliente.apellido},</strong></p>
        <p>Tu reserva ha sido <strong>confirmada exitosamente</strong>. Te enviamos los detalles:</p>
      </div>
      
      <h3>📋 Detalles de la Reserva</h3>
      <ul>
        <li><strong>ID Reserva:</strong> #${reserva.id}</li>
        <li><strong>Servicio:</strong> ${servicio.tipo} - ${servicio.descripcion}</li>
        <li><strong>Fecha:</strong> ${new Date(reserva.fecha_servicio).toLocaleDateString('es-CO')}</li>
        <li><strong>Hora:</strong> ${new Date(reserva.fecha_servicio).toLocaleTimeString('es-CO')}</li>
        <li><strong>Ubicación:</strong> ${ubicacion.direccion}, ${ubicacion.barrio}</li>
        <li><strong>Precio Total:</strong> $${reserva.precio_total.toLocaleString('es-CO')}</li>
        <li><strong>Estado:</strong> ${reserva.estado}</li>
      </ul>

      ${tecnico ? `
        <h3>👷 Técnico Asignado</h3>
        <p><strong>${tecnico.nombre}</strong> - Tel: ${tecnico.telefono || 'Por confirmar'}</p>
      ` : `
        <div class="alert info">
          <p><strong>ℹ️ Técnico en asignación</strong></p>
          <p>Pronto te contactaremos con los datos del técnico asignado.</p>
        </div>
      `}

      <h3>📝 Observaciones</h3>
      <p>${reserva.observaciones || 'Ninguna observación especial'}</p>

      <div class="alert warning">
        <p><strong>📞 ¿Necesitas hacer cambios?</strong></p>
        <p>Contactanos al WhatsApp <strong>+57 300 123 4567</strong> con mínimo 2 horas de anticipación.</p>
      </div>

      <p>¡Gracias por confiar en nosotros!</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: cliente.email,
      subject: `✅ Reserva Confirmada #${reserva.id} - Lavado Vapor Bogotá`,
      html: this.getBaseTemplate(content, 'Reserva Confirmada')
    };

    return this.sendEmail(mailOptions);
  }

  // 2. Email de notificación para técnico
  async sendTecnicoNotification(reservaData) {
    const { cliente, reserva, servicio, ubicacion, tecnico } = reservaData;
    
    const content = `
      <h2>Nueva Reserva Asignada 🔧</h2>
      <div class="alert info">
        <p><strong>Hola ${tecnico.nombre},</strong></p>
        <p>Se te ha asignado una nueva reserva. Revisa los detalles:</p>
      </div>
      
      <h3>👤 Datos del Cliente</h3>
      <ul>
        <li><strong>Nombre:</strong> ${cliente.nombre} ${cliente.apellido}</li>
        <li><strong>Teléfono:</strong> ${cliente.telefono}</li>
        <li><strong>Email:</strong> ${cliente.email}</li>
      </ul>

      <h3>📋 Detalles del Servicio</h3>
      <ul>
        <li><strong>ID Reserva:</strong> #${reserva.id}</li>
        <li><strong>Servicio:</strong> ${servicio.tipo} - ${servicio.descripcion}</li>
        <li><strong>Fecha:</strong> ${new Date(reserva.fecha_servicio).toLocaleDateString('es-CO')}</li>
        <li><strong>Hora:</strong> ${new Date(reserva.fecha_servicio).toLocaleTimeString('es-CO')}</li>
        <li><strong>Precio:</strong> $${reserva.precio_total.toLocaleString('es-CO')}</li>
      </ul>

      <h3>📍 Ubicación del Servicio</h3>
      <p><strong>${ubicacion.direccion}</strong><br>
      ${ubicacion.barrio}, ${ubicacion.localidad}<br>
      Zona: ${ubicacion.zona}</p>

      <h3>📝 Observaciones del Cliente</h3>
      <p>${reserva.observaciones || 'Sin observaciones especiales'}</p>

      <div class="alert warning">
        <p><strong>📋 Recordatorios:</strong></p>
        <ul>
          <li>Confirma la reserva en el sistema</li>
          <li>Contacta al cliente 30 min antes</li>
          <li>Lleva todo el equipo necesario</li>
          <li>Actualiza el estado en tiempo real</li>
        </ul>
      </div>

      <a href="#" class="button">Ver en Dashboard</a>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: tecnico.email,
      subject: `🔧 Nueva Reserva Asignada #${reserva.id} - ${cliente.nombre}`,
      html: this.getBaseTemplate(content, 'Nueva Reserva Asignada')
    };

    return this.sendEmail(mailOptions);
  }

  // 3. Email de cambio de estado
  async sendStatusUpdate(reservaData, nuevoEstado, estadoAnterior) {
    const { cliente, reserva, tecnico } = reservaData;
    
    let mensaje = '';
    let color = 'info';
    
    switch(nuevoEstado) {
      case 'asignada':
        mensaje = '✅ Tu reserva ha sido asignada a un técnico';
        color = 'success';
        break;
      case 'en_camino':
        mensaje = '🛣️ El técnico está en camino a tu ubicación';
        color = 'info';
        break;
      case 'en_proceso':
        mensaje = '🔧 El servicio ha comenzado';
        color = 'info';
        break;
      case 'completada':
        mensaje = '🎉 ¡Tu servicio ha sido completado exitosamente!';
        color = 'success';
        break;
      case 'cancelada':
        mensaje = '❌ Tu reserva ha sido cancelada';
        color = 'warning';
        break;
      case 'reprogramada':
        mensaje = '📅 Tu reserva ha sido reprogramada';
        color = 'warning';
        break;
    }

    const content = `
      <h2>Actualización de tu Reserva #${reserva.id}</h2>
      <div class="alert ${color}">
        <h3>${mensaje}</h3>
        <p>Estado anterior: <strong>${estadoAnterior}</strong> → Estado actual: <strong>${nuevoEstado}</strong></p>
      </div>
      
      ${tecnico ? `
        <h3>👷 Técnico Asignado</h3>
        <p><strong>${tecnico.nombre}</strong><br>
        Tel: ${tecnico.telefono || 'Por confirmar'}</p>
      ` : ''}

      <h3>📞 ¿Tienes dudas?</h3>
      <p>No dudes en contactarnos al WhatsApp <strong>+57 300 123 4567</strong></p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: cliente.email,
      subject: `📋 Actualización Reserva #${reserva.id} - ${mensaje}`,
      html: this.getBaseTemplate(content, 'Actualización de Reserva')
    };

    return this.sendEmail(mailOptions);
  }

  // 4. Email de recordatorio (1 día antes)
  async sendReminder(reservaData) {
    const { cliente, reserva, servicio, ubicacion, tecnico } = reservaData;
    
    const content = `
      <h2>Recordatorio de Servicio 📅</h2>
      <div class="alert warning">
        <p><strong>Hola ${cliente.nombre},</strong></p>
        <p>Te recordamos que <strong>mañana</strong> tienes programado tu servicio de limpieza.</p>
      </div>
      
      <h3>📋 Detalles</h3>
      <ul>
        <li><strong>Servicio:</strong> ${servicio.tipo}</li>
        <li><strong>Fecha:</strong> ${new Date(reserva.fecha_servicio).toLocaleDateString('es-CO')}</li>
        <li><strong>Hora:</strong> ${new Date(reserva.fecha_servicio).toLocaleTimeString('es-CO')}</li>
        <li><strong>Ubicación:</strong> ${ubicacion.direccion}</li>
      </ul>

      ${tecnico ? `
        <h3>👷 Tu Técnico</h3>
        <p><strong>${tecnico.nombre}</strong> - Tel: ${tecnico.telefono}</p>
      ` : ''}

      <div class="alert info">
        <p><strong>📋 Preparativos recomendados:</strong></p>
        <ul>
          <li>Despeja el área a limpiar</li>
          <li>Ten acceso al agua disponible</li>
          <li>Asegura espacio para el equipo</li>
        </ul>
      </div>

      <p>¡Nos vemos mañana!</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: cliente.email,
      subject: `📅 Recordatorio: Servicio mañana - Reserva #${reserva.id}`,
      html: this.getBaseTemplate(content, 'Recordatorio de Servicio')
    };

    return this.sendEmail(mailOptions);
  }

  // Método base para enviar emails
  async sendEmail(mailOptions) {
    try {
      const result = await transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      return { success: false, error: error.message };
    }
  }

  // Test de conexión
  async testConnection() {
    try {
      await transporter.verify();
      return { success: true, message: 'Conexión exitosa al servidor de correo' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
