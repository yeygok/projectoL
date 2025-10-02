# 🚀 PLAN DE DESARROLLO COMPLETO - PROYECTO LAVADO VAPOR BOGOTÁ

## 📋 **RESUMEN EJECUTIVO**

Este documento establece el plan estratégico de desarrollo dividido en **4 FASES** claras y alcanzables, priorizando funcionalidades críticas y mejores prácticas de desarrollo.

---

## 🎯 **OBJETIVOS PRINCIPALES**

1. ✅ **75% de tablas con CRUD completo en Dashboard Admin** (14/19 tablas)
2. ✅ **Frontend público para clientes** (landing page + servicios + agendamiento)
3. ✅ **Sistema de emails automáticos** (confirmación de reservas)
4. ✅ **Perfil de usuario editable** (cliente puede cambiar sus datos)
5. ✅ **Sistema de roles y permisos funcional** (admin vs cliente)

---

## 📊 **ANÁLISIS DE COBERTURA ACTUAL**

### **Backend - Estado de Tablas:**

| Tabla | CRUD | Prioridad | Fase |
|-------|------|-----------|------|
| ✅ Usuarios | Completo | Alta | ✓ |
| ✅ Servicios | Completo | Alta | ✓ |
| ✅ Ubicaciones | Completo | Alta | ✓ |
| ✅ Vehículos | Completo | Alta | ✓ |
| ✅ Reservas | Completo | Alta | ✓ |
| ✅ Roles | Completo | Alta | ✓ |
| ✅ Permisos | Completo | Alta | ✓ |
| ✅ RolPermisos | Completo | Alta | ✓ |
| 🟡 CategoriasServicios | Solo GET | **Alta** | **FASE 1** |
| 🟡 TiposServicio | Solo GET | **Alta** | **FASE 1** |
| 🟡 EstadosReserva | Solo GET | Media | **FASE 2** |
| ❌ Calificaciones | Sin implementar | **Alta** | **FASE 2** |
| ❌ Notificaciones | Sin implementar | **Alta** | **FASE 2** |
| ❌ HistorialServicios | Sin implementar | Media | FASE 3 |
| ❌ Soporte | Sin implementar | Media | FASE 3 |
| ❌ OrdenesCompra | Sin implementar | Baja | FASE 4 |
| ❌ ServiciosTipos | Sin implementar | Baja | FASE 4 |
| ❌ EstadosSoporte | Sin implementar | Baja | FASE 4 |
| ❌ Tokens | Sin implementar | Baja | FASE 4 |

**Cobertura Actual:** 8/19 (42%) → **Objetivo:** 14/19 (75%)

---

## 🎯 **FASE 1: COMPLETAR DASHBOARD ADMIN (3-4 días)**

### **Objetivo:** Alcanzar 63% de cobertura CRUD (12/19 tablas)

#### **1.1 Backend - Completar CRUD Faltantes**

##### **A. CategoriasServicios CRUD** ⭐ CRÍTICO
```javascript
// Archivos a crear/modificar:
- backend/controllers/categoriaController.js (NUEVO)
- backend/routes/categoria.js (NUEVO)
- Actualizar backend/routes/dashboard.js

// Funcionalidades:
✅ GET /api/categorias (ya existe)
🔥 POST /api/categorias (crear categoría)
🔥 PUT /api/categorias/:id (actualizar)
🔥 DELETE /api/categorias/:id (soft delete)

// Validaciones:
- Nombre único
- Icono opcional (Font Awesome / Material Icons)
- Campo 'orden' para ordenar en frontend
- Campo 'activa' para soft delete
```

##### **B. TiposServicio CRUD** ⭐ CRÍTICO
```javascript
// Archivos a crear/modificar:
- backend/controllers/tipoServicioController.js (NUEVO)
- Actualizar backend/routes/tipo_servicio.js

// Funcionalidades:
✅ GET /api/tipos-servicio (ya existe)
🔥 POST /api/tipos-servicio (crear tipo)
🔥 PUT /api/tipos-servicio/:id (actualizar)
🔥 DELETE /api/tipos-servicio/:id (soft delete)

// Validaciones:
- Nombre único
- multiplicador_precio (decimal)
- Color en formato HEX (#RRGGBB)
```

