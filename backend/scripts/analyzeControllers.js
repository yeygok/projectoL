const fs = require('fs');
const path = require('path');

const analyzeControllers = () => {
  console.log('🔍 ANÁLISIS DE CONTROLADORES VS BASE DE DATOS REAL');
  console.log('=' .repeat(60));
  
  const controllersDir = path.join(__dirname, '../controllers');
  const controllers = fs.readdirSync(controllersDir).filter(file => file.endsWith('.js'));
  
  // Mapeo de nombres esperados vs nombres reales
  const tableMapping = {
    // NOMBRES EN CÓDIGO → NOMBRES REALES EN BD
    'usuario': 'Usuarios',
    'cliente': 'Usuarios', // (con rol_id = cliente)
    'agendamiento': 'Reservas',
    'servicio': 'Servicios',
    'producto': '❌ NO EXISTE (usar Servicios)',
    'rol': 'Roles',
    'permiso': 'Permisos',
    'perfil': '❌ NO EXISTE (usar Roles)',
    'estado_orden': 'EstadosReserva',
    'estado_usuario': '❌ NO EXISTE',
    'tipo_servicio': 'TiposServicio',
    'tipo_documento': '❌ NO EXISTE',
    'tipo_contrato': '❌ NO EXISTE',
    'direccion': 'Ubicaciones'
  };
  
  const realTables = [
    'Usuarios', 'Reservas', 'Servicios', 'TiposServicio', 'Vehiculos',
    'Roles', 'Permisos', 'RolPermisos', 'EstadosReserva', 'EstadosSoporte',
    'CategoriasServicios', 'ServiciosTipos', 'Ubicaciones', 'Tokens',
    'Notificaciones', 'Calificaciones', 'HistorialServicios', 'OrdenesCompra', 'Soporte'
  ];
  
  console.log('\n📋 CONTROLADORES ENCONTRADOS:');
  console.log('-'.repeat(40));
  
  const priorities = { high: [], medium: [], low: [], noExist: [] };
  
  controllers.forEach((controller, index) => {
    const baseName = controller.replace('Controller.js', '').toLowerCase();
    const expectedTable = getExpectedTableName(baseName);
    const realTable = tableMapping[expectedTable] || 'No mapeado';
    
    console.log(`${index + 1}. ${controller}`);
    console.log(`   Espera tabla: "${expectedTable}"`);
    console.log(`   Tabla real: ${realTable}`);
    
    // Clasificar por prioridad
    if (realTable.includes('❌')) {
      priorities.noExist.push({ controller, expectedTable, realTable });
    } else if (['agendamiento', 'usuario', 'cliente'].includes(expectedTable)) {
      priorities.high.push({ controller, expectedTable, realTable });
    } else if (['servicio', 'rol', 'permiso'].includes(expectedTable)) {
      priorities.medium.push({ controller, expectedTable, realTable });
    } else {
      priorities.low.push({ controller, expectedTable, realTable });
    }
    
    console.log('');
  });
  
  console.log('\n🎯 PRIORIDADES DE CORRECCIÓN:');
  console.log('=' .repeat(60));
  
  console.log('\n🚨 ALTA PRIORIDAD (Funcionalidad crítica):');
  priorities.high.forEach(item => {
    console.log(`  ✅ ${item.controller} → ${item.realTable}`);
  });
  
  console.log('\n⚠️  MEDIA PRIORIDAD (Funcionalidad importante):');
  priorities.medium.forEach(item => {
    console.log(`  🔧 ${item.controller} → ${item.realTable}`);
  });
  
  console.log('\n📝 BAJA PRIORIDAD (Funcionalidad auxiliar):');
  priorities.low.forEach(item => {
    console.log(`  📋 ${item.controller} → ${item.realTable}`);
  });
  
  console.log('\n❌ NO EXISTEN EN BD (Eliminar o adaptar):');
  priorities.noExist.forEach(item => {
    console.log(`  🗑️  ${item.controller} → ${item.realTable}`);
  });
  
  console.log('\n📊 TABLAS REALES DISPONIBLES:');
  console.log('-'.repeat(40));
  realTables.forEach((table, index) => {
    const used = Object.values(tableMapping).includes(table);
    console.log(`${index + 1}. ${table} ${used ? '✅' : '⚠️  Sin controlador'}`);
  });
  
  console.log('\n💡 RECOMENDACIONES:');
  console.log('-'.repeat(40));
  console.log('1. 🔥 CORREGIR INMEDIATAMENTE: userController, clienteController');
  console.log('2. 🔧 CORREGIR DESPUÉS: serviceController, rolController, permisoController');
  console.log('3. 🗑️  ELIMINAR: productController, perfilController, estadoUsuarioController');
  console.log('4. 🆕 CREAR NUEVOS: vehiculoController, ubicacionController');
};

function getExpectedTableName(controllerName) {
  // Convertir nombre de controlador a nombre de tabla esperado
  const mappings = {
    'agendamiento': 'agendamiento',
    'auth': 'usuario',
    'cliente': 'cliente',
    'direccion': 'direccion',
    'estadoorden': 'estado_orden',
    'estadousuario': 'estado_usuario',
    'perfil': 'perfil',
    'permiso': 'permiso',
    'product': 'producto',
    'rol': 'rol',
    'rolmodulo': 'rol_modulo',
    'rolpermiso': 'rol_permiso',
    'service': 'servicio',
    'tipocontrato': 'tipo_contrato',
    'tipodocumento': 'tipo_documento',
    'tiposervicio': 'tipo_servicio',
    'tiposervicioproducto': 'tipo_servicio_producto',
    'user': 'usuario'
  };
  
  return mappings[controllerName] || controllerName;
}

analyzeControllers();
