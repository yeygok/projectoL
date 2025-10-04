# 🔧 Fix: Usuarios Inactivos al Registrarse

**Problema Reportado**: Los usuarios nuevos aparecen como "Inactivos" en el dashboard después de registrarse.

**Fecha**: 2 de octubre de 2025

---

## ✅ Verificación del Código

### Backend - authController.js (Registro Público)
```javascript
// Línea 32
const [result] = await pool.query(`
  INSERT INTO Usuarios (email, password, nombre, apellido, telefono, rol_id, activo) 
  VALUES (?, ?, ?, ?, ?, ?, 1)  // ✅ activo = 1
`, [email, hashedPassword, nombre, apellido, telefono || null, rol_id]);
```
**Estado**: ✅ **CORRECTO** - Los usuarios se crean con `activo = 1`

### Backend - dashboardController.js (Crear desde Admin)
```javascript
// Línea 162
const [result] = await pool.query(`
  INSERT INTO Usuarios (nombre, apellido, email, telefono, ubicacion_id, rol_id, password, activo)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1)  // ✅ activo = 1
`, [nombre, apellido, email, telefono, ubicacion_id, rol_id, hashedPassword]);
```
**Estado**: ✅ **CORRECTO** - Los usuarios se crean con `activo = 1`

### Backend - dashboardController.js (Obtener Usuarios)
```javascript
// Línea 135-142
async getAllUsers(req, res) {
  try {
    const [usuarios] = await pool.query(`
      SELECT u.*, r.nombre as rol_nombre, ub.direccion as ubicacion_direccion
      FROM Usuarios u
      LEFT JOIN Roles r ON u.rol_id = r.id
      LEFT JOIN Ubicaciones ub ON u.ubicacion_id = ub.id
      ORDER BY u.created_at DESC
    `);  // ✅ No filtra, trae todos los usuarios con su campo activo
    res.json(usuarios);
  }
}
```
**Estado**: ✅ **CORRECTO** - Devuelve todos los usuarios con el campo `activo`

### Frontend - DashboardUsuarios.jsx (Mostrar Estado)
```javascript
// Línea 103-104
{
  field: 'activo',
  headerName: 'Estado',
  render: (value, row) => (
    <Chip
      label={row.activo ? 'Activo' : 'Inactivo'}  // ✅ Verifica row.activo
      color={getStatusColor(row.activo ? 'activo' : 'inactivo')}
      size="small"
      variant="outlined"
    />
  )
}
```
**Estado**: ✅ **CORRECTO** - Muestra el estado basado en `row.activo`

---

## 🔍 Diagnóstico del Problema

### Posibles Causas:

1. **Usuarios antiguos sin valor `activo`**
   - Si la tabla se creó sin el campo `activo` inicialmente
   - Usuarios creados antes de agregar la columna `activo`
   - Valor por defecto NULL o 0 en la estructura de la tabla

2. **Campo `activo` con valor NULL**
   - JavaScript evalúa `null` como `false` en condiciones booleanas
   - `row.activo ? 'Activo' : 'Inactivo'` → NULL → 'Inactivo'

3. **Tipo de dato incorrecto**
   - Si `activo` es VARCHAR en lugar de TINYINT/BOOLEAN
   - Valores como '0', '1', 'true', 'false' pueden causar problemas

---

## 🛠️ Solución

### Paso 1: Verificar Estructura de la Tabla

```sql
USE LavadoVaporBogotaDB;

-- Ver estructura actual
DESCRIBE Usuarios;

-- Debe tener algo como:
-- activo | tinyint(1) | YES | NULL | 1 | 
```

**Resultado esperado**:
```
Field    | Type         | Null | Default | Extra
---------|--------------|------|---------|-------
activo   | tinyint(1)   | YES  | 1       | 
```

### Paso 2: Verificar Usuarios Existentes

```sql
-- Ver estado de usuarios
SELECT 
    id, 
    nombre, 
    apellido, 
    email, 
    rol_id,
    activo,
    CASE 
        WHEN activo IS NULL THEN 'NULL'
        WHEN activo = 1 THEN 'ACTIVO'
        WHEN activo = 0 THEN 'INACTIVO'
        ELSE 'OTRO'
    END as estado_texto,
    created_at 
FROM Usuarios 
ORDER BY created_at DESC
LIMIT 20;
```

### Paso 3: Corregir Usuarios Inactivos

```sql
-- Activar TODOS los usuarios que están inactivos o NULL
UPDATE Usuarios 
SET activo = 1 
WHERE activo = 0 OR activo IS NULL;

-- Verificar cambios
SELECT 
    COUNT(*) as total_usuarios,
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as usuarios_activos,
    SUM(CASE WHEN activo = 0 OR activo IS NULL THEN 1 ELSE 0 END) as usuarios_inactivos
FROM Usuarios;
```

