const pool = require('../config/db');

async function analyzeBusinessFlow() {
  try {
    console.log('🚀 ANÁLISIS COMPLETO DEL FLUJO DE NEGOCIO - AGENDAMIENTO');
    console.log('========================================================\n');

    // 1. Usuarios y Roles
    console.log('👥 USUARIOS Y ROLES:');
    const [usuarios] = await pool.query(`
      SELECT u.nombre, u.apellido, u.email, u.activo,
             r.nombre as rol,
             COUNT(res.id) as reservas_hechas
      FROM Usuarios u
      LEFT JOIN Roles r ON u.rol_id = r.id
      LEFT JOIN Reservas res ON u.id = res.cliente_id
      WHERE u.activo = 1
      GROUP BY u.id
      ORDER BY r.nombre, u.nombre
    `);
    usuarios.forEach(u => {
      console.log(`   ${u.nombre} ${u.apellido} (${u.rol}): ${u.reservas_hechas} reservas`);
    });

    // 2. Tipos de Servicio y Precios
    console.log('\n🎯 TIPOS DE SERVICIO:');
    const [tiposServicio] = await pool.query(`
      SELECT ts.id, ts.nombre, ts.descripcion, ts.multiplicador_precio, ts.color,
             COUNT(r.id) as reservas_totales
      FROM TiposServicio ts
      LEFT JOIN Reservas r ON ts.id = r.servicio_tipo_id
      GROUP BY ts.id
      ORDER BY reservas_totales DESC
    `);
    tiposServicio.forEach(ts => {
      console.log(`   ${ts.nombre} (x${ts.multiplicador_precio}): ${ts.reservas_totales} reservas`);
      console.log(`     ${ts.descripcion}\n`);
    });

    // 3. Servicios Disponibles
    console.log('🛠️ SERVICIOS DISPONIBLES:');
    const [servicios] = await pool.query(`
      SELECT s.id, s.nombre, s.precio_base, s.duracion_estimada, s.activo,
             cs.nombre as categoria
      FROM Servicios s
      LEFT JOIN CategoriasServicios cs ON s.categoria_id = cs.id
      WHERE s.activo = 1
      ORDER BY s.nombre
    `);
    servicios.forEach(s => {
      console.log(`   ${s.nombre}: $${s.precio_base} - ${s.duracion_estimada} min`);
      console.log(`     Categoría: ${s.categoria}`);
    });

    // 4. Estados de Reserva
    console.log('\n📊 ESTADOS DE RESERVA:');
    const [estadosReserva] = await pool.query(`
      SELECT er.id, er.estado, er.descripcion, er.color, 
             COUNT(r.id) as cantidad_reservas
      FROM EstadosReserva er
      LEFT JOIN Reservas r ON er.id = r.estado_id
      GROUP BY er.id
      ORDER BY cantidad_reservas DESC
    `);
    estadosReserva.forEach(e => {
      console.log(`   ${e.estado}: ${e.cantidad_reservas} reservas - ${e.descripcion}`);
    });

    // 5. Ubicaciones de Servicio
    console.log('\n📍 UBICACIONES DE SERVICIO:');
    const [ubicaciones] = await pool.query(`
      SELECT ub.id, ub.direccion, ub.barrio, ub.localidad, ub.zona, ub.activa,
             COUNT(r.id) as reservas_hechas
      FROM Ubicaciones ub
      LEFT JOIN Reservas r ON ub.id = r.ubicacion_servicio_id
      WHERE ub.activa = 1
      GROUP BY ub.id
      ORDER BY reservas_hechas DESC
    `);
    ubicaciones.forEach(u => {
      console.log(`   ${u.direccion} - ${u.barrio}, ${u.localidad} (Zona ${u.zona})`);
      console.log(`     Reservas atendidas: ${u.reservas_hechas}`);
    });

    // 6. Vehículos de Trabajo (Empresa)
    console.log('\n� VEHÍCULOS DE TRABAJO (EMPRESA):');
    const [vehiculos] = await pool.query(`
      SELECT v.id, v.placa, v.modelo, v.capacidad_tanque, v.activo, v.en_servicio,
             ub.direccion as ubicacion_actual,
             COUNT(r.id) as servicios_asignados
      FROM Vehiculos v
      LEFT JOIN Ubicaciones ub ON v.ubicacion_actual_id = ub.id
      LEFT JOIN Reservas r ON v.id = r.vehiculo_id
      GROUP BY v.id
      ORDER BY servicios_asignados DESC
    `);
    vehiculos.forEach(v => {
      const estado = v.en_servicio ? 'EN SERVICIO' : v.activo ? 'DISPONIBLE' : 'INACTIVO';
      console.log(`   ${v.placa} (${v.modelo}): ${estado}`);
      console.log(`     Capacidad: ${v.capacidad_tanque}L | Ubicación: ${v.ubicacion_actual}`);
      console.log(`     Servicios asignados: ${v.servicios_asignados}`);
    });

    // 7. Reservas Completas
    console.log('\n📅 RESERVAS REGISTRADAS:');
    const [reservas] = await pool.query(`
      SELECT r.id, r.fecha_reserva, r.fecha_servicio, r.precio_total,
             cliente.nombre as cliente_nombre, cliente.apellido,
             tecnico.nombre as tecnico_nombre,
             ts.nombre as tipo_servicio,
             v.placa, v.modelo,
             ub.direccion, ub.barrio, ub.localidad,
             er.estado, r.observaciones
      FROM Reservas r
      LEFT JOIN Usuarios cliente ON r.cliente_id = cliente.id
      LEFT JOIN Usuarios tecnico ON r.tecnico_id = tecnico.id
      LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
      LEFT JOIN Vehiculos v ON r.vehiculo_id = v.id
      LEFT JOIN Ubicaciones ub ON r.ubicacion_servicio_id = ub.id
      LEFT JOIN EstadosReserva er ON r.estado_id = er.id
      ORDER BY r.fecha_reserva DESC
    `);
    
    if (reservas.length > 0) {
      reservas.forEach(r => {
        console.log(`   Reserva #${r.id}: ${r.cliente_nombre} ${r.apellido}`);
        console.log(`     Servicio: ${r.tipo_servicio} | Vehículo trabajo: ${r.placa} (${r.modelo})`);
        console.log(`     Técnico: ${r.tecnico_nombre} | Ubicación: ${r.direccion} - ${r.barrio}`);
        console.log(`     Fecha servicio: ${r.fecha_servicio} | Estado: ${r.estado}`);
        console.log(`     Precio: $${r.precio_total} | Observaciones: ${r.observaciones}\n`);
      });
    } else {
      console.log('   No hay reservas registradas aún.');
    }

    // 8. ANÁLISIS DEL FLUJO DE NEGOCIO
    console.log('🔄 FLUJO DE NEGOCIO IDENTIFICADO:');
    console.log('=================================');
    
    console.log('\n📋 PROCESO ACTUAL:');
    console.log('1. 👤 CLIENTE se registra/autentica (rol: cliente)');
    console.log('2. � CLIENTE proporciona UBICACIÓN de servicio');
    console.log('3. 🎯 CLIENTE selecciona TIPO de servicio (Sencillo/Premium/Gold)');
    console.log('4. 📅 CLIENTE agenda FECHA y HORA del servicio');
    console.log('5. 💰 SISTEMA calcula precio (depende del tipo de servicio)');
    console.log('6. 👷 SISTEMA asigna TÉCNICO disponible');
    console.log('7. 🚛 SISTEMA asigna VEHÍCULO DE TRABAJO');
    console.log('8. 📝 SISTEMA crea RESERVA con estado "pendiente"');
    console.log('9. ✅ TÉCNICO confirma y cambia estado a "asignada"');
    console.log('10. �️ TÉCNICO se dirige al lugar (estado "en_camino")');
    console.log('11. 🔧 TÉCNICO inicia servicio (estado "en_proceso")');
    console.log('12. 📝 TÉCNICO añade notas del trabajo realizado');
    console.log('13. 🏁 SERVICIO se marca como "completada"');

    // 9. MÉTRICAS REALES
    console.log('\n📈 MÉTRICAS ACTUALES DEL NEGOCIO:');
    const [metricasUsuarios] = await pool.query('SELECT COUNT(*) as total FROM Usuarios WHERE activo = 1');
    const [metricasClientes] = await pool.query('SELECT COUNT(*) as total FROM Usuarios u JOIN Roles r ON u.rol_id = r.id WHERE r.nombre = "cliente" AND u.activo = 1');
    const [metricasTecnicos] = await pool.query('SELECT COUNT(*) as total FROM Usuarios u JOIN Roles r ON u.rol_id = r.id WHERE r.nombre = "tecnico" AND u.activo = 1');
    const [metricasVehiculos] = await pool.query('SELECT COUNT(*) as total FROM Vehiculos');
    const [metricasServicios] = await pool.query('SELECT COUNT(*) as total FROM Servicios');
    const [metricasUbicaciones] = await pool.query('SELECT COUNT(*) as total FROM Ubicaciones WHERE activa = 1');
    const [metricasReservas] = await pool.query('SELECT COUNT(*) as total, COALESCE(AVG(precio_total), 0) as promedio, COALESCE(SUM(precio_total), 0) as ingresos FROM Reservas');
    
    console.log(`   👥 Usuarios activos: ${metricasUsuarios[0].total}`);
    console.log(`   👤 Clientes: ${metricasClientes[0].total}`);
    console.log(`   👷 Técnicos: ${metricasTecnicos[0].total}`);
    console.log(`   🚗 Vehículos registrados: ${metricasVehiculos[0].total}`);
    console.log(`   🛠️ Servicios disponibles: ${metricasServicios[0].total}`);
    console.log(`   📍 Ubicaciones activas: ${metricasUbicaciones[0].total}`);
    console.log(`   📅 Total reservas: ${metricasReservas[0].total}`);
    console.log(`   💰 Ticket promedio: $${parseFloat(metricasReservas[0].promedio).toFixed(2)}`);
    console.log(`   💵 Ingresos totales: $${parseFloat(metricasReservas[0].ingresos).toFixed(2)}`);

    // 10. ANÁLISIS DE OPORTUNIDADES
    console.log('\n🚀 OPORTUNIDADES DE MEJORA IDENTIFICADAS:');
    console.log('==========================================');
    
    console.log('\n🎯 FUNCIONALIDADES CORE FALTANTES:');
    console.log('   • ⏰ Validación de disponibilidad de horarios');
    console.log('   • 🗓️ Calendario visual para selección de fechas');
    console.log('   • 🔔 Sistema de notificaciones automáticas');
    console.log('   • 📱 Confirmación vía SMS/email');
    
    console.log('\n💼 MEJORAS DE NEGOCIO:');
    console.log('   • 🏆 Sistema de rating y reviews');
    console.log('   • 🎁 Programa de fidelización');
    console.log('   • 📊 Dashboard de métricas en tiempo real');
    console.log('   • 🔄 Servicios recurrentes/suscripciones');
    
    console.log('\n⚡ OPTIMIZACIONES TÉCNICAS:');
    console.log('   • 🗺️ Optimización de rutas para técnicos');
    console.log('   • 📡 WebSockets para actualizaciones en tiempo real');
    console.log('   • 📸 Galería de fotos antes/después');
    console.log('   • 💾 Cache para consultas frecuentes');

    console.log('\n✅ ANÁLISIS COMPLETADO - SISTEMA LISTO PARA MEJORAS');

  } catch (error) {
    console.error('❌ Error en análisis:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

analyzeBusinessFlow();
