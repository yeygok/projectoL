const pool = require('../config/db');

async function getExactUsuariosStructure() {
  console.log('🔍 ESTRUCTURA EXACTA DE TABLA USUARIOS');
  console.log('=====================================\n');

  try {
    // Obtener estructura detallada
    console.log('📋 DESCRIBE Usuarios:');
    const [structure] = await pool.query('DESCRIBE Usuarios');
    
    structure.forEach(field => {
      console.log(`   ${field.Field}: ${field.Type} ${field.Null === 'YES' ? '(Nullable)' : '(NOT NULL)'} ${field.Key ? `[${field.Key}]` : ''} ${field.Default !== null ? `Default: ${field.Default}` : ''}`);
    });

    console.log('\n📊 DATOS DE MUESTRA:');
    const [sample] = await pool.query('SELECT * FROM Usuarios LIMIT 2');
    
    if (sample.length > 0) {
      console.log('   Ejemplo de usuario:', JSON.stringify(sample[0], null, 2));
    } else {
      console.log('   ⚠️  No hay usuarios en la tabla');
    }

    console.log('\n🔗 VERIFICAR TABLA ROLES:');
    const [roles] = await pool.query('SELECT * FROM Roles LIMIT 5');
    console.log('   Roles disponibles:', roles.map(r => `${r.id}: ${r.nombre}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

getExactUsuariosStructure();
