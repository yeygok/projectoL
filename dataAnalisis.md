# 📊 DATA ANÁLISIS - MEGA LAVADO

> **Documento técnico centralizado**  
> Contiene información técnica de la aplicación, base de datos, rutas, funcionalidades y lógica del sistema

---

## 📋 ÍNDICE

1. [Información General](#información-general)
2. [Base de Datos](#base-de-datos)
3. [Arquitectura Backend](#arquitectura-backend)
4. [Arquitectura Frontend](#arquitectura-frontend)
5. [Flujos de Usuario](#flujos-de-usuario)
6. [Lógica de Reservas](#lógica-de-reservas)
7. [Autenticación y Roles](#autenticación-y-roles)
8. [APIs y Endpoints](#apis-y-endpoints)

---

## 🎯 INFORMACIÓN GENERAL

### Proyecto
- **Nombre:** MEGA LAVADO
- **Tipo:** Sistema de gestión de reservas para servicios de lavado
- **Stack:** MERN (MySQL, Express, React, Node.js)
- **Puerto Backend:** 3000
- **Puerto Frontend:** 5173 (Vite)

### Tecnologías

**Backend:**
- Node.js + Express 4.x
- MySQL 8.0 (Base de datos: `LavadoVaporBogotaDB`)
- JWT para autenticación
- Bcrypt para encriptación de contraseñas
- Nodemailer para emails

**Frontend:**
- React 19.1.0
- Vite 7.0.0
- Material-UI v7.3.2
- React Router DOM 7.1.1
- Date-fns para manejo de fechas

---

## 💾 BASE DE DATOS

### Estructura General
- **Base de datos:** `LavadoVaporBogotaDB`
- **Motor:** MySQL 8.0
- **Total de tablas:** 19
- **Registros actuales:** ~84 registros distribuidos

### Tablas Principales

#### 1. **Usuarios**
```sql
Campos principales:
- id (PK, AUTO_INCREMENT)
- nombre, apellido, email (UNIQUE)
- telefono, password (hashed con bcrypt)
- rol_id (FK → Roles)
- ubicacion_id (FK → Ubicaciones, NULLABLE)
- activo (TINYINT, default 1)
- fecha_ultimo_acceso (DATETIME, NULLABLE)
- created_at, updated_at (AUTO)

Registros: 8 usuarios
Roles distribuidos: 1 admin, 4 clientes, 2 técnicos, 1 soporte
```

#### 2. **Roles**
```sql
Campos:
- id (PK)
- nombre (UNIQUE: admin, cliente, tecnico, soporte)
- descripcion (TEXT)
- created_at, updated_at

Registros: 4 roles
```

#### 3. **Permisos**
```sql
Campos:
- id (PK)
- nombre (UNIQUE: crear_usuarios, editar_servicios, etc.)
- descripcion, modulo (VARCHAR)
- created_at, updated_at

Registros: 13 permisos
Módulos: usuarios, servicios, reservas, vehiculos, reportes, soporte
```

#### 4. **RolPermisos** (Tabla Pivote)
```sql
Campos:
- rol_id (PK, FK → Roles)
- permiso_id (PK, FK → Permisos)

Registros: 21 asignaciones
Relación: muchos a muchos
```

#### 5. **CategoriasServicios**
```sql
Campos:
- id (PK)
- nombre (UNIQUE)
- descripcion, icono (emoji)
- activa (TINYINT, default 1)
- orden (INT)
- created_at, updated_at

Registros: 7 categorías
Datos: Colchones 🛏️, Alfombras, Muebles y Sofás, Automóviles 🚗, 
       Tapetes 📐, Artículos de Bebés, Espacios y Ambientes
```

#### 6. **TiposServicio**
```sql
Campos:
- id (PK)
- nombre (UNIQUE)
- descripcion
- multiplicador_precio (DECIMAL(3,2), valores: 1.00, 1.50, 2.00)
- color (HEX code)
- created_at, updated_at

Registros: 5 tipos
Datos: Sencillo (1.0x), Premium (1.5x), Gold (2.0x), Deluxe, Express
```

#### 7. **Servicios**
```sql
Campos:
- id (PK)
- categoria_id (FK → CategoriasServicios)
- nombre, descripcion
- precio_base (DECIMAL(10,2))
- duracion_estimada (INT, minutos)
- activo (TINYINT)
- created_at, updated_at

Registros: 10 servicios
Precio base promedio: $100,000 COP
```

#### 8. **EstadosReserva**
```sql
Campos:
- id (PK)
- estado (UNIQUE)
- descripcion
- color (HEX code)
- created_at, updated_at

Registros: 7 estados
Datos: pendiente, confirmado, en_proceso, completada, 
       cancelada, reprogramada, no_realizada
```

#### 9. **Reservas** (Tabla Central)
```sql
Campos principales:
- id (PK, AUTO_INCREMENT)
- cliente_id (FK → Usuarios, rol_id=2)
- tecnico_id (FK → Usuarios, rol_id=3, NULLABLE)
- vehiculo_id (FK → Vehiculos, NULLABLE)
- servicio_tipo_id (FK → TiposServicio)
- ubicacion_servicio_id (FK → Ubicaciones)
- fecha_reserva (DATETIME, timestamp de creación)
- fecha_servicio (DATETIME, cuándo se realiza)
- precio_total (DECIMAL(10,2))
- estado_id (FK → EstadosReserva, default 1=pendiente)
- observaciones, notas_tecnico (TEXT)
- created_at, updated_at

Registros: 12 reservas activas
Relaciones: 5 FKs (multi-tabla)
```

#### 10. **Ubicaciones**
```sql
Campos:
- id (PK)
- direccion (TEXT)
- barrio, localidad (VARCHAR)
- latitud, longitud (DECIMAL, NULLABLE)
- zona (ENUM: norte, sur, oriente, occidente, centro)
- activa (TINYINT)
- created_at, updated_at

Registros: 14 ubicaciones
Uso: Direcciones de servicio y ubicaciones de usuarios
```

#### 11. **Vehiculos**
```sql
Campos:
- id (PK)
- modelo, placa (VARCHAR, UNIQUE)
- capacidad_tanque (DECIMAL, NULLABLE)
- ubicacion_actual_id (FK → Ubicaciones, NULLABLE)
- activo, en_servicio (TINYINT)
- created_at, updated_at

Registros: 4 vehículos
Uso: Asignación a reservas de lavado de autos
```

### Relaciones Clave

```
Usuarios ──┬── rol_id → Roles
           ├── ubicacion_id → Ubicaciones
           └── (cliente_id/tecnico_id) → Reservas

Reservas ──┬── cliente_id → Usuarios (rol=cliente)
           ├── tecnico_id → Usuarios (rol=tecnico)
           ├── vehiculo_id → Vehiculos
           ├── servicio_tipo_id → TiposServicio
           ├── ubicacion_servicio_id → Ubicaciones
           └── estado_id → EstadosReserva

Servicios ── categoria_id → CategoriasServicios

Vehiculos ── ubicacion_actual_id → Ubicaciones

RolPermisos ──┬── rol_id → Roles
              └── permiso_id → Permisos
```

### Consultas SQL Importantes

**Estadísticas Dashboard:**
```sql
SELECT
  (SELECT COUNT(*) FROM Usuarios WHERE activo = 1) as totalUsuarios,
  (SELECT COUNT(*) FROM Usuarios u 
   JOIN Roles r ON u.rol_id = r.id 
   WHERE r.nombre = 'cliente' AND u.activo = 1) as totalClientes,
  (SELECT COUNT(*) FROM Reservas) as totalReservas,
  (SELECT COUNT(*) FROM Servicios WHERE activo = 1) as totalServicios,
  (SELECT COUNT(*) FROM Reservas WHERE DATE(fecha_servicio) = CURDATE()) as reservasHoy,
  (SELECT COALESCE(SUM(precio_total), 0) 
   FROM Reservas r 
   JOIN EstadosReserva er ON r.estado_id = er.id 
   WHERE er.estado = 'completada' 
   AND MONTH(r.fecha_servicio) = MONTH(CURDATE())) as ingresosMes;
```

**Reservas con Join Completo:**
```sql
SELECT 
  r.id, r.fecha_servicio, r.precio_total, r.observaciones,
  uc.nombre as cliente_nombre, uc.apellido as cliente_apellido,
  ut.nombre as tecnico_nombre, ut.apellido as tecnico_apellido,
  ts.nombre as tipo_servicio, ts.multiplicador_precio,
  ub.direccion, ub.barrio, ub.zona,
  v.modelo as vehiculo_modelo, v.placa as vehiculo_placa,
  er.estado, er.color as estado_color
FROM Reservas r
LEFT JOIN Usuarios uc ON r.cliente_id = uc.id
LEFT JOIN Usuarios ut ON r.tecnico_id = ut.id
LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
LEFT JOIN Ubicaciones ub ON r.ubicacion_servicio_id = ub.id
LEFT JOIN Vehiculos v ON r.vehiculo_id = v.id
LEFT JOIN EstadosReserva er ON r.estado_id = er.id
ORDER BY r.created_at DESC;
```

---

## 🏗️ ARQUITECTURA BACKEND

### Estructura de Carpetas
```
backend/
├── index.js                    # Servidor principal
├── config/
│   ├── db.js                  # Configuración MySQL
│   └── mailer.js              # Configuración Nodemailer
├── controllers/               # Lógica de negocio
│   ├── authController.js      # Login, register, verify
│   ├── agendamientoController.js  # CRUD reservas
│   ├── dashboardController.js # Stats y gestión admin
│   ├── categoriaController.js # CRUD categorías
│   ├── serviceController.js   # CRUD servicios
│   ├── tipoServicioController.js
│   ├── perfilController.js
│   ├── clienteController.js
│   ├── rolController.js
│   ├── permisoController.js
│   └── ... (otros)
├── middlewares/
│   └── authMiddleware.js      # Verificación JWT
├── routes/                    # Definición de endpoints
│   ├── index.js              # Router principal
│   ├── auth.js
│   ├── agendamiento.js
│   ├── dashboard.js
│   └── ... (otros)
├── services/
│   └── emailService.js       # Envío de emails
└── viewsApi/                 # Views específicas (legacy)
```

### Servidor Principal (index.js)

**Configuración CORS:**
```javascript
// Desarrollo: Permite todos los orígenes
// Producción: Solo orígenes específicos
origin: function (origin, callback) {
  if (process.env.NODE_ENV !== 'production') {
    return callback(null, true);
  }
  // En producción verificar allowedOrigins
}
```

**Middlewares:**
```javascript
- express.json({ limit: '10mb' })
- express.urlencoded({ extended: true, limit: '10mb' })
- Cache-Control: no-store (en desarrollo)
```

**Health Check:**
```javascript
GET /health → { status: 'OK', timestamp, environment, version }
```

### Rutas Implementadas

**Router Principal (/backend/routes/index.js):**
```javascript
/api/auth                 → Autenticación
/api/services             → Servicios
/api/perfil               → Perfil de usuario
/api/clientes             → Gestión de clientes
/api/agendamiento         → Reservas
/api/dashboard            → Dashboard admin
/api/roles                → Roles del sistema
/api/permisos             → Permisos
/api/rol-permisos         → Asignación rol-permiso
/api/tipos-servicio       → Tipos de servicio
/api/categorias           → Categorías
/api/categorias-servicio  → Alias de categorías
/api/estados-reserva      → Estados de reserva
/api/test-users           → Testing (sin auth)
```

### Endpoints por Módulo

#### Auth (/api/auth)
```javascript
POST   /login              → Iniciar sesión (retorna JWT)
POST   /register           → Crear cuenta (rol_id=2 cliente por defecto)
POST   /logout             → Cerrar sesión
GET    /verify             → Verificar token válido
```

#### Dashboard (/api/dashboard) - Requiere authMiddleware
```javascript
// Estadísticas
GET    /stats              → Métricas generales (usuarios, reservas, ingresos)
GET    /recent-reservas    → Últimas 10 reservas

// CRUD Usuarios
GET    /usuarios           → Todos los usuarios
POST   /usuarios           → Crear usuario
PUT    /usuarios/:id       → Actualizar (solo campos proporcionados)
DELETE /usuarios/:id       → Soft delete (activo=0)

// CRUD Servicios
GET    /servicios          → Todos los servicios
POST   /servicios          → Crear servicio
PUT    /servicios/:id      → Actualizar servicio
DELETE /servicios/:id      → Soft delete

// CRUD Ubicaciones
GET    /ubicaciones        → Todas las ubicaciones
POST   /ubicaciones        → Crear ubicación
PUT    /ubicaciones/:id
DELETE /ubicaciones/:id

// CRUD Vehículos
GET    /vehiculos          → Todos los vehículos
POST   /vehiculos          → Crear vehículo
PUT    /vehiculos/:id
DELETE /vehiculos/:id

// Datos auxiliares (solo GET)
GET    /roles              → Listado de roles
GET    /categorias         → Listado de categorías
GET    /tipos-servicio     → Listado de tipos
GET    /estados-reserva    → Listado de estados
```

#### Agendamiento (/api/agendamiento) - Requiere authMiddleware
```javascript
GET    /                   → Todas las reservas (ADMIN)
GET    /cliente/:id        → Reservas de un cliente específico (CLIENTE)
POST   /                   → Crear reserva (crea ubicación/vehículo auto)
PUT    /:id                → Actualizar reserva (ADMIN)
DELETE /:id                → Eliminar reserva (ADMIN)
GET    /:id                → Detalle de reserva
```

**Lógica Especial en createAgendamiento:**
```javascript
1. Validar cliente existe y rol=cliente
2. Validar servicio_tipo_id existe
3. Si NO existe ubicacion_id:
   → INSERT INTO Ubicaciones (direccion, barrio, localidad, zona)
   → Retorna ubicacionId
4. Si NO existe vehiculo_id Y es servicio de vehículos:
   → INSERT INTO Vehiculos (modelo, placa, capacidad_tanque)
   → Retorna vehiculoId
5. Calcular precio_total = precioBase * multiplicador
6. INSERT INTO Reservas con estado_id=1 (pendiente)
7. Enviar emails de confirmación
8. Retornar { id, mensaje, cliente, fecha_servicio, precio_total }
```

#### Categorías (/api/categorias)
```javascript
GET    /                   → Todas las categorías
GET    /:id                → Categoría por ID
POST   /                   → Crear categoría
PUT    /:id                → Actualizar categoría
DELETE /:id                → Eliminar categoría
```

#### Tipos Servicio (/api/tipos-servicio)
```javascript
GET    /                   → Todos los tipos
GET    /:id                → Tipo por ID
POST   /                   → Crear tipo
PUT    /:id                → Actualizar tipo (incluye multiplicador)
DELETE /:id                → Eliminar tipo
```

#### Perfil (/api/perfil) - Requiere authMiddleware
```javascript
GET    /me                 → Perfil del usuario autenticado
PUT    /me                 → Actualizar perfil
PUT    /me/password        → Cambiar contraseña
```

### Middleware de Autenticación

**authMiddleware.js:**
```javascript
Verifica:
1. Header Authorization existe
2. Token tiene formato "Bearer <token>"
3. Token es válido (jwt.verify)
4. Usuario existe en BD
5. Usuario está activo

Agrega a req:
- req.user (datos del usuario)
- req.userId (id del usuario)
- req.userRole (rol_id del usuario)
```

### Servicios Externos

**Email Service (emailService.js):**
```javascript
Configuración: Nodemailer con Gmail
Variables de entorno requeridas:
- EMAIL_USER
- EMAIL_PASSWORD (app password de Gmail)

Funciones:
- sendWelcomeEmail(email, nombre)
- sendReservationConfirmation(email, reservaData)
- sendReservationUpdate(email, reservaData)
```

---

## ⚛️ ARQUITECTURA FRONTEND

### Estructura de Carpetas
```
front_pl/src/
├── main.jsx                   # Entry point
├── App.jsx                    # Rutas principales
├── index.css                  # Estilos globales
├── assets/                    # Imágenes y recursos
│   └── img/
│       ├── colchon.jpg
│       ├── sofa.png
│       ├── tapete.jpg
│       └── vehiculo.jpg
├── components/                # Componentes reutilizables
│   ├── ClienteLayout.jsx     # Layout cliente con navbar
│   └── common/               # Componentes comunes
│       ├── DataTable.jsx
│       ├── FormDialog.jsx
│       ├── PageHeader.jsx
│       └── NotificationProvider.jsx
├── context/
│   └── AuthContext.jsx       # Estado global de autenticación
├── hooks/
│   └── index.js              # Custom hooks (useCrud)
├── pages/                    # Páginas/vistas principales
│   ├── Home.jsx              # Landing público
│   ├── Login.jsx             # Inicio de sesión
│   ├── Register.jsx          # Registro de usuarios
│   ├── Dashboard.jsx         # Layout admin
│   ├── ClienteDashboard.jsx  # Dashboard cliente
│   ├── ClienteProfile.jsx    # Perfil cliente
│   ├── ClienteReservas.jsx   # Historial reservas
│   ├── Booking.jsx           # Sistema de reservas (5 pasos)
│   ├── DashboardHome.jsx     # Home admin
│   ├── DashboardUsuarios.jsx # CRUD usuarios
│   ├── DashboardAgendamientos.jsx  # Ver todas las reservas
│   ├── DashboardServicios.jsx
│   ├── DashboardCategorias.jsx
│   ├── DashboardTipos.jsx    # Renombrado a "Calificaciones"
│   └── ... (otros dashboards)
├── services/
│   └── index.js              # Servicios API
│       ├── authService
│       ├── agendamientoService
│       ├── categoriaService
│       ├── tipoServicioService
│       ├── serviceService
│       └── estadoReservaService
└── theme/
    └── theme.js              # Tema Material-UI
```

### Rutas de la Aplicación

**App.jsx:**
```javascript
/                        → Home (público)
/login                   → Login
/register                → Register

// Rutas protegidas - Admin (rol_id=1)
/dashboard               → Dashboard layout
  /dashboard/            → DashboardHome (stats)
  /dashboard/usuarios    → DashboardUsuarios
  /dashboard/agendamientos → DashboardAgendamientos (TODAS las reservas)
  /dashboard/servicios   → DashboardServicios
  /dashboard/categorias  → DashboardCategorias
  /dashboard/tipos       → DashboardTipos (Calificaciones)
  /dashboard/roles       → DashboardRoles
  /dashboard/perfil      → DashboardPerfil

// Rutas protegidas - Cliente (rol_id=2)
/cliente                 → ClienteLayout
  /cliente/              → ClienteDashboard
  /cliente/perfil        → ClienteProfile
  /cliente/reservar      → Booking (wizard 5 pasos)
  /cliente/reservas      → ClienteReservas
```

### Componentes Clave

#### AuthContext
```javascript
Estado global:
- user (objeto con datos del usuario)
- loading (boolean)
- token (JWT)

Funciones:
- login(email, password) → Async, guarda token en localStorage
- register(userData) → Async, crea usuario
- logout() → Async, llama backend y limpia estado
- updateProfile(data) → Actualiza perfil del usuario

Persiste en localStorage:
- token
- user
```

#### ClienteLayout
```javascript
Componente wrapper para rutas de cliente
Incluye:
- AppBar con logo, navegación y avatar
- Drawer para móvil
- Footer con contacto
- Outlet para renderizar children

Navegación:
- Inicio (/cliente)
- Reservar (/cliente/reservar)
- Mis Reservas (/cliente/reservas)
- Mi Perfil (/cliente/perfil)
- Cerrar Sesión (llama logout() asíncrono)
```

#### Booking (Sistema de Reservas)
```javascript
Wizard de 5 pasos con Stepper de Material-UI

Estado principal (bookingData):
- categoria_id
- servicio_tipo_id
- fecha_servicio
- direccion, barrio, localidad, zona
- vehiculo_modelo, vehiculo_placa (si aplica)
- observaciones

Paso 0: Seleccionar Categoría
→ Cards 2x2 con imágenes (colchon.jpg, vehiculo.jpg, etc)
→ onClick selecciona y avanza

Paso 1: Tipo de Servicio
→ Cards con nombre, descripción, multiplicador
→ Sencillo / Premium / Gold

Paso 2: Fecha y Hora
→ DateTimePicker (date-fns + @mui/x-date-pickers)
→ LocalizationProvider locale="es"
→ Validación: minDate = now + 1 hour

Paso 3: Ubicación + Datos
→ TextField direccion, barrio, localidad, telefono
→ Select zona (norte/sur/este/oeste/centro)
→ SI categoria es Vehículos:
  → TextField modelo, placa

Paso 4: Confirmación
→ Resumen completo
→ Cálculo de precio (precioBase * multiplicador)
→ Botón "Confirmar Reserva"
→ POST /api/agendamiento con todos los datos
→ Redirige a /cliente/reservas

Características:
- Validación en cada paso
- Botones Atrás/Siguiente
- Loading states
- Manejo de errores
```

#### ClienteReservas
```javascript
Carga: agendamientoService.getByCliente(user.id)

Muestra:
- Grid de cards con reservas
- Cada card incluye:
  - ID reserva
  - Tipo servicio + categoría
  - Chip de estado (color según estado)
  - Fecha formateada en español
  - Ubicación
  - Precio en formato COP
  - Botón "Ver Detalles"

Filtros (futuro):
- Por estado
- Por fecha
- Por categoría
```

### Servicios API (services/index.js)

**Configuración Base:**
```javascript
const API_URL = 'http://localhost:3000/api';

Headers automáticos:
- Content-Type: application/json
- Authorization: Bearer ${token} (si hay token en localStorage)
```

**authService:**
```javascript
login(email, password)        → POST /api/auth/login
register(userData)            → POST /api/auth/register
logout()                      → POST /api/auth/logout
verifyToken()                 → GET /api/auth/verify
```

**agendamientoService:**
```javascript
getAll()                      → GET /api/agendamiento (admin)
getByCliente(clienteId)       → GET /api/agendamiento/cliente/:id
create(data)                  → POST /api/agendamiento
update(id, data)              → PUT /api/agendamiento/:id
delete(id)                    → DELETE /api/agendamiento/:id
getById(id)                   → GET /api/agendamiento/:id
```

**categoriaService:**
```javascript
getAll()                      → GET /api/categorias
getById(id)                   → GET /api/categorias/:id
create(data)                  → POST /api/categorias
update(id, data)              → PUT /api/categorias/:id
delete(id)                    → DELETE /api/categorias/:id
```

**tipoServicioService:**
```javascript
getAll()                      → GET /api/tipos-servicio
getById(id)                   → GET /api/tipos-servicio/:id
create(data)                  → POST /api/tipos-servicio
update(id, data)              → PUT /api/tipos-servicio/:id
delete(id)                    → DELETE /api/tipos-servicio/:id
```

---

## 👤 FLUJOS DE USUARIO

### Flujo 1: Registro + Primera Reserva

```
1. Usuario NO autenticado visita Home (/)
   ↓
2. Click en "Agenda tu Servicio" o servicio específico
   ↓
3. Redirige a /login (guarda servicio pre-seleccionado en location.state)
   ↓
4. Usuario hace click "Crear Cuenta Nueva" → /register
   ↓
5. Llena formulario:
   - Nombre, Apellido
   - Email (único)
   - Teléfono (10 dígitos)
   - Contraseña (min 6 caracteres)
   ↓
6. POST /api/auth/register
   Backend crea: Usuario con rol_id=2 (cliente), activo=1
   ↓
7. Mensaje "Registro exitoso" → Redirige a /login
   ↓
8. Usuario ingresa email y contraseña → POST /api/auth/login
   Backend retorna: { token, user: { id, nombre, email, rol_id, rol_nombre } }
   ↓
9. Frontend guarda token en localStorage y setUser() en AuthContext
   ↓
10. Redirige a /cliente/reservar (con servicio pre-seleccionado si lo había)
    ↓
11. Sistema de reservas (Booking) avanza automáticamente si hay pre-selección
    ↓
12. Cliente completa 5 pasos y confirma
    ↓
13. POST /api/agendamiento con:
    {
      cliente_id: user.id (automático del AuthContext),
      servicio_tipo_id: 2,
      fecha_servicio: "2025-10-05T14:00:00.000Z",
      ubicacion: { direccion, barrio, localidad, zona },
      vehiculo: { modelo, placa } (solo si aplica),
      observaciones: "..."
    }
    ↓
14. Backend:
    - Crea ubicación nueva
    - Crea vehículo si aplica
    - Crea reserva con estado_id=1 (pendiente)
    - Envía email de confirmación
    ↓
15. Frontend redirige a /cliente/reservas
    ↓
16. Cliente ve su reserva recién creada ✅
```

### Flujo 2: Cliente ve sus Reservas

```
1. Cliente autenticado en /cliente
   ↓
2. Click en "Mis Reservas" → /cliente/reservas
   ↓
3. useEffect(() => { loadReservas() }, [])
   ↓
4. GET /api/agendamiento/cliente/${user.id}
   ↓
5. Backend query:
   SELECT r.*, ts.nombre as tipo_servicio, er.estado, ub.direccion...
   FROM Reservas r
   LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
   LEFT JOIN EstadosReserva er ON r.estado_id = er.id
   LEFT JOIN Ubicaciones ub ON r.ubicacion_servicio_id = ub.id
   WHERE r.cliente_id = ?
   ORDER BY r.fecha_servicio DESC
   ↓
6. Frontend mapea reservas y renderiza cards
   ↓
7. Cliente puede:
   - Ver detalles de cada reserva
   - Ver estado actual (Pendiente, Confirmada, etc)
   - Cancelar si estado = pendiente (futuro)
```

### Flujo 3: Admin ve TODAS las Reservas

```
1. Admin autenticado en /dashboard
   ↓
2. Click en "Agendamientos" en sidebar → /dashboard/agendamientos
   ↓
3. useEffect(() => { loadAgendamientos() }, [])
   ↓
4. GET /api/agendamiento (sin filtro de cliente)
   ↓
5. Backend query:
   SELECT r.*, uc.nombre as cliente_nombre, ut.nombre as tecnico_nombre...
   FROM Reservas r
   LEFT JOIN Usuarios uc ON r.cliente_id = uc.id
   LEFT JOIN Usuarios ut ON r.tecnico_id = ut.id
   [JOIN resto de tablas...]
   ORDER BY r.created_at DESC
   ↓
6. Frontend renderiza DataTable con:
   - Todas las reservas del sistema
   - Filtros por estado, cliente, técnico
   - Acciones: Editar, Asignar Técnico, Cambiar Estado, Eliminar
   ↓
7. Admin puede:
   - Ver datos completos de cliente y ubicación
   - Asignar técnico (tecnico_id)
   - Cambiar estado (estado_id)
   - Agregar notas_tecnico
   - Eliminar reserva
```

### Flujo 4: Logout Asíncrono

```
1. Usuario hace click en "Cerrar Sesión" (Dashboard o ClienteLayout)
   ↓
2. handleLogout() async:
   try {
     const result = await logout(); // AuthContext
     if (result.success) {
       navigate('/'); // Redirige a Home
     }
   } catch {
     navigate('/'); // Fallback
   }
   ↓
3. logout() en AuthContext:
   - POST /api/auth/logout (backend registra cierre de sesión)
   - Espera respuesta 200 OK
   - localStorage.removeItem('token')
   - localStorage.removeItem('user')
   - setUser(null)
   - return { success: true }
   ↓
4. Usuario ve Home público (/) ✅
```

---

## 🎯 LÓGICA DE RESERVAS

### Datos que Ingresa el Usuario

**Paso a Paso en Booking:**
1. **Categoría de Servicio** (elige de lista)
   - Colchones 🛏️
   - Vehículos 🚗
   - Tapetes 📐
   - Cortinas 🪟

2. **Tipo de Servicio** (elige de lista)
   - Sencillo (multiplicador 1.0x)
   - Premium (multiplicador 1.5x)
   - Gold (multiplicador 2.0x)

3. **Fecha y Hora** (selecciona con DateTimePicker)
   - Validación: no permite fechas pasadas
   - Formato: ISO 8601

4. **Ubicación** (ingresa manualmente)
   - Dirección completa
   - Barrio
   - Localidad
   - Zona (selecciona: norte/sur/este/oeste/centro)

5. **Datos Específicos** (condicional)
   - Si es Vehículos: Modelo + Placa
   - Si es otros: N/A

6. **Observaciones** (opcional)
   - Campo de texto libre

### Datos que Asigna el Sistema Automáticamente

**Frontend calcula:**
- `precio_total` = precioBase × multiplicador_precio
  (Ejemplo: $100,000 × 1.5 = $150,000)

**Backend asigna al crear:**
```javascript
{
  cliente_id: req.user.id,              // Del JWT (no del body)
  estado_id: 1,                         // Pendiente por defecto
  tecnico_id: null,                     // Se asigna después por admin
  fecha_reserva: new Date(),            // Timestamp de creación (NOW())
  ubicacion_servicio_id: nuevaUbicacionId,  // Creada automáticamente
  vehiculo_id: nuevoVehiculoId,         // Creado automáticamente si aplica
  created_at: NOW(),
  updated_at: NOW()
}
```

**Proceso de Creación de Ubicación:**
```javascript
// Si NO viene ubicacion_id en el body:
const [ubicacionResult] = await pool.query(
  'INSERT INTO Ubicaciones (direccion, barrio, localidad, zona, activa) VALUES (?, ?, ?, ?, 1)',
  [data.direccion, data.barrio, data.localidad, data.zona]
);
const ubicacionId = ubicacionResult.insertId;
```

**Proceso de Creación de Vehículo:**
```javascript
// Si NO viene vehiculo_id Y categoria es Vehículos:
if (data.vehiculo_modelo && data.vehiculo_placa) {
  // Buscar si ya existe esa placa
  const [existingVehiculo] = await pool.query(
    'SELECT id FROM Vehiculos WHERE placa = ?',
    [data.vehiculo_placa]
  );
  
  if (existingVehiculo.length > 0) {
    vehiculoId = existingVehiculo[0].id;
  } else {
    // Crear nuevo
    const [vehiculoResult] = await pool.query(
      'INSERT INTO Vehiculos (modelo, placa, activo) VALUES (?, ?, 1)',
      [data.vehiculo_modelo, data.vehiculo_placa]
    );
    vehiculoId = vehiculoResult.insertId;
  }
}
```

### Validaciones del Sistema

**Validaciones Frontend (Booking.jsx):**
```javascript
Paso 0: categoria_id debe existir
Paso 1: servicio_tipo_id debe existir
Paso 2: fecha_servicio >= new Date() + 1 hour
Paso 3: 
  - direccion no vacía
  - barrio no vacío
  - localidad no vacía
  - telefono formato válido
  - SI es Vehículos: modelo Y placa obligatorios
```

**Validaciones Backend (agendamientoController.js):**
```javascript
1. Token JWT válido (authMiddleware)
2. cliente_id existe en Usuarios
3. cliente_id tiene rol_id = 2 (cliente)
4. servicio_tipo_id existe en TiposServicio
5. estado_id existe en EstadosReserva (default 1)
6. fecha_servicio es fecha válida
7. precio_total > 0
8. Si hay tecnico_id: existe en Usuarios con rol_id = 3
```

### Cálculo de Precio

**Fórmula:**
```
PRECIO_BASE = 100000  // Definido en backend
multiplicador = TiposServicio.multiplicador_precio

precio_total = PRECIO_BASE * multiplicador

Ejemplos:
- Sencillo (1.0x): $100,000 * 1.0 = $100,000
- Premium (1.5x): $100,000 * 1.5 = $150,000
- Gold (2.0x):    $100,000 * 2.0 = $200,000
```

**Validación de Seguridad:**
Backend NO confía en el precio_total enviado por el frontend.
Recalcula siempre en el servidor.

---

## 🔐 AUTENTICACIÓN Y ROLES

### Roles del Sistema

**Tabla Roles:**
```sql
id | nombre   | descripcion
---|----------|------------------
1  | admin    | Administrador del sistema
2  | cliente  | Cliente final
3  | tecnico  | Técnico de servicio
4  | soporte  | Soporte al cliente
```

### Permisos por Rol

**Admin (rol_id = 1):**
- crear_usuarios, editar_usuarios, eliminar_usuarios, ver_usuarios
- crear_servicios, editar_servicios, ver_servicios
- crear_reservas, editar_reservas, ver_reservas (TODAS)
- gestionar_vehiculos
- ver_reportes
- gestionar_soporte

**Cliente (rol_id = 2):**
- ver_servicios (catálogo público)
- crear_reservas (solo propias)
- ver_reservas (solo propias)
- editar_perfil (solo propio)

**Técnico (rol_id = 3):**
- ver_reservas (solo asignadas a él)
- editar_reservas (solo notas_tecnico y estado)
- gestionar_vehiculos (ubicación actual)

**Soporte (rol_id = 4):**
- ver_usuarios, ver_reservas
- gestionar_soporte

### Flujo de Autenticación

**1. Login:**
```javascript
POST /api/auth/login
Body: { email, password }

Backend:
1. Busca usuario por email
2. Verifica usuario.activo = 1
3. Compara password con bcrypt.compare(password, usuario.password)
4. Si OK:
   a. Genera JWT:
      payload = { id, email, nombre, apellido, rol_id, rol_nombre, permisos }
      token = jwt.sign(payload, SECRET, { expiresIn: '8h' })
   b. Actualiza fecha_ultimo_acceso
   c. Retorna { token, user: { id, nombre, email, rol_id, rol_nombre, permisos } }
```

**2. Registro:**
```javascript
POST /api/auth/register
Body: { nombre, apellido, email, telefono, password }

Backend:
1. Valida email único
2. Hash password: bcrypt.hash(password, 10)
3. INSERT INTO Usuarios (...) VALUES (...) con rol_id=2 (cliente)
4. Retorna { mensaje: 'Usuario creado exitosamente', id }

Frontend:
- Muestra mensaje de éxito
- Redirige a /login para que inicie sesión
```

**3. Verificación de Token:**
```javascript
Middleware authMiddleware en cada ruta protegida:

1. Extrae token del header: Authorization: Bearer <token>
2. Verifica token: jwt.verify(token, SECRET)
3. Decodifica payload
4. Busca usuario en BD: SELECT * FROM Usuarios WHERE id = payload.id
5. Verifica usuario.activo = 1
6. Agrega a request: req.user = usuario completo
7. next() → Continúa a la ruta
```

**4. Logout:**
```javascript
POST /api/auth/logout

Backend:
- Registra logout en logs
- Retorna { mensaje: 'Sesión cerrada exitosamente' }

Frontend:
- Borra token y user de localStorage
- setUser(null) en AuthContext
- Redirige a / (Home)
```

### Protección de Rutas Frontend

**ProtectedRoute component:**
```javascript
function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <CircularProgress />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.rol_id)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Uso:
<ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
  <Dashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={[ROLES.CLIENTE]}>
  <ClienteLayout />
</ProtectedRoute>
```

### Constantes de Roles

```javascript
// Frontend: src/constants.js (o inline en componentes)
export const ROLES = {
  ADMIN: 1,
  CLIENTE: 2,
  TECNICO: 3,
  SOPORTE: 4
};
```

---

## 🔌 APIS Y ENDPOINTS

### Headers Requeridos

**Rutas Públicas (no requieren auth):**
```
Content-Type: application/json
```

**Rutas Protegidas (requieren auth):**
```
Content-Type: application/json
Authorization: Bearer <token_jwt>
```

### Responses Estándar

**Success (200 OK):**
```json
{
  "id": 123,
  "mensaje": "Operación exitosa",
  "data": { ... }
}
```

**Created (201 Created):**
```json
{
  "id": 456,
  "mensaje": "Recurso creado exitosamente",
  "resource": { ... }
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Descripción del error"
}
```

### Ejemplos de Requests

**Crear Reserva (Cliente):**
```bash
POST http://localhost:3000/api/agendamiento
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "servicio_tipo_id": 2,
  "fecha_servicio": "2025-10-05T14:00:00.000Z",
  "precio_total": 150000,
  "ubicacion": {
    "direccion": "Calle 123 #45-67",
    "barrio": "Chapinero",
    "localidad": "Bogotá",
    "zona": "norte"
  },
  "vehiculo": {
    "modelo": "Toyota Corolla 2020",
    "placa": "ABC123"
  },
  "observaciones": "Favor llegar temprano"
}

Response 201:
{
  "id": 789,
  "mensaje": "Reserva creada exitosamente",
  "cliente": "Juan Pérez",
  "fecha_servicio": "2025-10-05T14:00:00.000Z",
  "precio_total": 150000
}
```

**Obtener Reservas del Cliente:**
```bash
GET http://localhost:3000/api/agendamiento/cliente/17
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
[
  {
    "id": 789,
    "fecha_servicio": "2025-10-05T14:00:00.000Z",
    "precio_total": 150000,
    "tipo_servicio": "Premium",
    "estado": "pendiente",
    "estado_color": "#FFA726",
    "direccion": "Calle 123 #45-67",
    "barrio": "Chapinero",
    "observaciones": "Favor llegar temprano"
  },
  { ... }
]
```

**Actualizar Usuario (Admin):**
```bash
PUT http://localhost:3000/api/dashboard/usuarios/17
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "telefono": "3001234567"
}

Response 200:
{
  "id": 17,
  "mensaje": "Usuario actualizado exitosamente",
  "usuario": {
    "id": 17,
    "nombre": "Juan Carlos",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "3001234567",
    "rol_nombre": "cliente"
  }
}
```

### Testing con Postman/cURL

**Colección disponible:**
`/backend/postman_fase1_crud.json`

**Variables de entorno:**
```
BASE_URL=http://localhost:3000
TOKEN=<token_obtenido_en_login>
```

---

## 📝 INFORMACIÓN ADICIONAL

### Variables de Entorno (.env)

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=LavadoVaporBogotaDB
DB_PORT=3306

# JWT
JWT_SECRET=tu_secret_super_secreto_aqui

# Email
EMAIL_USER=info@megalavado.com
EMAIL_PASSWORD=tu_app_password_de_gmail

# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

### Convenciones de Código

**Nombres de tablas:** PascalCase (Usuarios, Reservas)
**Nombres de campos:** snake_case (cliente_id, fecha_servicio)
**Rutas backend:** kebab-case (/api/tipos-servicio)
**Componentes React:** PascalCase (ClienteLayout.jsx)
**Funciones JS:** camelCase (createAgendamiento)

### Información de Contacto

**Empresa:** MEGA LAVADO
**Email:** info@megalavado.com
**Teléfono:** +57 300 123 4567
**Horario:** Lun - Sáb, 7:00 AM - 6:00 PM

---

**Documento actualizado:** Octubre 2025  
**Versión:** 1.0  
**Estado:** Sistema funcional en producción básica