##### **C. Reservas/Agendamiento - Mejoras** ⭐ CRÍTICO
```javascript
// Archivos a modificar:
- backend/controllers/agendamientoController.js

// Funcionalidades a agregar:
🔥 Integración con emailService al crear reserva
🔥 Validación de disponibilidad de técnico
🔥 Validación de disponibilidad de vehículo
🔥 Cálculo automático de precio_total
🔥 Endpoint para cambiar estado
🔥 Notificación por email en cambio de estado
```

#### **1.2 Frontend - Páginas Dashboard Admin**

##### **A. Gestión de Categorías**
```jsx
// Archivo: front_pl/src/pages/DashboardCategorias.jsx (NUEVO)

Componentes necesarios:
- DataTable con categorías
- FormDialog para crear/editar
- Botones de acciones (editar, eliminar)
- Ordenamiento drag-and-drop (opcional)
- Preview de iconos

Funcionalidades:
✅ Listar todas las categorías
✅ Crear nueva categoría
✅ Editar categoría existente
✅ Eliminar (soft delete) categoría
✅ Cambiar orden de visualización
✅ Filtros y búsqueda
```

##### **B. Gestión de Tipos de Servicio**
```jsx
// Archivo: front_pl/src/pages/DashboardTiposServicio.jsx (MODIFICAR)

Componentes necesarios:
- DataTable con tipos
- FormDialog para crear/editar
- Color picker para seleccionar color
- Input para multiplicador de precio

Funcionalidades:
✅ Listar todos los tipos
✅ Crear nuevo tipo
✅ Editar tipo existente
✅ Eliminar (soft delete) tipo
✅ Previsualización de color
```

##### **C. Gestión de Estados de Reserva**
```jsx
// Archivo: front_pl/src/pages/DashboardEstadosReserva.jsx (NUEVO)

Funcionalidades:
✅ Listar estados
✅ Crear nuevo estado
✅ Editar estado
✅ Asignar colores (para badges)
✅ Definir flujo de estados (orden lógico)
```

#### **1.3 Testing y Validación**
```bash
# Checklist de validación:
□ Todas las rutas CRUD responden correctamente
□ Validaciones backend funcionando
□ Frontend muestra errores apropiadamente
□ Soft deletes funcionan (activo=0)
□ Relaciones de BD respetadas
□ Postman collection actualizada
```

---

## 🌐 **FASE 2: FRONTEND PÚBLICO PARA CLIENTES (4-5 días)**

### **Objetivo:** Sitio web público funcional + sistema de agendamiento

#### **2.1 Landing Page (Página Principal)**

##### **A. Sección Hero**
```jsx
// Archivo: front_pl/src/pages/Home.jsx (MODIFICAR EXTENSAMENTE)

Componentes:
- Hero section con CTA (Call to Action)
- Botón "Agendar Servicio"
- Imágenes de servicios
- Video promocional (opcional)

Contenido:
- Título principal: "Limpieza Profesional con Vapor"
- Subtítulo: "En Bogotá, en tu hogar u oficina"
- CTA: "Agenda tu servicio ahora"
- WhatsApp flotante
```

##### **B. Sección Servicios**
```jsx
// Componente: front_pl/src/components/public/ServiciosSection.jsx (NUEVO)

Funcionalidades:
✅ Grid de categorías de servicios
✅ Cards con iconos y descripción
✅ Precios base
✅ Botón "Ver más" → modal con detalles
✅ Botón "Agendar" → formulario

Datos dinámicos desde:
- GET /api/categorias (categorías activas)
- GET /api/servicios (servicios activos)
- GET /api/tipos-servicio (tipos disponibles)
```

##### **C. Sección "Nosotros"**
```jsx
// Componente: front_pl/src/components/public/NosotrosSection.jsx (NUEVO)

Contenido:
- Historia de la empresa
- Misión y visión
- Valores (calidad, puntualidad, profesionalismo)
- Equipo (fotos de técnicos)
- Certificaciones
- Zonas de cobertura en Bogotá (mapa)
```

