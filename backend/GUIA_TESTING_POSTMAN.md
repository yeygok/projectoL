# 🧪 GUÍA DE TESTING - POSTMAN

## 📋 Preparación (2 minutos)

### 1. Importar Colección en Postman

**Opción A: Usando la App de Postman**
```
1. Abrir Postman Desktop o Web
2. Clic en "Import" (esquina superior izquierda)
3. Seleccionar "Upload Files"
4. Navegar a: /Users/yeygok/Desktop/project L/backend/postman_fase1_crud.json
5. Clic en "Import"
```

**Opción B: Usando curl (si prefieres terminal)**
```bash
# Ver en el archivo de tests automatizados: test-api.sh
```

---

### 2. Configurar Variables de Entorno

**Crear Environment en Postman:**
```
1. Clic en "Environments" (icono ojo en esquina superior derecha)
2. Clic en "+" para crear nuevo environment
3. Nombre: "Lavado Vapor - Local"
4. Agregar variable:
   - Variable: baseUrl
   - Initial Value: http://localhost:3000/api
   - Current Value: http://localhost:3000/api
5. Clic en "Save"
6. Seleccionar el environment creado en el dropdown
```

---

## 🧪 TESTS A EJECUTAR (Orden Recomendado)

### FASE 1: Autenticación (OBLIGATORIO) ⚡
**Endpoint:** `POST /auth/login`

```json
Body:
{
  "email": "admin@lavadovapor.com",
  "password": "admin123"
}
```

**Resultado esperado:**
- ✅ Status: 200 OK
- ✅ Respuesta contiene: `{ success: true, token: "jwt-token..." }`
- ✅ El token se guarda automáticamente en variable `{{token}}`

**Si falla:**
```bash
# Verificar que existe el usuario admin
# Puedes crearlo desde el frontend login o con este query:
INSERT INTO Usuarios (nombre, email, password_hash, rol_id) 
VALUES ('Admin', 'admin@lavadovapor.com', '$2b$10$hash...', 1);
```

---

### FASE 2: Categorías (6 tests) 📦

#### Test 2.1: GET All Categorías ✅
**Endpoint:** `GET /api/categorias`  
**Auth:** No requerida

**Resultado esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Colchones",
      "descripcion": "...",
      "activa": 1,
      "total_servicios": 5
    }
  ]
}
```

---

#### Test 2.2: GET Categoría by ID ✅
**Endpoint:** `GET /api/categorias/1`  
**Auth:** No requerida

**Resultado esperado:**
- ✅ Datos de la categoría
- ✅ Array de servicios asociados

---

#### Test 2.3: POST Create Categoría ✅
**Endpoint:** `POST /api/categorias`  
**Auth:** ⚠️ Token Admin requerido

```json
{
  "nombre": "Tapetes",
  "descripcion": "Limpieza profunda de tapetes de automóvil"
}
```

**Resultado esperado:**
- ✅ Status: 201 Created
- ✅ Retorna categoría creada con ID

---

#### Test 2.4: PUT Update Categoría ✅
**Endpoint:** `PUT /api/categorias/[ID_CREADO]`  
**Auth:** ⚠️ Token Admin requerido

```json
{
  "nombre": "Tapetes Premium",
  "descripcion": "Limpieza premium de tapetes con protección anti-manchas"
}
```

**Resultado esperado:**
- ✅ Status: 200 OK
- ✅ Mensaje de actualización exitosa

---

#### Test 2.5: DELETE Categoría ✅
**Endpoint:** `DELETE /api/categorias/[ID_CREADO]`  
**Auth:** ⚠️ Token Admin requerido

**Resultado esperado:**
- ✅ Status: 200 OK
- ✅ Categoría marcada como inactiva (soft delete)

---

#### Test 2.6: PUT Reactivar Categoría ✅
**Endpoint:** `PUT /api/categorias/[ID_ELIMINADO]/reactivar`  
**Auth:** ⚠️ Token Admin requerido

**Resultado esperado:**
- ✅ Status: 200 OK
- ✅ Categoría reactivada (activa = 1)

---

### FASE 3: Tipos de Servicio (5 tests) 🎨

#### Test 3.1: GET All Tipos ✅
**Endpoint:** `GET /api/tipos-servicio`  
**Auth:** No requerida

**Resultado esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Sencillo",
      "descripcion": "...",
      "multiplicador": 1.0,
      "color": "#28A745",
      "total_reservas": 10
    }
  ]
}
```

