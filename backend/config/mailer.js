// Configuración básica de nodemailer para envío de correos
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER || 'tucorreo@gmail.com',
    pass: process.env.EMAIL_PASS || 'tu_contraseña',
  },
});

module.exports = transporter;
