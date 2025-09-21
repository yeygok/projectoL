const pool = require('../config/db');

const testConnection = async () => {
  try {
    console.log('🔌 PASO 1: PROBANDO CONEXIÓN A BASE DE DATOS');
    console.log('=' .repeat(50));
    
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Verificar nombre de la base de datos actual
    const [result] = await connection.query('SELECT DATABASE() as current_db');
    console.log(`📊 Base de datos actual: ${result[0].current_db}`);
    
    // Verificar versión de MySQL
    const [version] = await connection.query('SELECT VERSION() as mysql_version');
    console.log(`🔧 Versión de MySQL: ${version[0].mysql_version}`);
    
    connection.release();
    console.log('✅ Conexión cerrada correctamente');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('🔧 La base de datos "LavadoVaporBogotaDB" no existe');
      console.log('   Soluciones:');
      console.log('   1. Crear la base de datos: CREATE DATABASE LavadoVaporBogotaDB;');
      console.log('   2. O cambiar el nombre en config/db.js');
    }
  }
  
  process.exit(0);
};

testConnection();