### Paso 4: Modificar Tabla (Si es necesario)

Si la columna no tiene valor por defecto correcto:

```sql
-- Modificar columna para que tenga DEFAULT 1 y NOT NULL
ALTER TABLE Usuarios 
MODIFY COLUMN activo TINYINT(1) NOT NULL DEFAULT 1;

-- Verificar cambio
DESCRIBE Usuarios;
```

---

## 📝 Script Completo de Corrección

```bash
# Ejecutar desde terminal
mysql -u root -p LavadoVaporBogotaDB < backend/scripts/activar_usuarios.sql
```

**Contenido del script** (`backend/scripts/activar_usuarios.sql`):

```sql
USE LavadoVaporBogotaDB;

-- ==========================================
-- PASO 1: VERIFICAR ESTADO ACTUAL
-- ==========================================
SELECT '====== ESTADO ACTUAL ======' as '';

SELECT 
    COUNT(*) as total_usuarios,
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as activos,
    SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) as inactivos,
    SUM(CASE WHEN activo IS NULL THEN 1 ELSE 0 END) as nulls
FROM Usuarios;

-- ==========================================
-- PASO 2: ACTIVAR TODOS LOS USUARIOS
-- ==========================================
SELECT '====== ACTIVANDO USUARIOS ======' as '';

UPDATE Usuarios 
SET activo = 1 
WHERE activo = 0 OR activo IS NULL;

-- ==========================================
-- PASO 3: VERIFICAR CAMBIOS
-- ==========================================
SELECT '====== ESTADO DESPUÉS DE ACTUALIZAR ======' as '';

SELECT 
    COUNT(*) as total_usuarios,
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as activos,
    SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) as inactivos,
    SUM(CASE WHEN activo IS NULL THEN 1 ELSE 0 END) as nulls
FROM Usuarios;

-- ==========================================
-- PASO 4: MOSTRAR USUARIOS ACTUALIZADOS
-- ==========================================
SELECT '====== ÚLTIMOS 20 USUARIOS ======' as '';

SELECT 
    id, 
    nombre, 
    apellido, 
    email, 
    rol_id,
    activo,
    CASE WHEN activo = 1 THEN '✅ ACTIVO' ELSE '❌ INACTIVO' END as estado,
    created_at 
FROM Usuarios 
ORDER BY created_at DESC
LIMIT 20;

-- ==========================================
-- PASO 5: ASEGURAR DEFAULT VALUE (OPCIONAL)
-- ==========================================
SELECT '====== MODIFICANDO ESTRUCTURA ======' as '';

ALTER TABLE Usuarios 
MODIFY COLUMN activo TINYINT(1) NOT NULL DEFAULT 1;

SELECT '====== ✅ CORRECCIÓN COMPLETADA ======' as '';
```

---

## 🧪 Verificación Post-Corrección

### 1. Verificar en Base de Datos

```sql
-- Todos los usuarios deben estar activos
SELECT id, nombre, apellido, activo 
FROM Usuarios 
WHERE activo = 0 OR activo IS NULL;

-- Debe retornar 0 filas
```

### 2. Verificar en Dashboard Admin

1. Ir a `http://localhost:5173/dashboard/usuarios`
2. Todos los usuarios deben mostrar chip verde "Activo"
3. No debe haber chips grises "Inactivo"

### 3. Crear Usuario Nuevo de Prueba

```javascript
// Desde el registro público
POST http://localhost:3000/api/auth/register
{
  "nombre": "Test",
  "apellido": "Usuario",
  "email": "test123@ejemplo.com",
  "telefono": "3001234567",
  "password": "123456"
}

// Verificar respuesta
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 25,
    "activo": 1,  // ✅ Debe ser 1
    "rol_nombre": "cliente"
  }
}
```

### 4. Verificar en Frontend

1. Ir al dashboard de usuarios
2. El nuevo usuario debe aparecer como "Activo" inmediatamente
3. Chip verde: ✅ Activo

---

## 📊 Resumen de Estados

| Estado | Valor DB | Chip Color | Texto | Comportamiento |
|--------|----------|------------|-------|----------------|
| ✅ Activo | `activo = 1` | Verde | "Activo" | Puede hacer login y usar el sistema |
| ❌ Inactivo | `activo = 0` | Gris | "Inactivo" | No puede hacer login |
| ⚠️ NULL | `activo = NULL` | Gris | "Inactivo" | Tratado como inactivo |

**Objetivo**: Todos los usuarios nuevos deben tener `activo = 1`

---

## 🔐 Casos de Uso de "Inactivo"