##### **D. Sección Testimonios**
```jsx
// Componente: front_pl/src/components/public/TestimoniosSection.jsx (NUEVO)

Funcionalidades:
✅ Carrusel de testimonios
✅ Calificaciones con estrellas
✅ Fotos de clientes (opcional)
✅ Integración con sistema de calificaciones (FASE 2.3)
```

##### **E. Footer y Contacto**
```jsx
// Componente: front_pl/src/components/public/Footer.jsx (NUEVO)

Contenido:
- Datos de contacto (teléfono, email, WhatsApp)
- Redes sociales
- Mapa de ubicación
- Horarios de atención
- Links legales (términos, privacidad)
```

#### **2.2 Sistema de Agendamiento Público**

##### **A. Formulario de Agendamiento**
```jsx
// Componente: front_pl/src/components/public/AgendamientoForm.jsx (NUEVO)

Pasos del formulario (Wizard):

PASO 1: Selección de Servicio
- Categoría de servicio (dropdown)
- Tipo de servicio (Sencillo, Premium, Gold, etc.)
- Mostrar precio estimado

PASO 2: Fecha y Hora
- Calendar picker (react-datepicker)
- Time slots disponibles
- Validación de disponibilidad (backend)
- Endpoint: GET /api/agendamiento/disponibilidad?fecha=XXX

PASO 3: Ubicación
- Autocompletado de dirección (Google Maps API - opcional)
- Campos: dirección, barrio, localidad, zona
- Guardar ubicación si es cliente registrado
- Usar ubicación guardada si existe

PASO 4: Datos del Cliente
- Si NO está logueado:
  * Nombre, apellido, teléfono, email
  * Opción "Crear cuenta" (checkbox)
  * Si marca checkbox, pedir contraseña
- Si está logueado:
  * Mostrar datos pre-llenados
  * Permitir editar

PASO 5: Confirmación
- Resumen de la reserva
- Precio total calculado
- Términos y condiciones (checkbox)
- Botón "Confirmar Reserva"

Validaciones:
✅ Fecha no puede ser en el pasado
✅ Horario de atención (8am-6pm)
✅ Email único (si crea cuenta)
✅ Teléfono válido
✅ Mínimo 2 horas de anticipación
```

##### **B. Backend - Endpoint de Agendamiento**
```javascript
// Archivo: backend/controllers/agendamientoController.js (MODIFICAR)

POST /api/agendamiento/publico (NUEVO - sin auth)

Flujo:
1. Validar datos del formulario
2. Verificar disponibilidad de fecha/hora
3. Si cliente nuevo:
   - Crear usuario con rol 'cliente'
   - Hashear contraseña (si creó cuenta)
   - Generar token de verificación
4. Si cliente existente:
   - Buscar por email
5. Calcular precio_total:
   - precio_base * tipo.multiplicador_precio
6. Crear ubicación si no existe
7. Crear reserva con estado_id = 'pendiente'
8. 🔥 ENVIAR EMAIL DE CONFIRMACIÓN
9. Retornar:
   - id_reserva
   - mensaje de éxito
   - datos del cliente (sin password)
```

##### **C. Email de Confirmación** ⭐ CRÍTICO
```javascript
// Archivo: backend/controllers/agendamientoController.js

// Después de crear la reserva:
try {
  const reservaData = {
    cliente: { nombre, apellido, email, telefono },
    reserva: { id, fecha_servicio, precio_total, estado, observaciones },
    servicio: { tipo, descripcion },
    ubicacion: { direccion, barrio, localidad },
    tecnico: null // Por asignar
  };
  
  await emailService.sendReservaConfirmation(reservaData);
  
} catch (emailError) {
  console.error('Error enviando email:', emailError);
  // NO fallar la reserva si falla el email
}
```

#### **2.3 Sistema de Calificaciones** ⭐ IMPORTANTE

##### **A. Backend - CRUD Calificaciones**
```javascript
// Archivo: backend/controllers/calificacionController.js (NUEVO)
// Archivo: backend/routes/calificacion.js (NUEVO)

Endpoints:
POST /api/calificaciones (crear calificación)
GET /api/calificaciones (listar todas - admin)
GET /api/calificaciones/servicio/:servicio_id (por servicio)
GET /api/calificaciones/cliente/:cliente_id (por cliente)
PUT /api/calificaciones/:id (editar calificación)
DELETE /api/calificaciones/:id (eliminar)

Validaciones:
- Solo clientes pueden calificar
- Solo pueden calificar servicios que recibieron (estado='completada')
- Una calificación por reserva
- Puntuación: 1-5 estrellas
- Comentario opcional (max 500 caracteres)
```

