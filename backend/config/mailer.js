// Configuración de nodemailer para envío de correos - Lavado Vapor Bogotá
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar configuración del transporter
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Error en configuración de correo:', error.message);
    console.log('⚠️ Verifica que las credenciales en .env sean correctas');
  } else {
    console.log('✅ Servidor de correo listo para enviar mensajes');
    console.log(`📧 Enviando desde: ${process.env.EMAIL_USER}`);
  }
});

module.exports = transporter;
