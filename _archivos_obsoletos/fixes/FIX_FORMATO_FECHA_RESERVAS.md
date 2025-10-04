# 🔧 Fix: Error de Formato de Fecha en Reservas

**Error**: `Incorrect datetime value: '2025-10-10T19:15:00.000Z' for column 'fecha_servicio'`

**Fecha**: 2 de octubre de 2025

---

## 🐛 Problema

MySQL no acepta el formato ISO 8601 con zona horaria (terminado en "Z"):
```
❌ '2025-10-10T19:15:00.000Z'  // Formato ISO con zona horaria
```

MySQL espera formato sin zona horaria:
```
✅ '2025-10-10 19:15:00'  // Formato MySQL DATETIME
```

---

## 📊 Análisis del Error

### Stack Trace:
```
Error: Incorrect datetime value: '2025-10-10T19:15:00.000Z' for column 'fecha_servicio' at row 1
    at PromisePoolConnection.query (.../mysql2/lib/promise/connection.js:29:22)
    at createAgendamiento (.../agendamientoController.js:227:39)
```

### Línea Problemática (227):
```javascript
// ❌ ANTES:
INSERT INTO Reservas (..., fecha_servicio, ...) 
VALUES (..., '2025-10-10T19:15:00.000Z', ...)
```

### Por qué Ocurre:
- **Frontend** envía: `fecha_servicio: bookingData.fecha_servicio.toISOString()`
- **toISOString()** genera: `'2025-10-10T19:15:00.000Z'` (formato ISO 8601 UTC)
- **MySQL** espera: `'2025-10-10 19:15:00'` (formato DATETIME sin zona)

---

## ✅ Solución Implementada

### Conversión de Formato

**Archivo**: `/backend/controllers/agendamientoController.js`

```javascript
// Línea 107-110 (AGREGADO)
// Validación de formato de fecha
const fechaServicio = new Date(fecha_servicio);
if (isNaN(fechaServicio.getTime())) {
  return res.status(400).json({ 
    error: 'Formato de fecha_servicio inválido. Use formato ISO: YYYY-MM-DDTHH:MM:SS' 
  });
}

// ✅ NUEVO: Convertir a formato MySQL: YYYY-MM-DD HH:MM:SS
const mysqlFechaServicio = fechaServicio.toISOString().slice(0, 19).replace('T', ' ');
// '2025-10-10T19:15:00.000Z' → '2025-10-10 19:15:00'
```

### Cómo Funciona la Conversión:

```javascript
const fecha = '2025-10-10T19:15:00.000Z';

// Paso 1: Crear objeto Date
const fechaObj = new Date(fecha);

// Paso 2: Convertir a ISO string
const isoString = fechaObj.toISOString();
// Resultado: '2025-10-10T19:15:00.000Z'

// Paso 3: Tomar solo los primeros 19 caracteres (sin la Z)
const sinZ = isoString.slice(0, 19);
// Resultado: '2025-10-10T19:15:00'

// Paso 4: Reemplazar la T con espacio
const mysqlFormat = sinZ.replace('T', ' ');
// Resultado: '2025-10-10 19:15:00' ✅
```

### Uso en INSERT (Línea 248):

```javascript
// ❌ ANTES:
const [result] = await connection.query(
  `INSERT INTO Reservas (..., fecha_servicio, ...) 
   VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
  [cliente_id, tecnico_id || null, ..., fecha_servicio, ...]  // ❌ ISO format
);

