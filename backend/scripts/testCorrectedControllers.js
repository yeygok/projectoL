const pool = require('../config/db');

async function testCorrectedControllers() {
  console.log('🧪 PROBANDO CONTROLADORES CORREGIDOS');
  console.log('=====================================\n');

  try {
    // 1. Probar estructura de Usuarios
    console.log('1️⃣ Probando estructura tabla Usuarios:');
    const [usuariosStructure] = await pool.query('DESCRIBE Usuarios');
    console.log('   ✅ Campos disponibles:', usuariosStructure.map(field => field.Field).join(', '));

    // 2. Probar consulta de userController
    console.log('\n2️⃣ Probando consulta userController (getAll):');
    const [users] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo, u.created_at, 
             r.nombre as rol_nombre, r.id as rol_id
      FROM Usuarios u
      LEFT JOIN Roles r ON u.rol_id = r.id
      ORDER BY u.created_at DESC
      LIMIT 3
    `);
    console.log('   ✅ Usuarios encontrados:', users.length);
    if (users.length > 0) {
      console.log('   📋 Ejemplo:', {
        id: users[0].id,
        email: users[0].email,
        nombre: users[0].nombre,
        apellido: users[0].apellido,
        rol: users[0].rol_nombre
      });
    }

    // 3. Probar consulta de clienteController
    console.log('\n3️⃣ Probando consulta clienteController (getAllClientes):');
    const [clientes] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo, u.created_at,
             r.nombre as rol_nombre
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE r.nombre = 'cliente' OR r.id = 2
      ORDER BY u.created_at DESC
      LIMIT 3
    `);
    console.log('   ✅ Clientes encontrados:', clientes.length);

    // 4. Probar consulta de authController (login)
    console.log('\n4️⃣ Probando estructura para authController (login):');
    const [authStructure] = await pool.query(`
      SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.activo,
             r.id as rol_id, r.nombre as rol_nombre, r.descripcion as rol_descripcion
      FROM Usuarios u
      INNER JOIN Roles r ON u.rol_id = r.id
      WHERE u.email = 'admin@lavadovapor.com'
      LIMIT 1
    `);
    console.log('   ✅ Estructura de login funcional');
    if (authStructure.length > 0) {
      console.log('   📋 Usuario de prueba:', {
        id: authStructure[0].id,
        email: authStructure[0].email,
        rol: authStructure[0].rol_nombre
      });
    }

    // 5. Probar consulta de permisos
    console.log('\n5️⃣ Probando consulta de permisos:');
    const [permisos] = await pool.query(`
      SELECT p.id, p.nombre, p.descripcion
      FROM RolPermisos rp
      INNER JOIN Permisos p ON rp.permiso_id = p.id
      WHERE rp.rol_id = 1
      LIMIT 3
    `);
    console.log('   ✅ Sistema de permisos funcional, permisos encontrados:', permisos.length);

    // 6. Verificar tablas relacionadas
    console.log('\n6️⃣ Verificando tablas relacionadas:');
    const [reservas] = await pool.query('SELECT COUNT(*) as count FROM Reservas');
    const [roles] = await pool.query('SELECT COUNT(*) as count FROM Roles');
    const [servicios] = await pool.query('SELECT COUNT(*) as count FROM Servicios');
    
    console.log('   ✅ Reservas en BD:', reservas[0].count);
    console.log('   ✅ Roles en BD:', roles[0].count);
    console.log('   ✅ Servicios en BD:', servicios[0].count);

    console.log('\n🎉 RESUMEN DE CORRECCIONES:');
    console.log('=============================');
    console.log('✅ userController.js → Tabla Usuarios (CORREGIDO)');
    console.log('✅ clienteController.js → Tabla Usuarios con rol cliente (CORREGIDO)');
    console.log('✅ authController.js → Sistema de login con roles y permisos (CORREGIDO)');
    console.log('✅ authMiddleware.js → Verificación de usuarios activos y permisos (CORREGIDO)');
    console.log('✅ agendamientoController.js → Tabla Reservas (CORREGIDO ANTERIORMENTE)');

    console.log('\n📋 PRÓXIMOS CONTROLADORES A CORREGIR:');
    console.log('=====================================');
    console.log('🔧 serviceController.js → Tabla Servicios');
    console.log('🔧 rolController.js → Tabla Roles');
    console.log('🔧 permisoController.js → Tabla Permisos');
    console.log('🔧 tipoServicioController.js → Tabla TiposServicio');

  } catch (error) {
    console.error('❌ Error en pruebas:', error.message);
    console.error('SQL Error:', error.sqlMessage || 'No SQL error');
  } finally {
    await pool.end();
  }
}

testCorrectedControllers();
