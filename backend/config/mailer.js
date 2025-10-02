// Configuración de nodemailer para envío de correos - Lavado Vapor Bogotá
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER || 'yeygok777@gmail.com',
    pass: process.env.EMAIL_PASS || 'yeygokyeS1996',
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
