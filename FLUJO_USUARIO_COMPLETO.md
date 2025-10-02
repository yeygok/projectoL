# 🎯 Flujo Completo de Usuario - Sistema de Reservas

## 📋 Resumen del Flujo Implementado

Se ha implementado el flujo completo de usuario desde la página pública hasta la reserva confirmada.

---

## 🌐 Flujo Paso a Paso

### 1️⃣ Usuario Visita el Home (Público)

**Ruta:** `http://localhost:5173/`

**Características:**
- ✅ Home público sin necesidad de login
- ✅ Carga datos REALES de la base de datos:
  - Categorías de servicio (Colchones, Vehículos, Tapetes, Cortinas)
  - Tipos de servicio (Sencillo, Premium, Gold)
  - Precios calculados con multiplicadores
- ✅ Sección de servicios clickeable
- ✅ Sección de planes con precios dinámicos
- ✅ Información de contacto
- ✅ Header con botón "Iniciar Sesión"

**Acciones disponibles:**
- Hacer clic en cualquier servicio → Redirige a Login/Registro
- Hacer clic en cualquier plan → Redirige a Login/Registro
- Botón "Agenda tu Servicio" → Redirige a Login/Registro

---

### 2️⃣ Usuario Hace Clic en un Servicio

**Ejemplo:** Usuario hace clic en "Vehículos 🚗"

**Qué pasa:**
1. Sistema guarda la categoría seleccionada en `location.state`
2. Redirige a `/login` con:
   ```javascript
   {
     from: '/cliente/reservar',
     categoriaPreseleccionada: { id: 4, nombre: 'Vehículos', ... }
   }
   ```

---

### 3️⃣ Pantalla de Login/Registro

**Ruta:** `http://localhost:5173/login`

**Opciones del usuario:**

#### Opción A: Usuario NUEVO (Registrarse)

**Botón:** "Crear Cuenta Nueva"

**Ruta:** `http://localhost:5173/register`

**Formulario de Registro:**
- Nombre completo
- Email
- Teléfono (10 dígitos)
- Contraseña (mínimo 6 caracteres)
- Confirmar contraseña

**Validaciones:**
- ✅ Email formato válido
- ✅ Teléfono 10 dígitos
- ✅ Contraseñas coinciden
- ✅ Contraseña mínimo 6 caracteres

**Al registrarse:**
1. POST a `/api/auth/register` con rol_id=2 (Cliente)
2. Usuario creado en BD
3. Redirige a `/login` con mensaje de éxito
4. Usuario inicia sesión

#### Opción B: Usuario EXISTENTE (Login)

**Formulario de Login:**
- Email
- Contraseña
- Botón "Mostrar/Ocultar contraseña"

**Al iniciar sesión:**
1. POST a `/api/auth/login`
2. Recibe token JWT
3. Guarda token en localStorage
4. Redirige según el estado guardado

---

### 4️⃣ Redirección Inteligente

**Después del login, el sistema:**

1. **Verifica si hay servicio pre-seleccionado:**
   ```javascript
   const { from, categoriaPreseleccionada, tipoPreseleccionado } = location.state || {};
   ```

2. **Opción A - Con pre-selección:**
   - Redirige a `/cliente/reservar`
   - Pasa la categoría/tipo pre-seleccionado
   - El formulario de reserva comienza en el paso correspondiente

3. **Opción B - Sin pre-selección:**
   - Admin → `/dashboard`
   - Cliente → `/cliente` (Dashboard del cliente)
   - Técnico → `/tecnico`

---

### 5️⃣ Sistema de Reservas (Booking)

**Ruta:** `http://localhost:5173/cliente/reservar`

**Requiere:** Usuario autenticado como CLIENTE

**Flujo de 5 Pasos:**

#### Paso 1: Seleccionar Categoría
- Muestra: Colchones, Vehículos, Tapetes, Cortinas
- **Si viene pre-seleccionada:** Avanza automáticamente al paso 2