##### **B. Frontend - Componente de Calificaciones**
```jsx
// Componente: front_pl/src/components/CalificacionForm.jsx (NUEVO)

Funcionalidades:
✅ Selector de estrellas (1-5)
✅ Textarea para comentario
✅ Validación: solo reservas completadas
✅ Mostrar en perfil de cliente
✅ Mostrar en página pública (testimonios)
```

#### **2.4 Perfil de Cliente Editable**

##### **A. Backend - Endpoint de Actualización**
```javascript
// Archivo: backend/controllers/perfilController.js (MODIFICAR)

PUT /api/perfil (actualizar datos del usuario logueado)

Campos editables:
- nombre
- apellido
- telefono
- ubicacion_id (dirección principal)
- password (opcional - requiere password_actual)

Validaciones:
✅ Token válido (usuario logueado)
✅ Email NO se puede cambiar (o requiere verificación)
✅ Si cambia password, validar password_actual
✅ Hashear nuevo password
✅ No puede cambiar su propio rol
```

##### **B. Frontend - Página de Perfil**
```jsx
// Archivo: front_pl/src/pages/ClienteProfile.jsx (MODIFICAR)

Secciones:
1. Datos Personales (editable)
   - Nombre, apellido, teléfono
   - Botón "Guardar cambios"

2. Ubicaciones Guardadas
   - Lista de direcciones
   - Marcar como principal
   - Agregar nueva
   - Eliminar

3. Mis Reservas
   - Tabla de reservas (historial)
   - Estados: pendiente, confirmada, completada, cancelada
   - Botón "Ver detalles"
   - Opción de cancelar (si estado=pendiente)

4. Calificaciones
   - Servicios pendientes de calificar
   - Historial de calificaciones

5. Cambiar Contraseña
   - Form separado
   - Contraseña actual
   - Nueva contraseña
   - Confirmar contraseña
```

---

## 📧 **FASE 3: SISTEMA DE EMAILS AUTOMÁTICOS (2-3 días)**

### **Objetivo:** Implementar envío automático de emails en flujos críticos

#### **3.1 Configuración de Producción**

##### **A. Variables de Entorno**
```bash
# Archivo: backend/.env

# Email Configuration (Gmail)
EMAIL_USER=yeygok777@gmail.com
EMAIL_PASS=tu_app_password_aqui  # ⚠️ Usar App Password de Gmail
EMAIL_FROM_NAME=Lavado Vapor Bogotá

# O usar servicio profesional:
# SendGrid, Mailgun, AWS SES, etc.
```

##### **B. Verificar Configuración**
```javascript
// Test de conexión
// Endpoint: GET /api/test-email (solo admin)

router.get('/test-email', authMiddleware, async (req, res) => {
  const result = await emailService.testConnection();
  res.json(result);
});
```

#### **3.2 Integración en Flujos**

##### **A. Al Crear Reserva** ⭐ CRÍTICO
```javascript
// backend/controllers/agendamientoController.js

createAgendamiento() {
  // ... código existente ...
  
  // 🔥 ENVIAR EMAIL
  await emailService.sendReservaConfirmation({
    cliente: { ... },
    reserva: { ... },
    servicio: { ... },
    ubicacion: { ... },
    tecnico: null
  });
}
```

##### **B. Al Cambiar Estado de Reserva**
```javascript
// Nuevo endpoint: PUT /api/agendamiento/:id/estado

updateEstado(req, res) {
  const { id } = req.params;
  const { nuevo_estado_id } = req.body;
  
  // Obtener estado anterior
  const estadoAnterior = await getEstadoActual(id);
  
  // Actualizar estado
  await pool.query('UPDATE Reservas SET estado_id = ? WHERE id = ?', 
    [nuevo_estado_id, id]);
  
  // Obtener estado nuevo
  const estadoNuevo = await getEstadoById(nuevo_estado_id);
  
  // 🔥 ENVIAR EMAIL
  await emailService.sendStatusUpdate(reservaData, estadoNuevo, estadoAnterior);
}
```

