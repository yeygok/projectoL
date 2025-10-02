# 📊 ANÁLISIS COMPLETO DE LA BASE DE DATOS - MEGA MALVADO

## 🏗️ **ESTRUCTURA GENERAL DE LA BASE DE DATOS**

**Base de datos:** `LavadoVaporBogotaDB`  
**Motor:** MySQL  
**Total de tablas:** 19  
**Total de registros:** ~84 registros distribuidos

---

## 📋 **TABLAS Y SUS ESTRUCTURAS**

### 🔐 **1. AUTENTICACIÓN Y PERMISOS**

#### **Usuarios**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR(100), NOT NULL)
- apellido (VARCHAR(100), NOT NULL)
- email (VARCHAR(100), UNIQUE, NOT NULL)
- telefono (VARCHAR(15), NOT NULL)
- ubicacion_id (INT, FOREIGN KEY → Ubicaciones.id, NULLABLE)
- rol_id (INT, FOREIGN KEY → Roles.id, NOT NULL)
- password (VARCHAR(255), NOT NULL)
- activo (TINYINT(1), DEFAULT 1)
- fecha_ultimo_acceso (DATETIME, NULLABLE)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 8 usuarios  
**Relaciones:** → Roles, → Ubicaciones

#### **Roles**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR(50), UNIQUE, NOT NULL)
- descripcion (TEXT, NULLABLE)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 4 roles  
**Datos:** admin, cliente, tecnico, soporte

#### **Permisos**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR(100), UNIQUE, NOT NULL)
- descripcion (TEXT, NULLABLE)
- modulo (VARCHAR(50), NULLABLE)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 13 permisos  
**Ejemplos:** crear_usuarios, editar_servicios, ver_reservas, etc.

#### **RolPermisos**
```sql
- rol_id (INT, PRIMARY KEY, FOREIGN KEY → Roles.id)
- permiso_id (INT, PRIMARY KEY, FOREIGN KEY → Permisos.id)
```
**Registros:** 21 asignaciones  
**Función:** Tabla pivote muchos-a-muchos

---

### 🛍️ **2. SERVICIOS Y PRODUCTOS**

#### **CategoriasServicios**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR(100), UNIQUE, NOT NULL)
- descripcion (TEXT, NULLABLE)
- icono (VARCHAR(100), NULLABLE)
- activa (TINYINT(1), DEFAULT 1)
- orden (INT, DEFAULT 0)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 7 categorías  
**Datos:** Colchones, Alfombras, Muebles y Sofás, Automóviles, Tapetes, Artículos de Bebés, Espacios y Ambientes

#### **TiposServicio**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR(50), UNIQUE, NOT NULL)
- descripcion (TEXT, NULLABLE)
- multiplicador_precio (DECIMAL(3,2), DEFAULT 1.00)
- color (VARCHAR(7), NULLABLE)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 5 tipos  
**Datos:** Sencillo(1.00x), Premium(1.00x), Gold(1.00x), Deluxe(1.00x), Express(1.00x)

#### **Servicios**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- categoria_id (INT, FOREIGN KEY → CategoriasServicios.id, NOT NULL)
- nombre (VARCHAR(100), NOT NULL)
- descripcion (TEXT, NULLABLE)
- precio_base (DECIMAL(10,2), NOT NULL)
- duracion_estimada (INT, NOT NULL)
- activo (TINYINT(1), DEFAULT 1)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 10 servicios  
**Relaciones:** → CategoriasServicios

---

### 📅 **3. RESERVAS Y OPERACIONES**

#### **EstadosReserva**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- estado (VARCHAR(50), UNIQUE, NOT NULL)
- descripcion (TEXT, NULLABLE)
- color (VARCHAR(7), NULLABLE)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 7 estados  
**Datos:** pendiente, confirmado, en_proceso, completada, cancelada, etc.

