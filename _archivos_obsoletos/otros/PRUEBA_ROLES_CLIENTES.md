# 🧪 Guía de Prueba Rápida - Roles y Clientes

## ✅ CAMBIOS COMPLETADOS

### 1. **DashboardRoles** - Refactorizado ✨
- Avatares con colores por tipo de rol (Admin=🔴, Cliente=🔵, Técnico=🟢, Soporte=🟡)
- Contador de usuarios por rol
- Protección de roles críticos (admin, cliente, tecnico)
- Formulario simplificado (nombre + descripción)

### 2. **DashboardClientes** - Filtrado por Rol 🔍
- Muestra solo usuarios con `rol_id = 2` (cliente)
- Contador dinámico en header
- Campo rol bloqueado y fijo en "Cliente"
- Usa mismo CRUD que Usuarios

---

## 🧪 PASOS PARA PROBAR

### 🎯 **Paso 1: Refrescar Navegador**
```bash
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

---

### 📋 **Paso 2: Probar Roles**

#### A. Ver Lista de Roles
```
URL: http://localhost:5173/dashboard/roles
```

**Verificar:**
- ✅ Tabla con roles (admin, cliente, tecnico, soporte)
- ✅ Avatares con COLORES diferentes por tipo
- ✅ Columna "Usuarios" muestra contador (ej: "3 usuarios")
- ✅ Chips de tipo con colores (Admin=Rojo, Cliente=Azul, etc.)

**Ejemplo de lo que deberías ver:**

```
┌─────────────────────────────────────────────────┐
│ Rol              │ Descripción  │ Usuarios │ Tipo│
├─────────────────────────────────────────────────┤
│ 🔴 Admin         │ Administrador│   👥 3   │ 🔴 │
│ admin            │ del sistema  │ usuarios │admin│
│ ID: 1            │              │          │     │
├─────────────────────────────────────────────────┤
│ 🔵 Cliente       │ Usuario      │   👥 12  │ 🔵 │
│ cliente          │ cliente      │ usuarios │cliente│
│ ID: 2            │              │          │     │
└─────────────────────────────────────────────────┘
```

#### B. Crear Nuevo Rol
1. Click **"Nuevo Rol"**
2. Llenar:
   ```
   Nombre: supervisor
   Descripción: Supervisa operaciones diarias
   ```
3. Click **"Guardar"**
4. **Verificar:**
   - ✅ Notificación verde: "Rol creado exitosamente"
   - ✅ Aparece en la tabla

#### C. Intentar Eliminar Rol Crítico ⚠️
1. Click **🗑️** (Eliminar) en rol **"admin"**
2. **Verificar:**
   - ✅ Alert aparece: "⚠️ El rol 'admin' es crítico y no puede ser eliminado"
   - ✅ NO se elimina

#### D. Editar Rol No Crítico
1. Click **✏️** (Editar) en rol **"supervisor"**
2. Cambiar descripción
3. Guardar
4. **Verificar:** Cambio reflejado en tabla

---

### 👥 **Paso 3: Probar Clientes**

#### A. Ver Lista de Clientes
```
URL: http://localhost:5173/dashboard/clientes
```

**Verificar:**
- ✅ Header muestra: "Gestionar usuarios con rol de cliente **(X clientes)**"
- ✅ Tabla muestra SOLO usuarios con rol "cliente"
- ✅ Columna "Rol" tiene chip azul con "Cliente"
- ✅ NO aparecen admins ni técnicos

**Ejemplo:**
```
┌────────────────────────────────────────────────────┐
│ Cliente           │ Contacto          │ Rol  │Estado│
├────────────────────────────────────────────────────┤
│ 👤 JG             │ 📧 juan@email.com │🔵    │🟢   │
│ Juan García       │ 📱 3001234567     │Cliente│Activo│
│ ID: 17 • Cliente  │                   │      │      │
├────────────────────────────────────────────────────┤
│ 👤 MP             │ 📧 maria@mail.com │🔵    │🟢   │
│ María Pérez       │ 📱 3007654321     │Cliente│Activo│
│ ID: 18 • Cliente  │                   │      │      │
└────────────────────────────────────────────────────┘

Header: "Gestionar usuarios con rol de cliente (2 clientes)"
```

#### B. Crear Nuevo Cliente
1. Click **"Nuevo Cliente"**
2. Llenar formulario:
   ```
   Nombre: Carlos
   Apellido: Rodríguez
   Email: carlos@example.com
   Teléfono: 3009876543
   Rol: Cliente (BLOQUEADO - no se puede cambiar)
   Estado: Activo
   Contraseña: test123
   ```
3. **Verificar campo Rol:**
   - ✅ Desplegable bloqueado (disabled)
   - ✅ Solo opción: "Cliente"
   - ✅ Helper text: "Los clientes siempre tienen rol de Cliente"
4. Click **"Guardar"**
5. **Verificar:**
   - ✅ Notificación verde
   - ✅ Aparece en tabla de Clientes
   - ✅ Contador aumenta: "(3 clientes)"

#### C. Verificar Sincronización con Usuarios
1. Abrir otra pestaña: `http://localhost:5173/dashboard/usuarios`
2. Buscar el cliente recién creado (Carlos Rodríguez)
3. **Verificar:**
   - ✅ Aparece en tabla de Usuarios
   - ✅ Columna "Rol" muestra chip "cliente"
   - ✅ Mismo ID

#### D. Editar Cliente
1. En `/dashboard/clientes`, click **✏️** en un cliente
2. **Verificar:**
   - ✅ Campo "Contraseña" NO aparece
   - ✅ Todos los demás datos precargados
   - ✅ Campo "Rol" sigue bloqueado en "Cliente"