#### Paso 2: Seleccionar Tipo
- Muestra: Sencillo, Premium, Gold
- Precios dinámicos calculados
- **Si viene pre-seleccionado:** Ya está marcado

#### Paso 3: Fecha y Hora
- DateTimePicker con locale español
- Validación de disponibilidad

#### Paso 4: Datos de Ubicación
- Dirección completa
- Ciudad (default: Bogotá)
- Código postal
- **Si es vehículo:** Formulario adicional de vehículo
  - Placa
  - Marca
  - Modelo
  - Color

#### Paso 5: Confirmación
- Resumen completo de la reserva
- Precio total calculado
- Botón "Confirmar Reserva"

**Al confirmar:**
1. POST a `/api/agendamiento`
2. Backend crea:
   - Registro en `Agendamientos`
   - Registro en `Ubicaciones` (automático)
   - Registro en `Vehiculos` (si aplica, automático)
3. 📧 **Envía email de confirmación** (cuando esté configurado)
4. Redirige a `/cliente/reservas`

---

### 6️⃣ Mis Reservas

**Ruta:** `http://localhost:5173/cliente/reservas`

**Muestra:**
- ✅ Solo las reservas del cliente autenticado
- ✅ Datos de la BD en tiempo real:
  - Categoría del servicio
  - Tipo de servicio
  - Fecha y hora
  - Estado (Pendiente, Confirmada, En Proceso, etc.)
  - Precio total
  - Dirección
  - Datos del vehículo (si aplica)

**Acciones:**
- Ver detalles completos
- Filtrar por estado
- Ver historial

---

## 🔐 Seguridad y Roles

### Roles del Sistema

1. **Admin (rol_id = 1)**
   - Acceso: `/dashboard`
   - Ve TODAS las reservas del sistema
   - Gestiona clientes, servicios, tipos, estados

2. **Cliente (rol_id = 2)**
   - Acceso: `/cliente`
   - Ve solo SUS PROPIAS reservas
   - Puede crear nuevas reservas
   - Gestiona su perfil

3. **Técnico (rol_id = 3)**
   - Acceso: `/tecnico` (pendiente implementar)
   - Asignado a reservas específicas

### Protección de Rutas

```javascript
<ProtectedRoute allowedRoles={[ROLES.CLIENTE]}>
  <ClienteLayout>
    <Routes>
      <Route index element={<ClienteDashboard />} />
      <Route path="perfil" element={<ClienteProfile />} />
      <Route path="reservar" element={<Booking />} />
      <Route path="reservas" element={<ClienteReservas />} />
    </Routes>
  </ClienteLayout>
</ProtectedRoute>
```

---

## 📊 Integración con Base de Datos

### Datos que se cargan de la BD

**En el Home (público):**
```javascript
// GET /api/categorias-servicio
categorias = [
  { id: 1, nombre: 'Colchones', descripcion: '...', emoji: '🛏️' },
  { id: 2, nombre: 'Tapetes', descripcion: '...', emoji: '🧺' },
  { id: 3, nombre: 'Cortinas', descripcion: '...', emoji: '🪟' },
  { id: 4, nombre: 'Vehículos', descripcion: '...', emoji: '🚗' }
]

// GET /api/tipos-servicio
tipos = [
  { id: 1, nombre: 'Sencillo', multiplicador_precio: 1.0 },
  { id: 2, nombre: 'Premium', multiplicador_precio: 1.6 },
  { id: 3, nombre: 'Gold', multiplicador_precio: 2.4 }
]
```

**En el Booking:**
```javascript
// Crea automáticamente:
// 1. Ubicacion
const ubicacion = await Ubicacion.create({
  direccion: formData.direccion,
  ciudad: formData.ciudad,
  codigo_postal: formData.codigo_postal
});

// 2. Vehiculo (si aplica)
const vehiculo = await Vehiculo.create({
  placa: formData.placa,
  marca: formData.marca,
  modelo: formData.modelo,
  color: formData.color
});

// 3. Agendamiento
const agendamiento = await Agendamiento.create({
  cliente_id: user.id,
  categoria_servicio_id: formData.categoria_id,
  tipo_servicio_id: formData.tipo_id,
  fecha_servicio: formData.fecha,
  ubicacion_id: ubicacion.id,
  vehiculo_id: vehiculo?.id,
  estado_reserva_id: 1, // Pendiente
  precio_total: precioCalculado
});
```

