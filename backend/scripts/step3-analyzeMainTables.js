const pool = require('../config/db');

const analyzeMainTables = async () => {
  try {
    console.log('🔍 PASO 3: ANALIZANDO TABLAS PRINCIPALES');
    console.log('=' .repeat(50));
    
    const mainTables = ['usuario', 'cliente', 'agendamiento', 'servicio', 'producto'];
    
    for (const tableName of mainTables) {
      console.log(`\n📁 TABLA: ${tableName.toUpperCase()}`);
      console.log('-'.repeat(30));
      
      try {
        // Verificar si la tabla existe
        const [tableExists] = await pool.query(
          'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?',
          [tableName]
        );
        
        if (tableExists[0].count === 0) {
          console.log(`❌ La tabla "${tableName}" no existe`);
          continue;
        }
        
        // Contar registros
        const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
        console.log(`📊 Registros: ${count[0].total}`);
        
        // Mostrar estructura básica
        const [columns] = await pool.query(`DESCRIBE ${tableName}`);
        console.log('📋 Columnas:');
        columns.slice(0, 5).forEach(col => { // Mostrar solo las primeras 5 columnas
          let info = `  • ${col.Field} (${col.Type})`;
          if (col.Key === 'PRI') info += ' [PK]';
          if (col.Key === 'MUL') info += ' [FK]';
          if (col.Null === 'NO') info += ' NOT NULL';
          console.log(info);
        });
        
        if (columns.length > 5) {
          console.log(`  ... y ${columns.length - 5} columnas más`);
        }
        
        // Mostrar algunos datos de ejemplo (solo primeras 2 filas)
        if (count[0].total > 0) {
          const [sample] = await pool.query(`SELECT * FROM ${tableName} LIMIT 2`);
          console.log('🔍 Datos de ejemplo:');
          sample.forEach((row, index) => {
            console.log(`  Registro ${index + 1}:`, Object.keys(row).slice(0, 3).map(key => `${key}: ${row[key]}`).join(' | '));
          });
        }
        
      } catch (error) {
        console.log(`❌ Error al analizar tabla ${tableName}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
  
  process.exit(0);
};

analyzeMainTables();
