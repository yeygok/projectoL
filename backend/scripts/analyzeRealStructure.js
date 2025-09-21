const pool = require('../config/db');

const analyzeRealTables = async () => {
  try {
    console.log('🔍 ANÁLISIS DE LA ESTRUCTURA REAL - LAVADO VAPOR BOGOTÁ');
    console.log('=' .repeat(60));
    
    // Mapeo de las tablas reales
    const realTables = {
      'Usuarios': 'Gestión de usuarios del sistema',
      'Reservas': 'Agendamientos/Citas (equivale a agendamiento)',
      'Servicios': 'Catálogo de servicios',
      'TiposServicio': 'Categorías de servicios',
      'Vehiculos': 'Información de vehículos de clientes',
      'Roles': 'Roles del sistema',
      'Permisos': 'Permisos del sistema'
    };
    
    for (const [tableName, description] of Object.entries(realTables)) {
      console.log(`\n📁 TABLA: ${tableName} (${description})`);
      console.log('-'.repeat(50));
      
      try {
        // Contar registros
        const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
        console.log(`📊 Registros: ${count[0].total}`);
        
        // Mostrar estructura
        const [columns] = await pool.query(`DESCRIBE ${tableName}`);
        console.log('📋 Estructura:');
        columns.forEach(col => {
          let info = `  • ${col.Field} (${col.Type})`;
          if (col.Key === 'PRI') info += ' [PK]';
          if (col.Key === 'MUL') info += ' [FK]';
          if (col.Null === 'NO') info += ' NOT NULL';
          if (col.Extra === 'auto_increment') info += ' AUTO_INCREMENT';
          console.log(info);
        });
        
        // Mostrar datos de ejemplo si hay registros
        if (count[0].total > 0) {
          const [sample] = await pool.query(`SELECT * FROM ${tableName} LIMIT 2`);
          console.log('🔍 Datos de ejemplo:');
          sample.forEach((row, index) => {
            const preview = Object.entries(row)
              .slice(0, 4) // Mostrar solo las primeras 4 columnas
              .map(([key, value]) => `${key}: ${value}`)
              .join(' | ');
            console.log(`  ${index + 1}. ${preview}`);
          });
        }
        
      } catch (error) {
        console.log(`❌ Error al analizar ${tableName}: ${error.message}`);
      }
    }
    
    // Análisis de tablas de configuración
    console.log(`\n\n🔧 TABLAS DE CONFIGURACIÓN:`);
    console.log('-'.repeat(40));
    
    const configTables = ['EstadosReserva', 'EstadosSoporte', 'CategoriasServicios'];
    
    for (const tableName of configTables) {
      try {
        const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
        console.log(`📋 ${tableName}: ${count[0].total} registros`);
        
        if (count[0].total > 0 && count[0].total <= 10) {
          const [data] = await pool.query(`SELECT * FROM ${tableName} LIMIT 5`);
          data.forEach(row => {
            const name = row.Nombre || row.nombre || Object.values(row)[1] || 'N/A';
            console.log(`  • ${name}`);
          });
        }
      } catch (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
  
  process.exit(0);
};

analyzeRealTables();