---

#### Test 3.2: GET Tipo by ID ✅
**Endpoint:** `GET /api/tipos-servicio/1`  
**Auth:** No requerida

---

#### Test 3.3: POST Create Tipo ✅
**Endpoint:** `POST /api/tipos-servicio`  
**Auth:** ⚠️ Token Admin requerido

```json
{
  "nombre": "Express",
  "descripcion": "Servicio rápido en 2 horas",
  "multiplicador": 1.5,
  "color": "#FF5722"
}
```

**Validaciones a probar:**
- ✅ Color debe ser HEX válido (#RRGGBB)
- ✅ Multiplicador debe estar entre 0 y 10
- ✅ Nombre no puede estar duplicado

---

#### Test 3.4: PUT Update Tipo ✅
**Endpoint:** `PUT /api/tipos-servicio/[ID]`  
**Auth:** ⚠️ Token Admin requerido

---

#### Test 3.5: DELETE Tipo ✅
**Endpoint:** `DELETE /api/tipos-servicio/[ID]`  
**Auth:** ⚠️ Token Admin requerido

**Nota:** Solo se puede eliminar si no tiene reservas asociadas

---

### FASE 4: Estados de Reserva (6 tests) 📊

#### Test 4.1: GET All Estados ✅
**Endpoint:** `GET /api/estados-reserva`  
**Auth:** No requerida

**Resultado esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "estado": "pendiente",
      "color": "#FFC107",
      "total_reservas": 15,
      "reservas_futuras": 8,
      "reservas_pasadas": 7
    }
  ]
}
```

---

#### Test 4.2: GET Estado by ID ✅
**Endpoint:** `GET /api/estados-reserva/1`  
**Auth:** No requerida

**Resultado esperado:**
- ✅ Datos del estado
- ✅ Array con 5 reservas de muestra

---

#### Test 4.3: GET Estadísticas 📊
**Endpoint:** `GET /api/estados-reserva/stats/resumen`  
**Auth:** No requerida

**Resultado esperado:**
```json
{
  "success": true,
  "data": [
    {
      "estado": "completada",
      "total_reservas": 50,
      "futuras": 0,
      "pasadas": 50,
      "ingresos_totales": 5000000,
      "precio_promedio": 100000
    }
  ]
}
```

---

#### Test 4.4: POST Create Estado ✅
**Endpoint:** `POST /api/estados-reserva`  
**Auth:** ⚠️ Token Admin requerido

```json
{
  "estado": "en_camino",
  "descripcion": "El técnico está en camino hacia la ubicación",
  "color": "#17A2B8"
}
```

---

#### Test 4.5: PUT Update Estado ✅
**Endpoint:** `PUT /api/estados-reserva/[ID]`  
**Auth:** ⚠️ Token Admin requerido

---

#### Test 4.6: DELETE Estado ✅
**Endpoint:** `DELETE /api/estados-reserva/[ID]`  
**Auth:** ⚠️ Token Admin requerido

**Nota:** No se pueden eliminar estados críticos: pendiente, confirmada, completada, cancelada

---

## 🧪 TESTS DE VALIDACIÓN (6 tests de error)

### Test V1: Categoria sin nombre (400) ❌
**Endpoint:** `POST /api/categorias`

```json
{
  "descripcion": "Test sin nombre"
}
```

**Resultado esperado:**
- ❌ Status: 400 Bad Request
- ❌ Mensaje: "El nombre es requerido"

---

### Test V2: Estado sin nombre (400) ❌
**Endpoint:** `POST /api/estados-reserva`

```json
{
  "descripcion": "Estado sin nombre",
  "color": "#000000"
}
```

**Resultado esperado:**
- ❌ Status: 400 Bad Request

---

### Test V3: Estado duplicado (409) ❌
**Endpoint:** `POST /api/estados-reserva`

```json
{
  "estado": "pendiente",
  "descripcion": "...",
  "color": "#FFC107"
}
```

**Resultado esperado:**
- ❌ Status: 409 Conflict
- ❌ Mensaje: "Ya existe un estado con ese nombre"

---

### Test V4: Delete estado crítico (400) ❌
**Endpoint:** `DELETE /api/estados-reserva/1`

**Resultado esperado:**
- ❌ Status: 400 Bad Request
- ❌ Mensaje: "No se puede eliminar un estado crítico del sistema"

---

### Test V5: Tipo color inválido (400) ❌
**Endpoint:** `POST /api/tipos-servicio`

```json
{
  "nombre": "Test",
  "color": "rojo"
}
```

**Resultado esperado:**
- ❌ Status: 400 Bad Request
- ❌ Mensaje sobre formato HEX

---

### Test V6: Acceso sin token (401) ❌
**Endpoint:** `POST /api/categorias`  
**Auth:** Sin header Authorization

**Resultado esperado:**
- ❌ Status: 401 Unauthorized
- ❌ Mensaje: "Token no proporcionado"

---

### Test V7: Acceso sin rol admin (403) ❌
**Endpoint:** `POST /api/categorias`  
**Auth:** Token de usuario cliente (no admin)

**Resultado esperado:**
- ❌ Status: 403 Forbidden
- ❌ Mensaje: "Acceso denegado. Se requiere rol de administrador"

---

## 📊 CHECKLIST DE TESTING

### ✅ Funcionalidad
- [ ] Todos los endpoints GET funcionan sin autenticación
- [ ] Todos los endpoints POST/PUT/DELETE requieren token admin
- [ ] Los datos se guardan correctamente en la BD
- [ ] Las relaciones (JOIN) funcionan correctamente
- [ ] Los contadores son precisos

### ✅ Validaciones
- [ ] Campos requeridos se validan
- [ ] Formatos (HEX, números) se validan
- [ ] Duplicados se previenen (409)
- [ ] Rangos se respetan (multiplicador 0-10)

### ✅ Seguridad
- [ ] Token JWT se requiere en rutas protegidas
- [ ] Rol admin se verifica correctamente
- [ ] Tokens inválidos retornan 401
- [ ] Usuarios sin permisos retornan 403

### ✅ Integridad de Datos
- [ ] No se pueden eliminar registros con dependencias
- [ ] Estados críticos están protegidos
- [ ] Soft delete preserva historial
- [ ] Reactivación funciona correctamente

### ✅ Performance
- [ ] Queries optimizadas (no N+1)
- [ ] Respuestas en < 200ms
- [ ] Sin memory leaks en servidor

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot connect to database"
```bash
# Verificar que MySQL esté corriendo
brew services list | grep mysql