#### **Reservas**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- cliente_id (INT, FOREIGN KEY → Usuarios.id, NOT NULL)
- tecnico_id (INT, FOREIGN KEY → Usuarios.id, NULLABLE)
- vehiculo_id (INT, FOREIGN KEY → Vehiculos.id, NULLABLE)
- servicio_tipo_id (INT, FOREIGN KEY → TiposServicio.id, NOT NULL)
- ubicacion_servicio_id (INT, FOREIGN KEY → Ubicaciones.id, NOT NULL)
- fecha_reserva (DATETIME, NOT NULL)
- fecha_servicio (DATETIME, NOT NULL)
- precio_total (DECIMAL(10,2), NOT NULL)
- estado_id (INT, FOREIGN KEY → EstadosReserva.id, NOT NULL)
- observaciones (TEXT, NULLABLE)
- notas_tecnico (TEXT, NULLABLE)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 12 reservas  
**Relaciones:** → Usuarios (cliente, tecnico), → Vehiculos, → TiposServicio, → Ubicaciones, → EstadosReserva

---

### 🚗 **4. OPERACIONES Y LOGÍSTICA**

#### **Ubicaciones**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- direccion (TEXT, NOT NULL)
- barrio (VARCHAR(100), NULLABLE)
- localidad (VARCHAR(100), NULLABLE)
- latitud (DECIMAL(9,6), NULLABLE)
- longitud (DECIMAL(9,6), NULLABLE)
- zona (ENUM: norte,sur,oriente,occidente,centro, NOT NULL)
- activa (TINYINT(1), DEFAULT 1)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 14 ubicaciones  
**Uso:** Direcciones de servicio, ubicaciones de usuarios

#### **Vehiculos**
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- modelo (VARCHAR(50), NOT NULL)
- placa (VARCHAR(20), UNIQUE, NOT NULL)
- capacidad_tanque (DECIMAL(5,2), NULLABLE)
- ubicacion_actual_id (INT, FOREIGN KEY → Ubicaciones.id, NULLABLE)
- activo (TINYINT(1), DEFAULT 1)
- en_servicio (TINYINT(1), DEFAULT 0)
- created_at/updated_at (DATETIME, AUTO)
```
**Registros:** 4 vehículos  
**Relaciones:** → Ubicaciones

---

### 📊 **5. TABLAS SECUNDARIAS (SIN IMPLEMENTAR)**

#### **Calificaciones, HistorialServicios, Notificaciones, OrdenesCompra, ServiciosTipos, Soporte, EstadosSoporte, Tokens**
**Estado:** No implementadas en la API  
**Registros:** Variables (0-5 registros cada una)  
**Uso:** Funcionalidades futuras

---

## 🔗 **RELACIONES ENTRE TABLAS**

```
Usuarios
├── rol_id → Roles.id
├── ubicacion_id → Ubicaciones.id
└── cliente_id/tecnico_id → Reservas.cliente_id/tecnico_id

Roles
└── rol_id → RolPermisos.rol_id

Permisos
└── permiso_id → RolPermisos.permiso_id

Servicios
└── categoria_id → CategoriasServicios.id

Reservas
├── cliente_id → Usuarios.id
├── tecnico_id → Usuarios.id
├── vehiculo_id → Vehiculos.id
├── servicio_tipo_id → TiposServicio.id
├── ubicacion_servicio_id → Ubicaciones.id
└── estado_id → EstadosReserva.id