3. Cambiar email
4. Guardar
5. **Verificar:** Cambio reflejado en ambas tablas (Clientes y Usuarios)

#### E. Eliminar Cliente
1. Click **🗑️** en un cliente
2. Confirmar
3. **Verificar:**
   - ✅ Desaparece de tabla Clientes
   - ✅ Contador disminuye: "(2 clientes)"
   - ✅ También desaparece de tabla Usuarios

---

## 🔍 PRUEBAS DE VALIDACIÓN

### Roles

#### Prueba 1: Nombre Vacío
1. Crear nuevo rol
2. Dejar campo "Nombre" vacío
3. Intentar guardar
4. **Verificar:** Error "El nombre del rol es requerido"

#### Prueba 2: Nombre Muy Largo
1. Crear nuevo rol
2. Ingresar nombre con >50 caracteres
3. **Verificar:** Error "El nombre no puede exceder 50 caracteres"

#### Prueba 3: Eliminar Rol con Usuarios
1. Intentar eliminar rol "cliente" (tiene usuarios)
2. **Verificar:**
   - ✅ Confirmación: "⚠️ Este rol tiene X usuario(s) asignado(s)"
   - ✅ Si cancelas, NO se elimina

---

### Clientes

#### Prueba 1: Email Inválido
1. Crear cliente con email: "test@"
2. **Verificar:** Error "Email inválido"

#### Prueba 2: Contraseña Corta
1. Crear cliente con contraseña: "123"
2. **Verificar:** Error "Mínimo 6 caracteres"

#### Prueba 3: Rol Siempre Cliente
1. Crear cliente
2. **Verificar:** Campo "Rol" no se puede cambiar
3. Abrir consola del navegador (F12)
4. En formulario, inspeccionar valor de `rol_id`
5. **Verificar:** Siempre es `2`

---

## 📊 COMPARACIÓN VISUAL

### Dashboard Roles - Antes vs Ahora

#### ANTES:
```
Tabla simple
- Nombre del rol
- Descripción
- Estado (activo/inactivo)
- Campos: nombre_rol, descripcion_rol, activo
```

#### AHORA:
```
Tabla rica con colores
- Avatar CON COLOR por tipo
- Contador de usuarios
- Chip de tipo con color
- Protección de roles críticos
- Campos: nombre, descripcion
```

### Dashboard Clientes - Antes vs Ahora

#### ANTES:
```
Tabla Clientes independiente
- Traía datos de tabla Clientes
- Campos: nombres, apellidos, tipo_documento, etc.
```

#### AHORA:
```
Tabla Usuarios FILTRADA
- Traía todos usuarios, filtra rol_id = 2
- Contador dinámico en header
- Mismo CRUD que Usuarios
- Campos: nombre, apellido, email, telefono
```

---

## ✅ CHECKLIST FINAL

### Roles ✨
- [ ] Avatares con colores diferentes por tipo
- [ ] Contador de usuarios visible y correcto
- [ ] Crear nuevo rol funciona
- [ ] Editar rol funciona
- [ ] Protección de roles críticos (admin, cliente, tecnico)
- [ ] Advertencia al eliminar rol con usuarios
- [ ] Notificaciones aparecen (verde para éxito)

### Clientes 🔍
- [ ] Solo muestra usuarios con rol "cliente"
- [ ] Contador en header: "(X clientes)"
- [ ] Campo "Rol" bloqueado en "Cliente"
- [ ] Helper text visible: "Los clientes siempre tienen rol de Cliente"
- [ ] Crear cliente funciona
- [ ] Campo contraseña solo en creación (no en edición)
- [ ] Sincronización con tabla Usuarios
- [ ] Eliminar cliente funciona

---

## 🐛 SI ALGO NO FUNCIONA

### Problema: Roles no muestran colores
```bash
# Verificar en consola del navegador (F12):
# Buscar errores de getRoleColor o getRoleIcon
```

### Problema: Clientes muestra todos los usuarios
```bash
# Verificar filtro:
const clientesData = crudOperations.data?.filter(
  user => user.rol_nombre?.toLowerCase() === 'cliente' || user.rol_id === 2
) || [];

# Revisar que usuarios tengan campos:
# - rol_nombre = "cliente"
# - rol_id = 2
```

### Problema: No aparece contador de usuarios en Roles
```bash
# Verificar que backend devuelva campo:
# usuarios_con_rol

# Endpoint: GET /api/roles
# Debe incluir COUNT de usuarios
```

### Problema: Campo rol no está bloqueado en Clientes
```bash
# Verificar en formFields:
{
  name: 'rol_id',
  disabled: true,  // ← Debe estar true
  options: [{ value: 2, label: 'Cliente' }]
}
```

---

## 📞 REPORTAR RESULTADOS

Por favor reporta:

```
✅ ROLES:
- Colores de avatares: [✓ / ✗]
- Contador de usuarios: [✓ / ✗]
- Protección roles críticos: [✓ / ✗]
- Crear/Editar/Eliminar: [✓ / ✗]

✅ CLIENTES:
- Filtrado por rol: [✓ / ✗]
- Contador en header: [✓ / ✗]
- Campo rol bloqueado: [✓ / ✗]
- Sincronización con Usuarios: [✓ / ✗]

❌ ERRORES (si los hay):
- Captura de pantalla
- Mensaje de error de consola (F12)
- URL donde ocurre
```

---

**¡Todo listo para probar!** 🚀

Refrescar navegador → Probar Roles → Probar Clientes → Reportar resultados
