# 📋 Análisis: Datos de Reserva (Usuario vs Sistema)

**Fecha**: 2 de octubre de 2025  
**Objetivo**: Definir qué datos ingresa el usuario y cuáles asigna el sistema automáticamente

---

## 🎯 Comparación: Admin vs Cliente

### 👨‍💼 Admin (DashboardAgendamientos)

El admin puede crear reservas para cualquier cliente y tiene control total:

**Datos que ingresa manualmente**:
- ✍️ Cliente (selecciona de lista)
- ✍️ Tipo de Servicio (Sencillo/Premium/Gold)
- ✍️ Ubicación (selecciona de lista existente)
- ✍️ Precio Total
- ✍️ Estado (Pendiente/Confirmada/etc)
- ✍️ Observaciones (opcional)

**Datos asignados automáticamente**:
- 🤖 `fecha_servicio`: Se genera automáticamente (+1 hora desde ahora)
- 🤖 `fecha_reserva`: NOW() en el backend

### 👤 Cliente (Booking - Wizard)

El cliente solo puede crear reservas para sí mismo:

**Datos que ingresa manualmente**:
- ✍️ Categoría de Servicio (Colchones/Vehículos/Tapetes/etc)
- ✍️ Tipo de Servicio (Sencillo/Premium/Gold)
- ✍️ Fecha y Hora del servicio (DateTimePicker)
- ✍️ Dirección completa
- ✍️ Barrio
- ✍️ Localidad
- ✍️ Zona (default: "norte")
- ✍️ Observaciones (opcional)
- ✍️ **Si es Vehículo**: Modelo y Placa

**Datos asignados automáticamente**:
- 🤖 `cliente_id`: user.id (del usuario autenticado)
- 🤖 `estado_id`: 1 (Pendiente por defecto)
- 🤖 `tecnico_id`: null (se asigna después por admin)
- 🤖 `precio_total`: Calculado según tipo de servicio
- 🤖 `fecha_reserva`: NOW() en el backend

---

## 📊 Tabla de Campos Detallada

| Campo | Admin Ingresa | Cliente Ingresa | Sistema Asigna | Notas |
|-------|--------------|-----------------|----------------|-------|
| **cliente_id** | ✅ Selecciona | ❌ | ✅ `user.id` | Cliente autenticado |
| **servicio_tipo_id** | ✅ | ✅ | ❌ | Sencillo/Premium/Gold/Deluxe/Express |
| **categoria_id** | ❌ | ✅ | ❌ | Colchones/Vehículos/Tapetes (Frontend only) |
| **fecha_servicio** | ❌ | ✅ DatePicker | ✅ Auto +1h (Admin) | Cliente elige, Admin auto |
| **fecha_reserva** | ❌ | ❌ | ✅ NOW() | Backend siempre |
| **ubicacion_servicio_id** | ✅ Selecciona | ❌ | ✅ Se crea | Admin usa existente, Cliente crea nueva |
| **ubicacion.direccion** | ❌ | ✅ | ❌ | Cliente ingresa, sistema crea registro |
| **ubicacion.barrio** | ❌ | ✅ | ❌ | Cliente ingresa |
| **ubicacion.localidad** | ❌ | ✅ | ❌ | Cliente ingresa |
| **ubicacion.zona** | ❌ | ✅ Default: "norte" | ❌ | Puede seleccionar norte/sur/este/oeste |
| **vehiculo_id** | ❌ | ❌ | ✅ Se crea/busca | Solo si es categoría Vehículos |
| **vehiculo.modelo** | ❌ | ✅ (si vehículo) | ❌ | "Toyota Corolla 2020" |
| **vehiculo.placa** | ❌ | ✅ (si vehículo) | ❌ | "ABC123" |
| **precio_total** | ✅ | ❌ | ✅ Calculado | Admin manual, Cliente automático |
| **estado_id** | ✅ | ❌ | ✅ Default: 1 | Admin puede cambiar, Cliente siempre "pendiente" |
| **tecnico_id** | ❌ | ❌ | ✅ null | Se asigna después por admin |
| **observaciones** | ✅ | ✅ | ❌ | Ambos pueden agregar notas |