Vehiculos
└── ubicacion_actual_id → Ubicaciones.id
```

---

## 🚀 **RUTAS IMPLEMENTADAS VS DISPONIBLES**

### ✅ **RUTAS COMPLETAMENTE IMPLEMENTADAS**

#### **Autenticación**
- `POST /api/auth/login` ✅
- `POST /api/auth/register` ✅
- `GET /api/auth/verify` ✅

#### **Dashboard**
- `GET /api/dashboard/stats` ✅
- `GET /api/dashboard/recent-reservas` ✅
- `GET /api/dashboard/usuarios` ✅ (CRUD completo)
- `GET /api/dashboard/servicios` ✅ (CRUD completo)
- `GET /api/dashboard/ubicaciones` ✅ (CRUD completo)
- `GET /api/dashboard/vehiculos` ✅ (CRUD completo)
- `GET /api/dashboard/roles` ✅
- `GET /api/dashboard/categorias` ✅
- `GET /api/dashboard/tipos-servicio` ✅
- `GET /api/dashboard/estados-reserva` ✅

#### **Módulos Principales**
- `GET /api/services` ✅ (CRUD completo)
- `GET /api/clientes` ✅ (CRUD completo)
- `GET /api/agendamiento` ✅ (CRUD completo)
- `GET /api/roles` ✅ (CRUD completo)
- `GET /api/permisos` ✅ (CRUD completo)
- `GET /api/rol-permisos` ✅ (CRUD completo)
- `GET /api/tipos-servicio` ✅ (CRUD completo)
- `GET /api/perfiles` ✅ (CRUD completo)

#### **Utilidades**
- `GET /api/test-users` ✅ (sin token)

---

### ❌ **PROBLEMAS IDENTIFICADOS**

#### **1. Inconsistencias en Claves Foráneas**
- **Reservas.servicio_tipo_id = 11** → No existe TiposServicio.id = 11
- **Solución:** Corregido - actualizado a servicio_tipo_id = 1

#### **2. Consultas SQL con Campos Incorrectos**
- **DashboardController.getRecentReservas:** Usaba campos inexistentes
- **Solución:** Corregido - ahora usa campos correctos

#### **3. Rutas Faltantes**
- **Cliente:** No hay tabla `Clientes` separada - usa `Usuarios` con rol_id = 2
- **Solución:** Las consultas deben filtrar por rol_id

---

### 📋 **RUTAS QUE FUNCIONAN CORRECTAMENTE**

#### **Con Datos Disponibles:**
- ✅ `/api/dashboard/stats` (8 usuarios, 12 reservas, 10 servicios)
- ✅ `/api/dashboard/usuarios` (8 usuarios)
- ✅ `/api/dashboard/servicios` (10 servicios)
- ✅ `/api/dashboard/ubicaciones` (14 ubicaciones)
- ✅ `/api/dashboard/vehiculos` (4 vehículos)
- ✅ `/api/dashboard/recent-reservas` (12 reservas)
- ✅ `/api/roles` (4 roles)
- ✅ `/api/permisos` (13 permisos)

#### **Para Crear Nuevos Registros:**
- ✅ `/api/dashboard/usuarios` (POST)
- ✅ `/api/dashboard/servicios` (POST)
- ✅ `/api/dashboard/ubicaciones` (POST)
- ✅ `/api/dashboard/vehiculos` (POST)
- ✅ `/api/agendamiento` (POST)
- ✅ `/api/roles` (POST)
- ✅ `/api/permisos` (POST)

---

## 🎯 **GUÍA PARA CREAR NUEVAS RUTAS**

### **Antes de Crear una Ruta:**

1. **Verificar Tabla Existe:** `SHOW TABLES;`
2. **Verificar Estructura:** `DESCRIBE nombre_tabla;`
3. **Verificar Datos:** `SELECT COUNT(*) FROM nombre_tabla;`
4. **Verificar Relaciones:** `SHOW CREATE TABLE nombre_tabla;`
5. **Probar Consulta:** Ejecutar la consulta SQL manualmente

### **Campos Requeridos por Tabla:**

#### **Crear Usuario:**
```json
{
  "nombre": "string (requerido)",
  "apellido": "string (requerido)",
  "email": "string único (requerido)",
  "telefono": "string (requerido)",
  "rol_id": "int existente en Roles (requerido)",
  "ubicacion_id": "int existente en Ubicaciones (opcional)",
  "password": "string (requerido)"
}
```

#### **Crear Servicio:**
```json
{
  "categoria_id": "int existente en CategoriasServicios (requerido)",
  "nombre": "string (requerido)",
  "descripcion": "string (opcional)",
  "precio_base": "decimal (requerido)",
  "duracion_estimada": "int (requerido)"
}
```

#### **Crear Reserva:**
```json
{
  "cliente_id": "int existente en Usuarios (requerido)",
  "servicio_tipo_id": "int existente en TiposServicio (requerido)",
  "ubicacion_servicio_id": "int existente en Ubicaciones (requerido)",
  "fecha_servicio": "datetime (requerido)",
  "precio_total": "decimal (requerido)",
  "estado_id": "int existente en EstadosReserva (requerido)",
  "tecnico_id": "int existente en Usuarios (opcional)",
  "vehiculo_id": "int existente en Vehiculos (opcional)",
  "observaciones": "string (opcional)"
}
```

---

## 🔧 **CONSULTAS SQL RECOMENDADAS**

### **Dashboard Stats:**
```sql
SELECT
  (SELECT COUNT(*) FROM Usuarios WHERE activo = 1) as totalUsuarios,
  (SELECT COUNT(*) FROM Usuarios u JOIN Roles r ON u.rol_id = r.id WHERE r.nombre = 'cliente' AND u.activo = 1) as totalClientes,
  (SELECT COUNT(*) FROM Reservas) as totalReservas,
  (SELECT COUNT(*) FROM Servicios WHERE activo = 1) as totalServicios,
  (SELECT COUNT(*) FROM Reservas WHERE DATE(fecha_servicio) = CURDATE()) as reservasHoy,
  (SELECT COUNT(*) FROM Reservas r JOIN EstadosReserva er ON r.estado_id = er.id WHERE er.estado = 'pendiente') as reservasPendientes,
  (SELECT COALESCE(SUM(precio_total), 0) FROM Reservas r JOIN EstadosReserva er ON r.estado_id = er.id WHERE er.estado = 'completada' AND MONTH(r.fecha_servicio) = MONTH(CURDATE())) as ingresosMes