##### **C. Al Asignar Técnico**
```javascript
// Cuando admin asigna técnico a reserva

assignTecnico(req, res) {
  const { id } = req.params;
  const { tecnico_id } = req.body;
  
  // Actualizar reserva
  await pool.query('UPDATE Reservas SET tecnico_id = ? WHERE id = ?', 
    [tecnico_id, id]);
  
  // Obtener datos del técnico
  const tecnico = await getUserById(tecnico_id);
  
  // 🔥 ENVIAR EMAIL AL TÉCNICO
  await emailService.sendTecnicoNotification(reservaData);
  
  // 🔥 ENVIAR EMAIL AL CLIENTE (estado actualizado)
  await emailService.sendStatusUpdate(reservaData, 'asignada', 'pendiente');
}
```

##### **D. Recordatorios Automáticos** (Opcional - Cron Job)
```javascript
// backend/scripts/sendReminders.js (NUEVO)

// Ejecutar diariamente con cron
// Buscar reservas para mañana
// Enviar email de recordatorio

const cron = require('node-cron');

// Ejecutar todos los días a las 8am
cron.schedule('0 8 * * *', async () => {
  console.log('🔔 Enviando recordatorios...');
  
  const reservasMañana = await pool.query(`
    SELECT * FROM Reservas 
    WHERE DATE(fecha_servicio) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    AND estado_id = (SELECT id FROM EstadosReserva WHERE estado = 'confirmada')
  `);
  
  for (const reserva of reservasMañana[0]) {
    await emailService.sendReminder(reservaData);
  }
});
```

#### **3.3 Testing de Emails**

```bash
Checklist:
□ Test de conexión exitoso
□ Email de confirmación llega al cliente
□ Email de asignación llega al técnico
□ Emails de cambio de estado funcionan
□ Plantillas se ven bien en móvil
□ Links en emails funcionan
□ Remitente aparece correctamente
```

---

## 📈 **FASE 4: FUNCIONALIDADES AVANZADAS (3-4 días)**

### **Objetivo:** Sistema de notificaciones, historial y soporte

#### **4.1 Sistema de Notificaciones** ⭐ IMPORTANTE

##### **A. Backend - CRUD Notificaciones**
```javascript
// Tabla: Notificaciones
// Campos: id, usuario_id, tipo, titulo, mensaje, leida, created_at

Endpoints:
GET /api/notificaciones (del usuario logueado)
GET /api/notificaciones/no-leidas (contador)
PUT /api/notificaciones/:id/leer (marcar como leída)
PUT /api/notificaciones/leer-todas (marcar todas)
DELETE /api/notificaciones/:id (eliminar)

Tipos de notificaciones:
- reserva_creada
- reserva_confirmada
- tecnico_asignado
- servicio_en_camino
- servicio_iniciado
- servicio_completado
- recordatorio_servicio
- calificacion_recibida (para técnicos)
```

##### **B. Frontend - Componente de Notificaciones**
```jsx
// Componente: front_pl/src/components/NotificationBell.jsx (NUEVO)

Funcionalidades:
✅ Icono de campana en navbar
✅ Badge con contador de no leídas
✅ Dropdown con últimas 5 notificaciones
✅ Click → marcar como leída
✅ Link "Ver todas" → página completa
✅ Auto-refresh cada 30 segundos
```

##### **C. Crear Notificaciones Automáticas**
```javascript
// Helper: backend/helpers/notificationHelper.js (NUEVO)

async function createNotification(usuario_id, tipo, titulo, mensaje) {
  await pool.query(`
    INSERT INTO Notificaciones (usuario_id, tipo, titulo, mensaje, leida)
    VALUES (?, ?, ?, ?, 0)
  `, [usuario_id, tipo, titulo, mensaje]);
}

// Usar en:
- createAgendamiento() → cliente y admin
- updateEstado() → cliente
- assignTecnico() → técnico y cliente
```

#### **4.2 Historial de Servicios**

