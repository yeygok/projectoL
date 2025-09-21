const pool = require('../config/db');

async function getReservasStructure() {
  console.log('🔍 ESTRUCTURA EXACTA DE TABLA RESERVAS');
  console.log('======================================\n');

  try {
    console.log('📋 DESCRIBE Reservas:');
    const [structure] = await pool.query('DESCRIBE Reservas');
    
    structure.forEach(field => {
      console.log(`   ${field.Field}: ${field.Type} ${field.Null === 'YES' ? '(Nullable)' : '(NOT NULL)'} ${field.Key ? `[${field.Key}]` : ''} ${field.Default !== null ? `Default: ${field.Default}` : ''}`);
    });

    console.log('\n📊 DATOS DE MUESTRA:');
    const [sample] = await pool.query('SELECT * FROM Reservas LIMIT 1');
    
    if (sample.length > 0) {
      console.log('   Ejemplo:', JSON.stringify(sample[0], null, 2));
    } else {
      console.log('   ⚠️  No hay reservas en la tabla');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

getReservasStructure();
