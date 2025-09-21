const pool = require('../config/db');

const findRelations = async () => {
  try {
    console.log('🔗 PASO 4: ENCONTRANDO RELACIONES ENTRE TABLAS');
    console.log('=' .repeat(50));
    
    // Buscar columnas que terminan en _id (relaciones implícitas)
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    console.log('🔍 Analizando relaciones implícitas (columnas *_id):\n');
    
    for (const tableName of tableNames.slice(0, 10)) { // Limitar a 10 tablas para no saturar
      try {
        const [columns] = await pool.query(`DESCRIBE ${tableName}`);
        const foreignKeys = columns.filter(col => 
          col.Field.endsWith('_id') && col.Field !== 'id'
        );
        
        if (foreignKeys.length > 0) {
          console.log(`📋 ${tableName}:`);
          foreignKeys.forEach(fk => {
            const referencedTable = fk.Field.replace('_id', '');
            const exists = tableNames.includes(referencedTable);
            console.log(`  • ${fk.Field} → ${referencedTable} ${exists ? '✅' : '❓'}`);
          });
          console.log('');
        }
        
      } catch (error) {
        console.log(`❌ Error al analizar ${tableName}: ${error.message}`);
      }
    }
    
    // Buscar Foreign Keys explícitas (si existen)
    console.log('🔍 Buscando Foreign Keys explícitas:');
    try {
      const [foreignKeys] = await pool.query(`
        SELECT 
          TABLE_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND REFERENCED_TABLE_NAME IS NOT NULL
        LIMIT 20
      `);
      
      if (foreignKeys.length > 0) {
        console.log('✅ Foreign Keys encontradas:');
        foreignKeys.forEach(fk => {
          console.log(`  • ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
        });
      } else {
        console.log('⚠️  No se encontraron Foreign Keys explícitas');
      }
    } catch (error) {
      console.log(`❌ Error al buscar Foreign Keys: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
  
  process.exit(0);
};

findRelations();
