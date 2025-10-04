// Cargar variables de entorno ANTES de cualquier otra cosa
require('dotenv').config();

const emailService = require('../services/emailService');

/**
 * Script de prueba para el sistema de emails
 * Ejecutar: node scripts/testEmail.js
 */

async function testEmailSystem() {
  console.log('🧪 Iniciando pruebas del sistema de emails...\n');

  try {
    // 1. Test de conexión
    console.log('1️⃣ Probando conexión al servidor SMTP...');
    const connectionResult = await emailService.testConnection();
    console.log('Resultado:', connectionResult);
    console.log('');

    if (!connectionResult.success) {
      console.error('❌ No se pudo conectar al servidor de email');
      console.error('Error:', connectionResult.error);
      console.log('\n⚠️ Verifica:');
      console.log('  - EMAIL_USER está configurado en .env');
      console.log('  - EMAIL_PASS está configurado en .env');
      console.log('  - Si usas Gmail, necesitas una "Contraseña de Aplicación"');
      console.log('  - Pasos: https://support.google.com/accounts/answer/185833');
      return;
    }

    // 2. Test de email de confirmación de reserva
    console.log('2️⃣ Enviando email de prueba de confirmación de reserva...');
    
    const reservaDataTest = {
      cliente: {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: process.env.EMAIL_USER, // Enviar al mismo email para testing
        telefono: '+57 300 123 4567'
      },
      reserva: {
        id: 999,
        fecha_servicio: new Date(),
        precio_total: 150000,
        estado: 'pendiente',
        observaciones: 'Esta es una prueba del sistema de emails'
      },
      servicio: {
        tipo: 'Lavado Premium',
        descripcion: 'Limpieza profunda con vapor y tratamiento antimanchas'
      },
      ubicacion: {
        direccion: 'Calle 123 # 45-67',
        barrio: 'Chapinero',
        localidad: 'Bogotá'
      },
      tecnico: null
    };

    const emailResult = await emailService.sendReservaConfirmation(reservaDataTest);
    
    if (emailResult.success) {
      console.log('✅ Email de confirmación enviado exitosamente!');
      console.log(`📧 Enviado a: ${reservaDataTest.cliente.email}`);
      console.log(`📬 Message ID: ${emailResult.messageId}`);
    } else {
      console.error('❌ Error al enviar email de confirmación');
      console.error('Error:', emailResult.error);
    }

    console.log('\n3️⃣ Resumen de pruebas:');
    console.log('='.repeat(50));
    console.log(`Conexión SMTP: ${connectionResult.success ? '✅ OK' : '❌ FAIL'}`);
    console.log(`Email de prueba: ${emailResult.success ? '✅ OK' : '❌ FAIL'}`);
    console.log('='.repeat(50));

    if (connectionResult.success && emailResult.success) {
      console.log('\n🎉 ¡Sistema de emails funcionando correctamente!');
      console.log('📝 Revisa tu bandeja de entrada para ver el email de prueba');
    } else {
      console.log('\n⚠️ Hay problemas con el sistema de emails');
      console.log('Por favor revisa la configuración en .env');
    }

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Ejecutar pruebas
testEmailSystem()
  .then(() => {
    console.log('\n✅ Pruebas completadas');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