# Reiniciar MySQL si es necesario
brew services restart mysql
```

---

### Error: "Token no proporcionado" en todos los endpoints
```
1. Ejecutar primero el endpoint de Login
2. Verificar que la variable {{token}} se guardó automáticamente
3. Revisar que el environment esté seleccionado
```

---

### Error: "Acceso denegado. Se requiere rol de administrador"
```bash
# Verificar el rol del usuario en la BD
SELECT u.*, r.nombre as rol 
FROM Usuarios u 
JOIN Roles r ON u.rol_id = r.id 
WHERE u.email = 'admin@lavadovapor.com';

# El rol debe ser 'admin'
```

---

### Error 500 en algún endpoint
```
1. Revisar la consola del servidor backend
2. Verificar que la tabla existe en la BD
3. Revisar el log de errores con emoji ❌
```

---

## 📈 RESULTADOS ESPERADOS

### ✅ Si todo funciona correctamente:
- 23/23 tests pasados (100%)
- 0 errores 500 (server errors)
- Validaciones funcionando correctamente
- Seguridad implementada

### 📊 Tiempo estimado:
- Importar colección: 2 minutos
- Ejecutar todos los tests: 15 minutos
- Verificar resultados: 10 minutos
- **TOTAL: ~30 minutos**

---

## 🚀 SIGUIENTE PASO

Una vez completado el testing:
→ **Crear vistas del Frontend Dashboard** 🎨

Archivos a crear:
1. `DashboardCategorias.jsx`
2. `DashboardTiposServicio.jsx`
3. `DashboardEstadosReserva.jsx`

**Tiempo estimado:** 2-3 horas

---

**¿Listo para empezar el testing?** 🧪