##### **A. Backend - CRUD Historial**
```javascript
// Tabla: HistorialServicios
// Auditoría de cambios en servicios

Funcionalidades:
- Trigger automático en UPDATE Servicios
- Guardar: id_servicio, campo_modificado, valor_anterior, valor_nuevo, modificado_por, fecha
- Endpoint: GET /api/servicios/:id/historial (admin)
```

##### **B. Frontend - Ver Historial**
```jsx
// En DashboardServicios.jsx
// Botón "Ver historial" por servicio
// Modal con timeline de cambios
```

#### **4.3 Sistema de Soporte**

##### **A. Backend - CRUD Tickets**
```javascript
// Tabla: Soporte
// Campos: id, usuario_id, asunto, mensaje, estado_id, prioridad, created_at

Endpoints:
POST /api/soporte (crear ticket)
GET /api/soporte (listar - admin ve todos, usuario ve suyos)
GET /api/soporte/:id (ver detalle)
PUT /api/soporte/:id (actualizar estado - solo admin)
POST /api/soporte/:id/respuesta (agregar respuesta)

Estados:
- abierto
- en_revision
- resuelto
- cerrado

Prioridades:
- baja
- media
- alta
- urgente
```

##### **B. Frontend - Sistema de Tickets**
```jsx
// Cliente:
- Página: front_pl/src/pages/ClienteSoporte.jsx
- Formulario de nuevo ticket
- Lista de mis tickets
- Ver respuestas

// Admin:
- Página: front_pl/src/pages/DashboardSoporte.jsx
- Lista de todos los tickets
- Filtros por estado/prioridad
- Asignar a técnico/soporte
- Responder tickets
```

---

## 📊 **FASE 5: OPTIMIZACIONES Y PULIDO (2-3 días)**

### **Objetivo:** Mejorar rendimiento, UX y seguridad

#### **5.1 Optimizaciones Backend**

##### **A. Paginación**
```javascript
// Implementar en todos los GET que retornan listas

GET /api/usuarios?page=1&limit=10
GET /api/reservas?page=1&limit=20
GET /api/servicios?page=1&limit=15

// Response:
{
  data: [...],
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalItems: 48,
    itemsPerPage: 10
  }
}
```

##### **B. Filtros y Búsqueda**
```javascript
// Implementar query params

GET /api/reservas?estado=pendiente&fecha_desde=2025-01-01&fecha_hasta=2025-01-31
GET /api/usuarios?rol=cliente&activo=1&search=juan
GET /api/servicios?categoria_id=1&activo=1
```

##### **C. Caching**
```javascript
// Redis para datos que no cambian frecuentemente
// Categorías, tipos de servicio, estados

const redis = require('redis');
const client = redis.createClient();

// Cache de 1 hora
const CACHE_TTL = 3600;

async getCategorias(req, res) {
  const cached = await client.get('categorias');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const categorias = await fetchFromDB();
  await client.setex('categorias', CACHE_TTL, JSON.stringify(categorias));
  res.json(categorias);
}
```

##### **D. Validaciones Mejoradas**
```javascript
// Usar express-validator

const { body, validationResult } = require('express-validator');

router.post('/usuarios',
  body('email').isEmail().normalizeEmail(),
  body('telefono').isMobilePhone('es-CO'),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... crear usuario
  }
);
```

#### **5.2 Optimizaciones Frontend**

##### **A. Lazy Loading de Páginas**
```jsx
// App.jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClienteProfile = lazy(() => import('./pages/ClienteProfile'));

<Suspense fallback={<CircularProgress />}>
  <Dashboard />
</Suspense>
```

##### **B. React Query para Cache**
```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { data: servicios, isLoading } = useQuery({
  queryKey: ['servicios'],
  queryFn: () => servicioService.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000 // 10 minutos
});
```

##### **C. Optimistic Updates**
```jsx
const mutation = useMutation({
  mutationFn: updateUsuario,
  onMutate: async (newData) => {
    // Cancelar queries pendientes
    await queryClient.cancelQueries({ queryKey: ['usuarios'] });
    
    // Snapshot del valor anterior
    const previousData = queryClient.getQueryData(['usuarios']);
    
    // Actualizar optimistamente
    queryClient.setQueryData(['usuarios'], (old) => 
      old.map(u => u.id === newData.id ? newData : u)
    );
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Revertir en caso de error
    queryClient.setQueryData(['usuarios'], context.previousData);
  }
});
```