**En Mis Reservas:**
```javascript
// GET /api/agendamiento/cliente/:clienteId
reservas = await Agendamiento.findAll({
  where: { cliente_id: clienteId },
  include: [
    'CategoriaServicio',
    'TipoServicio',
    'EstadoReserva',
    'Ubicacion',
    'Vehiculo'
  ]
});
```

---

## 🎨 Experiencia de Usuario (UX)

### Flujo Visual

```
┌─────────────────┐
│   HOME PÚBLICO  │ ← Sin login requerido
│   (localhost/)  │ ← Muestra datos reales de BD
└────────┬────────┘
         │
         ▼ Click en servicio/plan
         │
┌────────┴────────┐
│  LOGIN/REGISTRO │ ← Guarda servicio seleccionado
│ (/login/register│ ← 2 opciones: Login o Crear Cuenta
└────────┬────────┘
         │
         ▼ Autenticación exitosa
         │
┌────────┴────────┐
│  CLIENTE DASH   │ ← Dashboard personal
│   (/cliente)    │ ← 3 tarjetas: Perfil, Reservar, Mis Reservas
└────────┬────────┘
         │
         ▼ Continuar a reservar
         │
┌────────┴────────┐
│  BOOKING (5)    │ ← Wizard de 5 pasos
│ (/reservar)     │ ← Servicio pre-seleccionado (si aplica)
└────────┬────────┘
         │
         ▼ Confirmar reserva
         │
┌────────┴────────┐
│  MIS RESERVAS   │ ← Lista de reservas del cliente
│  (/reservas)    │ ← Solo SUS reservas
└─────────────────┘
```

### Características de UX

✅ **Pre-selección inteligente:**
- Usuario hace clic en "Vehículos" → Login → Booking con Vehículos ya seleccionado

✅ **Breadcrumbs de estado:**
- Usuario siempre sabe dónde está en el proceso

✅ **Mensajes claros:**
- "¡Registro exitoso! Ahora puedes iniciar sesión"
- "Reserva creada exitosamente. Te enviamos un email de confirmación"

✅ **Validaciones en tiempo real:**
- Email inválido → Error inmediato
- Contraseñas no coinciden → Error inmediato

✅ **Loading states:**
- Spinners mientras carga datos de BD
- Botones deshabilitados durante submit

✅ **Responsive design:**
- Mobile-first con Material-UI
- Cards adaptables
- Formularios responsivos

---

## 🚀 Próximos Pasos

### ⏳ Pendientes para Producción

1. **Sistema de Emails** (EN PROGRESO)
   - Configurar contraseña de aplicación de Gmail
   - Activar envío de confirmaciones
   - Notificaciones de cambios de estado

2. **Calificaciones**
   - Sistema de valoración post-servicio
   - Mostrar testimonios en Home

3. **Notificaciones en Tiempo Real**
   - Badge de notificaciones no leídas
   - Auto-refresh cada 30 segundos

4. **Optimizaciones**
   - Paginación en listados
   - Filtros avanzados
   - Caché de datos frecuentes
   - Tests unitarios y de integración

---

## 📸 Capturas de Pantalla del Flujo

### 1. Home Público
- Hero con servicios
- Tarjetas de categorías (clickeables)
- Planes con precios dinámicos
- Footer con contacto

### 2. Registro
- Formulario completo
- Validaciones en tiempo real
- Link a Login

### 3. Login
- 2 botones: Login y Crear Cuenta
- Mensaje de éxito post-registro
- Manejo de pre-selección