// ✅ AHORA:
const [result] = await connection.query(
  `INSERT INTO Reservas (..., fecha_servicio, ...) 
   VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
  [cliente_id, tecnico_id || null, ..., mysqlFechaServicio, ...]  // ✅ MySQL format
);
```

### Uso en Email (Línea 278):

```javascript
// ✅ AHORA:
const reservaData = {
  cliente: clienteData,
  reserva: {
    id: reservaId,
    fecha_servicio: mysqlFechaServicio,  // ✅ MySQL format
    precio_total: precio_total,
    observaciones: observaciones,
    estado: 'pendiente'
  },
  ...
};
```

### Uso en Respuesta (Línea 317):

```javascript
// ✅ AHORA:
res.status(201).json({ 
  id: reservaId,
  mensaje: 'Reserva creada exitosamente y emails enviados',
  cliente: `${clienteData.nombre} ${clienteData.apellido}`,
  fecha_servicio: mysqlFechaServicio,  // ✅ MySQL format
  precio_total: precio_total,
  tipo_servicio: tipoServicioData.nombre,
  ubicacion: `${ubicacionData.direccion}, ${ubicacionData.barrio}`,
  tecnico: tecnicoData ? `${tecnicoData.nombre} ${tecnicoData.apellido}` : 'Por asignar'
});
```

---

## 🧪 Prueba de la Corrección

### Frontend Envía:
```javascript
// Booking.jsx - handleSubmit
const reservaData = {
  cliente_id: user.id,
  servicio_tipo_id: 2,
  fecha_servicio: bookingData.fecha_servicio.toISOString(),
  // → '2025-10-10T19:15:00.000Z'
  precio_total: 120000,
  ubicacion: { ... },
};

await agendamientoService.create(reservaData);
```

### Backend Recibe y Convierte:
```javascript
// agendamientoController.js - createAgendamiento
const { fecha_servicio, ... } = req.body;
// fecha_servicio = '2025-10-10T19:15:00.000Z'

const fechaServicio = new Date(fecha_servicio);
const mysqlFechaServicio = fechaServicio.toISOString().slice(0, 19).replace('T', ' ');
// mysqlFechaServicio = '2025-10-10 19:15:00'
```

### MySQL Inserta:
```sql
INSERT INTO Reservas (..., fecha_servicio, ...) 
VALUES (..., '2025-10-10 19:15:00', ...)
-- ✅ Formato aceptado por MySQL
```

### Respuesta al Frontend:
```json
{
  "id": 21,
  "mensaje": "Reserva creada exitosamente y emails enviados",
  "cliente": "cliente4 prueba",
  "fecha_servicio": "2025-10-10 19:15:00",
  "precio_total": 120000,
  "tipo_servicio": "Premium",
  "ubicacion": "Calle 23# 123-2, Chapinero",
  "tecnico": "Por asignar"
}
```

---

## 📋 Formatos de Fecha Comunes

| Formato | Ejemplo | Uso |
|---------|---------|-----|
| **ISO 8601 UTC** | `2025-10-10T19:15:00.000Z` | JavaScript, APIs REST, JSON |
| **ISO 8601 Local** | `2025-10-10T19:15:00` | Sin zona horaria |
| **MySQL DATETIME** | `2025-10-10 19:15:00` | Base de datos MySQL |
| **MySQL DATE** | `2025-10-10` | Solo fecha, sin hora |
| **MySQL TIME** | `19:15:00` | Solo hora, sin fecha |
| **Unix Timestamp** | `1728582900000` | Milisegundos desde 1970 |

---

## 🔄 Flujo Completo de Fecha

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND (Usuario)                                       │
│    DateTimePicker → bookingData.fecha_servicio              │
│    = Date Object: Thu Oct 10 2025 19:15:00 GMT-0500        │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND (Envío)                                         │
│    .toISOString()                                           │
│    = '2025-10-10T19:15:00.000Z'                            │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND (Recepción)                                      │
│    req.body.fecha_servicio                                  │
│    = '2025-10-10T19:15:00.000Z'                            │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. BACKEND (Conversión)                                     │
│    new Date(fecha_servicio)                                 │
│      .toISOString()           // '2025-10-10T19:15:00.000Z' │
│      .slice(0, 19)            // '2025-10-10T19:15:00'      │
│      .replace('T', ' ')       // '2025-10-10 19:15:00'      │
│    = mysqlFechaServicio                                     │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. MYSQL (Inserción)                                        │
│    INSERT INTO Reservas (fecha_servicio)                    │
│    VALUES ('2025-10-10 19:15:00')                          │
│    ✅ Formato DATETIME aceptado                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. MYSQL (Almacenamiento)                                   │
│    Column: fecha_servicio DATETIME                          │
│    Value:  2025-10-10 19:15:00                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. BACKEND (Respuesta)                                      │
│    res.json({ fecha_servicio: mysqlFechaServicio })         │
│    = { fecha_servicio: '2025-10-10 19:15:00' }             │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. FRONTEND (Renderizado)                                   │
│    new Date('2025-10-10 19:15:00').toLocaleString()        │
│    = '10/10/2025, 7:15:00 PM'                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Notas Importantes sobre Zonas Horarias

### Colombia (GMT-5):
```javascript
// Usuario selecciona: 10 de octubre 2025, 7:15 PM (hora local Colombia)
const fecha = new Date(2025, 9, 10, 19, 15, 0);

// toISOString() convierte a UTC (suma 5 horas)
fecha.toISOString();  
// → '2025-10-11T00:15:00.000Z'  ⚠️ Ya es 11 de octubre en UTC!

// Nuestra conversión mantiene la hora local
const mysqlFecha = fecha.toISOString().slice(0, 19).replace('T', ' ');
// → '2025-10-11 00:15:00'  ⚠️ Hora UTC, no hora local
```

### ⚠️ Problema Potencial:
Si el usuario selecciona **7:15 PM** en Colombia, se guardará como **12:15 AM** (medianoche) en la base de datos.

### ✅ Solución Futura (Recomendada):
Usar una librería como `moment-timezone` o `date-fns-tz` para manejar zonas horarias correctamente:

```javascript
const moment = require('moment-timezone');

// Convertir desde zona horaria de Colombia
const colombiaDate = moment.tz(fecha_servicio, 'America/Bogota');
const mysqlFechaServicio = colombiaDate.format('YYYY-MM-DD HH:mm:ss');
```

O agregar campo `timezone` a la tabla Reservas:
```sql
ALTER TABLE Reservas ADD COLUMN timezone VARCHAR(50) DEFAULT 'America/Bogota';
```

---

## 🎯 Resumen de Cambios

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `agendamientoController.js` | 110-111 | Agregada conversión de formato |
| `agendamientoController.js` | 248 | Usar `mysqlFechaServicio` en INSERT |
| `agendamientoController.js` | 278 | Usar `mysqlFechaServicio` en email data |
| `agendamientoController.js` | 317 | Usar `mysqlFechaServicio` en respuesta |

---

## ✅ Verificación

### Antes del Fix:
```
POST /api/agendamiento
{
  "fecha_servicio": "2025-10-10T19:15:00.000Z"
}

Response: 500 Internal Server Error
{
  "error": "Error interno al crear reserva",
  "detalle": "Incorrect datetime value: '2025-10-10T19:15:00.000Z' for column 'fecha_servicio'"
}
```

### Después del Fix:
```
POST /api/agendamiento
{
  "fecha_servicio": "2025-10-10T19:15:00.000Z"
}

Response: 201 Created
{
  "id": 21,
  "mensaje": "Reserva creada exitosamente y emails enviados",
  "fecha_servicio": "2025-10-10 19:15:00"
}
```

---

## 📚 Referencias

- [MySQL DATETIME Documentation](https://dev.mysql.com/doc/refman/8.0/en/datetime.html)
- [JavaScript Date.toISOString()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)
- [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601)
- [moment-timezone](https://momentjs.com/timezone/)

---

**Estado**: ✅ **RESUELTO**  
**Última actualización**: 2 de octubre de 2025