##### **D. Error Boundaries**
```jsx
// components/ErrorBoundary.jsx

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
```

#### **5.3 Seguridad**

##### **A. Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests
  message: 'Demasiadas peticiones, intenta más tarde'
});

app.use('/api/', limiter);

// Límite más estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login'
});

app.use('/api/auth/login', loginLimiter);
```

##### **B. Helmet.js**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

##### **C. XSS Protection**
```javascript
const xss = require('xss-clean');
app.use(xss());
```

##### **D. SQL Injection Prevention**
```javascript
// Ya estamos usando prepared statements (pool.query con ?)
// Mantener esta práctica SIEMPRE
```

#### **5.4 Testing**

##### **A. Tests Unitarios Backend**
```javascript
// Usar Jest + Supertest

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
  
  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toBe(401);
  });
});
```

##### **B. Tests E2E Frontend**
```javascript
// Usar Cypress

describe('Agendamiento Flow', () => {
  it('should complete booking', () => {
    cy.visit('/');
    cy.contains('Agendar Servicio').click();
    cy.get('[data-testid=servicio-select]').select('Lavado de Colchón');
    cy.get('[data-testid=tipo-select]').select('Premium');
    cy.get('[data-testid=fecha-input]').type('2025-10-15');
    cy.get('[data-testid=submit-button]').click();
    cy.contains('Reserva confirmada').should('be.visible');
  });
});
```

---

## 📋 **RESUMEN DE ENTREGAS POR FASE**

### **FASE 1 (3-4 días):**
✅ CRUD completo de CategoriasServicios  
✅ CRUD completo de TiposServicio  
✅ CRUD completo de EstadosReserva  
✅ Páginas frontend en dashboard admin  
✅ 63% de cobertura CRUD (12/19 tablas)

### **FASE 2 (4-5 días):**
✅ Landing page completa  
✅ Sección de servicios dinámica  
✅ Sistema de agendamiento público  
✅ CRUD de calificaciones  
✅ Perfil de cliente editable  
✅ Sistema de ubicaciones guardadas

### **FASE 3 (2-3 días):**
✅ Configuración de emails en producción  
✅ Email de confirmación al agendar  
✅ Email de cambio de estado  
✅ Email de asignación de técnico  
✅ Sistema de recordatorios (opcional)

### **FASE 4 (3-4 días):**
✅ Sistema de notificaciones en tiempo real  
✅ Historial de servicios (auditoría)  
✅ Sistema de tickets de soporte  
✅ 75% de cobertura CRUD (14/19 tablas)

### **FASE 5 (2-3 días):**
✅ Paginación en todas las listas  
✅ Filtros y búsqueda avanzada  
✅ Caching con Redis  
✅ Optimizaciones de rendimiento  
✅ Mejoras de seguridad  
✅ Tests unitarios y E2E

---

## 📊 **CRONOGRAMA ESTIMADO**

```
Semana 1:
├── Lun-Mar: FASE 1 - Backend CRUD faltantes
├── Mié-Jue: FASE 1 - Frontend dashboard admin
└── Vie: Testing y validación Fase 1

Semana 2:
├── Lun-Mar: FASE 2 - Landing page y servicios
├── Mié-Jue: FASE 2 - Sistema agendamiento + calificaciones
└── Vie: FASE 2 - Perfil cliente editable

Semana 3:
├── Lun: FASE 3 - Configuración emails
├── Mar-Mié: FASE 3 - Integración emails en flujos
├── Jue: FASE 4 - Sistema notificaciones
└── Vie: FASE 4 - Historial y soporte