### 4. Booking
- Stepper de 5 pasos
- Formularios condicionales (vehículo)
- Resumen final con precio

### 5. Mis Reservas
- Cards de reservas
- Estados con colores
- Filtros por estado

---

## 🧪 Pruebas del Flujo

### Test Case 1: Usuario Nuevo - Flujo Completo
```
1. Abrir http://localhost:5173/
2. Click en "Vehículos 🚗"
3. Click en "Crear Cuenta Nueva"
4. Llenar formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan@test.com"
   - Teléfono: "3001234567"
   - Contraseña: "test123"
   - Confirmar: "test123"
5. Click "Crear Cuenta"
6. Ver mensaje: "¡Registro exitoso!"
7. Llenar login:
   - Email: "juan@test.com"
   - Contraseña: "test123"
8. Click "Iniciar Sesión"
9. Verificar: Redirige a /cliente/reservar
10. Verificar: "Vehículos" ya está seleccionado
11. Seleccionar tipo: "Premium"
12. Seleccionar fecha: Mañana 10:00 AM
13. Llenar ubicación + vehículo
14. Click "Confirmar Reserva"
15. Verificar: Redirige a /cliente/reservas
16. Verificar: Reserva aparece en la lista
```

### Test Case 2: Usuario Existente - Sin Pre-selección
```
1. Abrir http://localhost:5173/
2. Click "Iniciar Sesión"
3. Login exitoso
4. Verificar: Redirige a /cliente (Dashboard)
5. Click "Reservar Nuevo Servicio"
6. Verificar: Comienza en paso 1 (sin pre-selección)
7. Seleccionar todo manualmente
8. Confirmar reserva
```

### Test Case 3: Pre-selección de Plan
```
1. Abrir http://localhost:5173/
2. Scroll hasta "Planes de Servicio"
3. Click en botón "Seleccionar Plan" de "Premium"
4. Login/Registro
5. Verificar: Booking con "Premium" pre-seleccionado
```

---

## 📝 Archivos Modificados/Creados

### Nuevos Archivos
1. `/front_pl/src/pages/Register.jsx` (NEW)
   - Formulario de registro completo
   - Validaciones
   - Integración con authService

### Archivos Modificados
1. `/front_pl/src/pages/Home.jsx`
   - Carga datos reales de BD
   - Manejo de pre-selección
   - Loading states
   - Error handling

2. `/front_pl/src/pages/Login.jsx`
   - Botón "Crear Cuenta Nueva"
   - Manejo de mensajes de éxito
   - Preserva location.state para pre-selección

3. `/front_pl/src/pages/Booking.jsx`
   - Recibe pre-selección de servicio/tipo
   - Avanza automáticamente si hay pre-selección

4. `/front_pl/src/App.jsx`
   - Ruta `/register` añadida
   - Import de Register component

5. `/front_pl/src/components/ClienteLayout.jsx`
   - Fix de ruta de importación de AuthContext

### Archivos Backend (Ya existían)
- `/backend/routes/auth.js` ✅ (Ya tiene `/register`)
- `/backend/controllers/authController.js` ✅ (Ya tiene register())
- `/front_pl/src/services/index.js` ✅ (Ya tiene authService.register())

---

## 🎯 Estado del Proyecto

### ✅ Completado (100%)
- [x] Home público con datos reales
- [x] Sistema de registro
- [x] Login con pre-selección
- [x] Booking con 5 pasos
- [x] Integración completa backend/frontend
- [x] Protección de rutas
- [x] Mis Reservas (solo las del cliente)

### 🔄 En Progreso
- [ ] Sistema de emails (configuración Gmail pendiente)

### ⏳ Pendiente
- [ ] Calificaciones
- [ ] Notificaciones
- [ ] Optimizaciones

---

**Última actualización:** 2 de octubre de 2025  
**Estado:** ✅ Flujo completo implementado y listo para pruebas  
**Próximo paso:** Configurar Gmail App Password y probar envío de emails