```

### **Reservas Recientes:**
```sql
SELECT
  r.id, r.fecha_reserva, r.fecha_servicio, r.precio_total, r.observaciones,
  u.nombre as cliente_nombre, u.apellido as cliente_apellido,
  ts.nombre as servicio_nombre,
  er.estado as estado_nombre, er.color as estado_color,
  t.nombre as tecnico_nombre, t.apellido as tecnico_apellido
FROM Reservas r
LEFT JOIN Usuarios u ON r.cliente_id = u.id
LEFT JOIN TiposServicio ts ON r.servicio_tipo_id = ts.id
LEFT JOIN EstadosReserva er ON r.estado_id = er.id
LEFT JOIN Usuarios t ON r.tecnico_id = t.id
ORDER BY r.created_at DESC LIMIT 10
```

---

## ⚠️ **NOTAS IMPORTANTES PARA DESARROLLO**

### **Convenciones de la BD:**
- **Campos booleanos:** `activo`, `en_servicio` (TINYINT(1))
- **Fechas:** `created_at`, `updated_at` (DATETIME, auto)
- **Precios:** `DECIMAL(10,2)` para pesos colombianos
- **IDs:** AUTO_INCREMENT empezando en 1

### **Relaciones Obligatorias:**
- **Usuarios:** Siempre debe tener `rol_id` válido
- **Reservas:** Siempre debe tener `cliente_id`, `servicio_tipo_id`, `ubicacion_servicio_id`, `estado_id`
- **Servicios:** Siempre debe tener `categoria_id`

### **Validaciones Recomendadas:**
- Verificar existencia de claves foráneas antes de INSERT/UPDATE
- Usar transacciones para operaciones complejas
- Implementar soft deletes con campo `activo = 0`

---

## 🎯 **PRÓXIMAS RUTAS A IMPLEMENTAR**

### **Alta Prioridad:**
1. **Clientes específicos:** Rutas que filtren usuarios con rol_id = 2
2. **Dashboard de técnico:** Reservas asignadas, estado de vehículos
3. **Reportes:** Ingresos por período, servicios más solicitados

### **Media Prioridad:**
1. **Notificaciones:** Sistema de notificaciones push
2. **Calificaciones:** Sistema de reseñas y calificaciones
3. **Historial:** Seguimiento de cambios en reservas

### **Baja Prioridad:**
1. **Soporte:** Sistema de tickets de soporte
2. **Compras:** Gestión de órdenes de compra
3. **Tokens:** Sistema de tokens de recuperación

---

**📅 Última actualización:** $(date)  
**👨‍💻 Analizado por:** Sistema de documentación automática  
**✅ Estado:** Base de datos consistente y funcional