### Cuándo un usuario DEBE estar inactivo (activo = 0):

1. **Suspensión por admin**
   - Usuario violó términos de servicio
   - Cuenta temporalmente suspendida
   - Revisión de seguridad

2. **Eliminación lógica (soft delete)**
   - Usuario solicitó eliminar su cuenta
   - No se borra físicamente de la DB
   - Se marca como inactivo

3. **Usuario bloqueado**
   - Demasiados intentos de login fallidos
   - Actividad sospechosa detectada
   - Requiere verificación adicional

### Cuándo un usuario DEBE estar activo (activo = 1):

1. **Registro nuevo** ← **TU CASO**
   - Usuario se registra desde el formulario público
   - Debe poder usar el sistema inmediatamente
   - No requiere activación por email (por ahora)

2. **Usuario creado por admin**
   - Admin crea cuenta para cliente
   - Usuario puede empezar a usar el sistema

3. **Usuario reactivado**
   - Admin reactiva cuenta suspendida
   - Usuario recupera acceso al sistema

---

## 🎯 Prevención de Problemas Futuros

### 1. Validación en Backend

```javascript
// authController.js - register
// ✅ Ya está implementado correctamente
INSERT INTO Usuarios (..., activo) VALUES (..., 1)
```

### 2. Validación en Frontend

```javascript
// DashboardUsuarios.jsx - Formulario de crear usuario
defaultValues: {
  activo: 1  // ✅ Ya está implementado correctamente
}
```

### 3. Validación al Login

```javascript
// authController.js - login
if (!user.activo) {
  return res.status(401).json({ 
    error: 'Usuario inactivo. Contacte al administrador.' 
  });
}
// ✅ Ya está implementado correctamente
```

### 4. Tests Automáticos (Recomendado)

```javascript
// tests/auth.test.js
describe('Usuario Registration', () => {
  it('should create user with activo = 1', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test',
        apellido: 'User',
        email: 'test@test.com',
        password: '123456'
      });
    
    expect(response.body.user.activo).toBe(1);
  });
});
```

---

## ✅ Checklist de Corrección

- [ ] Ejecutar script SQL `activar_usuarios.sql`
- [ ] Verificar que todos los usuarios existentes tienen `activo = 1`
- [ ] Verificar estructura de tabla tiene DEFAULT 1
- [ ] Crear usuario de prueba desde registro público
- [ ] Verificar en dashboard que aparece como "Activo"
- [ ] Verificar que puede hacer login correctamente
- [ ] Verificar que puede crear reservas
- [ ] Documentar en base de conocimiento

---

## 🚀 Ejecución de la Corrección

### Opción 1: MySQL Workbench / phpMyAdmin

1. Abrir MySQL Workbench o phpMyAdmin
2. Seleccionar base de datos `LavadoVaporBogotaDB`
3. Copiar y pegar el script SQL
4. Ejecutar
5. Verificar resultados

### Opción 2: Terminal

```bash
# Navegar al directorio del proyecto
cd "/Users/yeygok/Desktop/project L"

# Ejecutar script
mysql -u root -p LavadoVaporBogotaDB < backend/scripts/activar_usuarios.sql

# Verificar manualmente
mysql -u root -p -e "SELECT id, nombre, activo FROM LavadoVaporBogotaDB.Usuarios ORDER BY created_at DESC LIMIT 10;"
```

### Opción 3: Desde Node.js (Backend)

```javascript
// backend/scripts/activarUsuarios.js
const pool = require('../config/db');

async function activarUsuarios() {
  try {
    const [result] = await pool.query(
      'UPDATE Usuarios SET activo = 1 WHERE activo = 0 OR activo IS NULL'
    );
    
    console.log(`✅ ${result.affectedRows} usuarios activados`);
    
    const [usuarios] = await pool.query(
      'SELECT COUNT(*) as total, SUM(activo = 1) as activos FROM Usuarios'
    );
    
    console.log(`📊 Total: ${usuarios[0].total}, Activos: ${usuarios[0].activos}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

activarUsuarios();
```

**Ejecutar**:
```bash
node backend/scripts/activarUsuarios.js
```

---

## 📞 Soporte

Si después de ejecutar estos pasos sigues viendo usuarios como "Inactivos":

1. Compartir captura de pantalla del dashboard de usuarios
2. Ejecutar y compartir resultado de:
   ```sql
   SELECT id, nombre, apellido, email, activo, created_at 
   FROM Usuarios 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
3. Verificar logs del servidor backend al crear usuario
4. Verificar Network tab en DevTools al cargar usuarios

---

**Última actualización**: 2 de octubre de 2025  
**Estado**: ✅ Código correcto, solo necesita corrección de datos existentes
