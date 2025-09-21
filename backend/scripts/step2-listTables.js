const pool = require('../config/db');

const listTables = async () => {
  try {
    console.log('📋 PASO 2: LISTANDO TABLAS DE LA BASE DE DATOS');
    console.log('=' .repeat(50));
    
    const [tables] = await pool.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('⚠️  No se encontraron tablas en la base de datos');
      console.log('   Parece que la base de datos está vacía');
      return;
    }
    
    console.log(`📊 Total de tablas encontradas: ${tables.length}\n`);
    
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`${index + 1}. ${tableName}`);
    });
    
    console.log('\n🎯 TABLAS PRINCIPALES ESPERADAS PARA EL PROYECTO:');
    const expectedTables = [
      'usuario', 'cliente', 'producto', 'servicio', 
      'agendamiento', 'rol', 'permiso', 'tipo_servicio'
    ];
    
    const tableNames = tables.map(t => Object.values(t)[0].toLowerCase());
    
    expectedTables.forEach(expected => {
      const exists = tableNames.includes(expected.toLowerCase());
      console.log(`${exists ? '✅' : '❌'} ${expected}`);
    });
    
  } catch (error) {
    console.error('❌ Error al listar tablas:', error.message);
  }
  
  process.exit(0);
};

listTables();