---

## 🔄 Flujo de Creación de Reserva (Cliente)

### 1️⃣ Usuario se Registra

```javascript
// POST /api/auth/register
{
  nombre: "Juan",          // ✍️ Usuario ingresa
  apellido: "Pérez",       // ✍️ Usuario ingresa
  email: "juan@ejemplo.com", // ✍️ Usuario ingresa
  telefono: "3001234567",  // ✍️ Usuario ingresa
  password: "123456",      // ✍️ Usuario ingresa
  rol_id: 2                // 🤖 Sistema asigna (CLIENTE)
}

// Backend crea:
// - Registro en tabla Usuarios
// - rol_id = 2 (cliente)
// - activo = 1
// - created_at = NOW()
```

**Datos disponibles después del registro**:
- ✅ `user.id` (generado por DB)
- ✅ `user.nombre`
- ✅ `user.apellido`
- ✅ `user.email`
- ✅ `user.telefono`
- ✅ `user.rol_id = 2`

---

### 2️⃣ Cliente Crea Reserva (Wizard de 5 Pasos)

#### **Paso 1: Seleccionar Categoría**
```javascript
// Usuario ELIGE de las opciones:
categoria_id: 2  // ✍️ "Vehículos" (o Colchones, Tapetes, etc)
```

#### **Paso 2: Tipo de Servicio**
```javascript
// Usuario ELIGE de las opciones:
servicio_tipo_id: 2  // ✍️ "Premium" (Sencillo=1, Premium=2, Gold=3)
```

#### **Paso 3: Fecha y Hora**
```javascript
// Usuario ELIGE con DateTimePicker:
fecha_servicio: "2025-10-15T10:00:00.000Z"  // ✍️ Usuario selecciona
```

#### **Paso 4: Ubicación + Datos Específicos**
```javascript
// Usuario INGRESA:
{
  direccion: "Calle 100 #15-20",     // ✍️ Usuario ingresa
  barrio: "Chapinero",               // ✍️ Usuario ingresa
  localidad: "Chapinero",            // ✍️ Usuario ingresa
  zona: "norte",                     // ✍️ Usuario elige (default: norte)
  
  // Solo si categoria_id es "Vehículos":
  vehiculo_modelo: "Toyota Corolla 2020",  // ✍️ Usuario ingresa
  vehiculo_placa: "ABC123",                // ✍️ Usuario ingresa
  
  // Opcional:
  observaciones: "Favor llegar temprano"  // ✍️ Usuario ingresa (opcional)
}
```

#### **Paso 5: Confirmar y Enviar**

**Frontend prepara datos**:
```javascript
const reservaData = {
  // 🤖 SISTEMA ASIGNA:
  cliente_id: user.id,  // 🤖 Del usuario autenticado
  
  // ✍️ USUARIO INGRESÓ:
  servicio_tipo_id: bookingData.tipo_servicio_id,
  fecha_servicio: bookingData.fecha_servicio.toISOString(),
  observaciones: bookingData.observaciones || null,
  
  // 🤖 SISTEMA CALCULA:
  precio_total: calculateTotal(), // 🤖 precioBase * multiplicador
  
  // ✍️ USUARIO INGRESÓ (se crea registro automático):
  ubicacion: {
    direccion: bookingData.direccion,
    barrio: bookingData.barrio,
    localidad: bookingData.localidad,
    zona: bookingData.zona,
  },
  
  // ✍️ USUARIO INGRESÓ (solo si es vehículo):
  vehiculo: {
    modelo: bookingData.vehiculo_modelo,
    placa: bookingData.vehiculo_placa,
  }
};
```

**Backend procesa y asigna**:
```javascript
// 🤖 BACKEND ASIGNA AUTOMÁTICAMENTE:
{
  estado_id: 1,              // 🤖 "pendiente" por defecto
  tecnico_id: null,          // 🤖 null (se asigna después)
  fecha_reserva: NOW(),      // 🤖 Timestamp actual
  
  // 🤖 Crea nueva ubicación:
  ubicacion_servicio_id: 123, // 🤖 ID generado después de INSERT
  
  // 🤖 Crea o busca vehículo:
  vehiculo_id: 45,           // 🤖 ID generado o encontrado
}
```

