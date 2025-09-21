const pool = require('../config/db');

const securityAnalysis = async () => {
  try {
    console.log('🔒 PASO 5: ANÁLISIS DE SEGURIDAD Y RECOMENDACIONES');
    console.log('=' .repeat(50));
    
    console.log('🔍 Analizando tablas por nivel de sensibilidad:\n');
    
    // Tablas críticas (datos sensibles)
    console.log('🚨 TABLAS CRÍTICAS (Requieren máxima protección):');
    const criticalTables = ['usuario', 'cliente', 'agendamiento'];
    
    for (const table of criticalTables) {
      try {
        const [exists] = await pool.query(
          'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?',
          [table]
        );
        
        if (exists[0].count > 0) {
          const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${table}`);
          console.log(`  ✅ ${table} - ${count[0].total} registros`);
          
          // Verificar si tiene datos sensibles
          const [columns] = await pool.query(`DESCRIBE ${table}`);
          const sensitiveColumns = columns.filter(col => 
            col.Field.includes('correo') || 
            col.Field.includes('contrasena') || 
            col.Field.includes('password') ||
            col.Field.includes('telefono') ||
            col.Field.includes('direccion')
          );
          
          if (sensitiveColumns.length > 0) {
            console.log(`    🔐 Columnas sensibles: ${sensitiveColumns.map(c => c.Field).join(', ')}`);
          }
        } else {
          console.log(`  ❌ ${table} - No existe`);
        }
      } catch (error) {
        console.log(`  ❌ ${table} - Error: ${error.message}`);
      }
    }
    
    // Tablas administrativas
    console.log('\n🔧 TABLAS ADMINISTRATIVAS (Solo admin):');
    const adminTables = ['rol', 'permiso', 'estado_orden', 'estado_usuario'];
    
    for (const table of adminTables) {
      try {
        const [exists] = await pool.query(
          'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?',
          [table]
        );
        
        if (exists[0].count > 0) {
          const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${table}`);
          console.log(`  ✅ ${table} - ${count[0].total} registros`);
        } else {
          console.log(`  ❌ ${table} - No existe`);
        }
      } catch (error) {
        console.log(`  ❌ ${table} - Error: ${error.message}`);
      }
    }
    
    // Tablas que pueden ser públicas (con filtros)
    console.log('\n🌍 TABLAS POTENCIALMENTE PÚBLICAS (Con filtros):');
    const publicTables = ['servicio', 'producto', 'tipo_servicio'];
    
    for (const table of publicTables) {
      try {
        const [exists] = await pool.query(
          'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?',
          [table]
        );
        
        if (exists[0].count > 0) {
          const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${table}`);
          console.log(`  ✅ ${table} - ${count[0].total} registros (filtrar precios/stock)`);
        } else {
          console.log(`  ❌ ${table} - No existe`);
        }
      } catch (error) {
        console.log(`  ❌ ${table} - Error: ${error.message}`);
      }
    }
    
    console.log('\n💡 RECOMENDACIONES PRIORITARIAS:');
    console.log('1. 🔒 Proteger TODOS los endpoints de usuario, cliente y agendamiento');
    console.log('2. 🌍 Crear endpoints públicos filtrados para servicios y productos');
    console.log('3. 🔐 Implementar roles para gestión administrativa');
    console.log('4. ⚡ Priorizar por tiempo: usuarios → agendamientos → catálogos');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
  
  process.exit(0);
};

securityAnalysis();
