const pool = require('../config/db');

async function getServiciosStructure() {
  console.log('🔍 ESTRUCTURA DE TABLA SERVICIOS');
  console.log('=================================\n');

  try {
    // Obtener estructura detallada
    console.log('📋 DESCRIBE Servicios:');
    const [structure] = await pool.query('DESCRIBE Servicios');
    
    structure.forEach(field => {
      console.log(`   ${field.Field}: ${field.Type} ${field.Null === 'YES' ? '(Nullable)' : '(NOT NULL)'} ${field.Key ? `[${field.Key}]` : ''} ${field.Default !== null ? `Default: ${field.Default}` : ''}`);
    });

    console.log('\n📊 DATOS DE MUESTRA:');
    const [sample] = await pool.query('SELECT * FROM Servicios LIMIT 3');
    
    if (sample.length > 0) {
      console.log('   Servicios disponibles:');
      sample.forEach((servicio, index) => {
        console.log(`   ${index + 1}. ${servicio.nombre} - $${servicio.precio}`);
      });
      console.log('\n   Ejemplo completo:', JSON.stringify(sample[0], null, 2));
    } else {
      console.log('   ⚠️  No hay servicios en la tabla');
    }

    console.log('\n🔗 VERIFICAR RELACIONES:');
    const [tiposServicio] = await pool.query('SELECT * FROM TiposServicio LIMIT 5');
    console.log('   Tipos de servicio disponibles:', tiposServicio.map(ts => `${ts.id}: ${ts.nombre}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

getServiciosStructure();