---

## 💡 Lógica de Negocio

### 🤖 Datos que SIEMPRE Asigna el Sistema

1. **Cliente ID** (`cliente_id`)
   - ✅ Del token JWT del usuario autenticado
   - ✅ No puede crear reservas para otros usuarios
   - ✅ Seguridad: No confía en lo que envía el frontend

2. **Estado Inicial** (`estado_id`)
   - ✅ Siempre comienza en "pendiente" (id=1)
   - ✅ Solo el admin puede cambiar estados después
   - ✅ Flujo: Pendiente → Confirmada → Asignada → En Proceso → Completada

3. **Técnico** (`tecnico_id`)
   - ✅ Siempre null al crear
   - ✅ El admin lo asigna después
   - ✅ Puede basarse en disponibilidad, zona, especialidad

4. **Fecha de Reserva** (`fecha_reserva`)
   - ✅ Timestamp de cuando se crea la reserva
   - ✅ NOW() en el backend
   - ✅ Diferente de `fecha_servicio` (cuando se realiza el servicio)

5. **Ubicación ID** (`ubicacion_servicio_id`)
   - ✅ Se crea automáticamente con los datos que ingresa el usuario
   - ✅ Backend hace INSERT en tabla Ubicaciones
   - ✅ Ventaja: Historial de ubicaciones por cliente

6. **Vehículo ID** (`vehiculo_id`)
   - ✅ Backend busca si ya existe con esa placa
   - ✅ Si existe: usa el existente
   - ✅ Si no existe: crea nuevo
   - ✅ Ventaja: Historial de servicios por vehículo

7. **Precio Total** (`precio_total`)
   - ✅ Cliente: Calculado automáticamente (no confiar en frontend)
   - ✅ Fórmula: `precioBase * multiplicador_precio`
   - ✅ Admin: Puede ingresarlo manualmente

---

## 🎨 Experiencia de Usuario (UX)

### ✍️ Lo que el Usuario VE y Controla

1. **Selección de Servicio**
   - 🖼️ Tarjetas visuales con imágenes
   - 🎯 Click directo, intuitivo
   - ✨ Pre-selección desde Home

2. **Tipo de Servicio**
   - 💎 Sencillo, Premium, Gold
   - 💰 Muestra precio en cada opción
   - ⭐ Destaca diferencias (básico vs completo)

3. **Fecha y Hora**
   - 📅 Calendario interactivo
   - 🕐 Selector de hora
   - ⏰ Validación: No permite fechas pasadas

4. **Ubicación**
   - 🏠 Dirección completa
   - 🗺️ Barrio y Localidad
   - 🧭 Zona (Norte/Sur/Este/Oeste)

5. **Datos Específicos**
   - 🚗 Modelo y Placa (si es vehículo)
   - 📝 Observaciones opcionales

6. **Confirmación**
   - ✅ Resumen de todo
   - 💰 Precio total calculado
   - 🔒 Botón "Confirmar Reserva"

### 🤖 Lo que el Usuario NO VE (Automático)

1. **Su Identidad**
   - ❌ No elige "cliente"
   - ✅ Sistema lo toma del token JWT

2. **Estado Inicial**
   - ❌ No ve opciones de estado
   - ✅ Siempre comienza "pendiente"

3. **Asignación de Técnico**
   - ❌ No elige técnico
   - ✅ Admin lo asigna después

4. **Cálculo de Precio**
   - ❌ No puede modificar precio
   - ✅ Sistema lo calcula

5. **Creación de Registros**
   - ❌ No sabe que se crea ubicación/vehículo
   - ✅ Backend crea automáticamente

---

## 🔐 Seguridad y Validaciones

### Backend Valida