Semana 4:
├── Lun-Mar: FASE 5 - Optimizaciones
├── Mié-Jue: FASE 5 - Testing completo
└── Vie: Deploy y documentación final
```

**Total: 3-4 semanas** ⏱️

---

## 🎯 **MÉTRICAS DE ÉXITO**

### **Técnicas:**
- ✅ 75% de tablas con CRUD completo (14/19)
- ✅ 100% de rutas críticas implementadas
- ✅ 0 errores críticos en producción
- ✅ Tiempo de respuesta API < 200ms
- ✅ 90% de cobertura de tests

### **Funcionales:**
- ✅ Cliente puede agendar servicio sin login
- ✅ Cliente recibe email de confirmación
- ✅ Admin puede gestionar todas las tablas
- ✅ Sistema de notificaciones funcional
- ✅ Perfil de cliente completamente editable

### **Negocio:**
- ✅ Reducción 50% en tiempo de agendamiento
- ✅ Aumento 30% en conversiones
- ✅ 100% de reservas confirmadas por email
- ✅ Satisfacción del cliente > 4.5/5

---

## 🚀 **SIGUIENTE PASO INMEDIATO**

### **¿Por dónde empezamos?**

Te recomiendo comenzar por **FASE 1** porque:
1. Es la base para todo lo demás
2. Alcanzas rápido el objetivo del 75% CRUD
3. Te familiarizas con el patrón de desarrollo
4. Puedes probar todo en el dashboard admin antes de hacerlo público

### **Primer Sprint (Día 1):**

```bash
# Backend: Completar CategoriasServicios CRUD
□ Crear backend/controllers/categoriaController.js
□ Crear backend/routes/categoria.js
□ Agregar rutas POST/PUT/DELETE
□ Probar con Postman

# Frontend: Página de Categorías
□ Crear front_pl/src/pages/DashboardCategorias.jsx
□ Implementar DataTable + FormDialog
□ Conectar con API
□ Probar flujo completo
```

---

## 📚 **DOCUMENTACIÓN A MANTENER**

Durante el desarrollo, actualizar:
- ✅ ROUTES_SUMMARY.md (cada vez que agregas rutas)
- ✅ DATABASE_SUMMARY.md (si cambia estructura BD)
- ✅ VALIDATION_CHECKLIST.md (marcar completados)
- ✅ postman_collection.json (nuevos endpoints)
- ✅ README.md (instrucciones de instalación)

---

## 🎓 **BUENAS PRÁCTICAS A SEGUIR**

### **Backend:**
1. ✅ Siempre usar prepared statements (`?` en queries)
2. ✅ Validar todos los inputs
3. ✅ Manejo de errores con try-catch
4. ✅ Soft deletes (activo=0) en vez de DELETE
5. ✅ Logs descriptivos (`console.log` informativos)
6. ✅ Comentarios en lógica compleja
7. ✅ Respetar estructura MVC

### **Frontend:**
1. ✅ Componentes reutilizables
2. ✅ Props tipadas (propTypes o TypeScript)
3. ✅ Estados locales mínimos
4. ✅ Loading states en todas las llamadas API
5. ✅ Error handling visible al usuario
6. ✅ Validación de formularios
7. ✅ Responsive design (mobile-first)

### **Git:**
1. ✅ Commits descriptivos: "feat: add categorias CRUD"
2. ✅ Branches por feature: `feature/categorias-crud`
3. ✅ Pull requests con descripción
4. ✅ No commitear credenciales
5. ✅ .gitignore configurado correctamente

---

## 🆘 **SOPORTE Y RECURSOS**

### **Documentación Oficial:**
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Material-UI](https://mui.com/)
- [MySQL](https://dev.mysql.com/doc/)
- [Nodemailer](https://nodemailer.com/)

### **Herramientas:**
- Postman (testing API)
- MySQL Workbench (gestión BD)
- VS Code (IDE)
- Chrome DevTools (debugging frontend)

---

## ✅ **CONCLUSIÓN**

Este plan te llevará de un **42% de implementación** a un **sistema completo y profesional al 100%** en aproximadamente **3-4 semanas**.

Las fases están diseñadas para:
- ✅ Lograr resultados visibles rápidamente
- ✅ Mantener calidad y mejores prácticas
- ✅ Escalar funcionalidades de forma incremental
- ✅ Tener un producto funcional en cada fase

**¿Listo para empezar con la FASE 1?** 🚀

---

**📅 Documento creado:** 2 de octubre de 2025  
**👨‍💻 Preparado por:** GitHub Copilot  
**🎯 Versión:** 1.0