```javascript
// 1. Cliente ID del token (no del body)
const cliente_id = req.user.id;  // ✅ Del JWT, no del req.body

// 2. Rol debe ser "cliente"
const [clienteRows] = await pool.query(
  'SELECT id FROM Usuarios WHERE id = ? AND rol_id = 2',
  [cliente_id]
);
if (clienteRows.length === 0) {
  throw new Error('Usuario no es cliente');
}

// 3. Fecha no puede ser pasada
if (new Date(fecha_servicio) < new Date()) {
  throw new Error('Fecha debe ser futura');
}

// 4. Precio total recalcular (no confiar en frontend)
const [tipoServicio] = await pool.query(
  'SELECT multiplicador_precio FROM TiposServicio WHERE id = ?',
  [servicio_tipo_id]
);
const precioReal = PRECIO_BASE * tipoServicio[0].multiplicador_precio;

// 5. Estado siempre pendiente para clientes
const estado_id = 1; // Ignorar lo que envíe el frontend
```

---

## 📈 Mejoras Propuestas

### 🎯 Para el Cliente

1. **Auto-completar Datos**
   ```javascript
   // Si el cliente ya tiene reservas:
   - Sugerir última dirección usada
   - Sugerir último vehículo usado (si aplica)
   - Pre-llenar teléfono del perfil
   ```

2. **Precio Dinámico en Tiempo Real**
   ```javascript
   // Mostrar precio mientras elige:
   Paso 2: "Premium: $120,000" (actualiza en vivo)
   Paso 5: "Total: $120,000" (confirma)
   ```

3. **Validación de Placa**
   ```javascript
   // Si la placa ya existe en el sistema:
   "Ya tienes un Toyota Corolla 2020 registrado. ¿Usar este vehículo?"
   [ Sí, usar este ]  [ No, es otro vehículo ]
   ```

4. **Sugerencias de Fecha**
   ```javascript
   // Mostrar disponibilidad:
   "✅ Disponible mañana a las 10:00 AM"
   "⚠️ Fecha muy solicitada (pocas disponibilidades)"
   ```

### 🎯 Para el Backend

1. **Validación de Duplicados**
   ```javascript
   // Evitar reservas duplicadas:
   // Mismo cliente + misma fecha + mismo servicio
   const [duplicado] = await pool.query(
     'SELECT id FROM Reservas WHERE cliente_id = ? AND fecha_servicio = ? AND estado_id != 6',
     [cliente_id, fecha_servicio]
   );
   if (duplicado.length > 0) {
     throw new Error('Ya tienes una reserva para esa fecha');
   }
   ```

2. **Asignación Inteligente de Técnico**
   ```javascript
   // Después de crear, asignar técnico automáticamente:
   - Buscar técnico disponible en esa fecha
   - Priorizar por zona (norte/sur/este/oeste)
   - Notificar por email al técnico asignado
   ```

3. **Geocodificación de Dirección**
   ```javascript
   // Validar que la dirección existe:
   - API de Google Maps / OpenStreetMap
   - Obtener coordenadas (lat, lng)
   - Guardar en tabla Ubicaciones
   ```

---

## 📝 Resumen Ejecutivo

### Cliente Ingresa (8 campos):
1. ✍️ Categoría de Servicio
2. ✍️ Tipo de Servicio
3. ✍️ Fecha y Hora
4. ✍️ Dirección
5. ✍️ Barrio
6. ✍️ Localidad
7. ✍️ Zona
8. ✍️ Modelo + Placa (si es vehículo)

### Sistema Asigna (7 campos):
1. 🤖 cliente_id (del token JWT)
2. 🤖 estado_id = 1 (pendiente)
3. 🤖 tecnico_id = null
4. 🤖 precio_total (calculado)
5. 🤖 fecha_reserva = NOW()
6. 🤖 ubicacion_servicio_id (creado automáticamente)
7. 🤖 vehiculo_id (creado/encontrado automáticamente)

### Total: 15 campos en la tabla Reservas
- **Usuario controla**: 8 campos (53%)
- **Sistema asigna**: 7 campos (47%)
- **Resultado**: Balance perfecto entre control y automatización

---

**Conclusión**: El usuario tiene control sobre lo que importa (qué, cuándo, dónde), mientras el sistema maneja la complejidad técnica (IDs, estados, cálculos) de forma transparente y segura. ✨
