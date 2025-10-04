# 🔧 Fix: Logout Redirige a Home en lugar de Login

**Problema**: Después de hacer logout, el usuario es redirigido automáticamente al modal de Login en lugar de quedarse en el Home.

**Fecha**: 2 de octubre de 2025

---

## 🐛 Problema Detallado

### Comportamiento Actual (Incorrecto):
1. Usuario hace click en "Cerrar Sesión"
2. Sistema ejecuta `logout()` y navega a `/` (Home)
3. Usuario ve el Home por un segundo
4. **Inmediatamente** es redirigido a `/login`
5. ❌ Usuario termina en el modal de Login

### Comportamiento Esperado (Correcto):
1. Usuario hace click en "Cerrar Sesión"
2. Sistema ejecuta `logout()` y navega a `/` (Home)
3. ✅ Usuario se queda en el Home
4. ✅ Home muestra botones públicos ("Iniciar Sesión", "Registrarse")

---

## 🔍 Análisis de la Causa

### Flujo del Problema:

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuario autenticado hace click en "Cerrar Sesión"   │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Dashboard.jsx / ClienteLayout.jsx                    │
│    handleLogout() {                                     │
│      logout();         // Limpia estado                 │
│      navigate('/');    // Va al Home                    │
│    }                                                     │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. AuthContext.logout()                                 │
│    setUser(null);                                       │
│    setToken('');                                        │
│    localStorage.removeItem('token');                    │
│    localStorage.removeItem('user');                     │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. navigate('/') → Home se carga                        │
│    ✅ Home muestra correctamente (público)              │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. ❌ PROBLEMA: Login.jsx tiene useEffect()             │
│    useEffect(() => {                                    │
│      if (isAuthenticated && user) {                     │
│        navigate('/dashboard' o '/cliente');            │
│      }                                                   │
│    }, [isAuthenticated, user]);                         │
│                                                          │
│    Este efecto se ejecuta SIEMPRE que cambia            │
│    isAuthenticated o user, incluyendo después del       │
│    logout cuando el estado está limpiándose             │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Problema de Sincronización                           │
│    - logout() limpia el estado                          │
│    - Pero hay un momento donde isAuthenticated aún es   │
│      true mientras React actualiza                      │
│    - useEffect detecta cambio y redirecciona            │
│    - ❌ Usuario termina en /login                       │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Solución Implementada

### Cambio 1: AuthContext.jsx - Logout Más Robusto

**Archivo**: `/front_pl/src/context/AuthContext.jsx`

```javascript
// ❌ ANTES:
const logout = () => {
  setUser(null);
  setToken('');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setLoading(false);
};

// ✅ AHORA:
const logout = () => {
  // Limpiar todo el estado de forma explícita
  setUser(null);
  setToken('');
  
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Asegurar que loading es false
  setLoading(false);
  
  // Llamar al servicio de logout en el backend (opcional)
  try {
    authService.logout();
  } catch (error) {
    console.warn('Error al notificar logout al servidor:', error);
  }
};
```

**Mejoras**:
- ✅ Orden explícito de limpieza
- ✅ Llama al backend para invalidar sesión
- ✅ Maneja errores del backend sin fallar

---

### Cambio 2: Login.jsx - Redirección Solo Después de Login Exitoso

**Archivo**: `/front_pl/src/pages/Login.jsx`

#### Problema:
El `useEffect` se ejecutaba cada vez que cambiaba `isAuthenticated` o `user`, **incluso después del logout**.

#### Solución:
Agregar flag `justLoggedIn` que solo se activa después de un login exitoso.

```javascript
// ✅ NUEVO: Estado para controlar redirección
const [justLoggedIn, setJustLoggedIn] = useState(false);

// ❌ ANTES: Se ejecutaba siempre que cambiaba isAuthenticated
useEffect(() => {
  if (isAuthenticated && user) {
    navigate('/dashboard' o '/cliente');
  }
}, [isAuthenticated, user]);

// ✅ AHORA: Solo se ejecuta después de login exitoso
useEffect(() => {
  if (isAuthenticated && user && justLoggedIn) {
    // Redireccionar...
    setJustLoggedIn(false); // Reset flag
  }
}, [isAuthenticated, user, justLoggedIn]);

// En handleSubmit:
const result = await login(formData.email, formData.password);

if (result.success) {
  setJustLoggedIn(true);  // ✅ Activar flag
} else {
  setError(result.message);
}
```

**Cómo Funciona**:
1. Usuario hace login → `handleSubmit()` llama a `login()`
2. Si es exitoso → `setJustLoggedIn(true)`
3. `useEffect` detecta `justLoggedIn === true` → Redirecciona
4. Resetea flag → `setJustLoggedIn(false)`

**Por qué funciona**:
- ✅ Solo redirecciona después de login exitoso
- ✅ No redirecciona cuando el usuario está navegando normalmente
- ✅ No redirecciona después del logout

---

### Cambio 3: Preservar Categoría Pre-seleccionada

**Bonus**: También mejoré la lógica para preservar la categoría cuando el usuario viene del Home:

```javascript
useEffect(() => {
  if (isAuthenticated && user && justLoggedIn) {
    const from = location.state?.from?.pathname;
    const categoriaPreseleccionada = location.state?.categoriaPreseleccionada;
    
    if (from && categoriaPreseleccionada) {
      // ✅ Si viene con categoría, ir directo a reservar
      navigate(from, { 
        state: { categoriaPreseleccionada },
        replace: true 
      });
    } else if (from) {
      navigate(from, { replace: true });
    } else {
      // Redireccionar según rol
      switch (user.rol?.nombre) {
        case ROLES.ADMIN:
          navigate('/dashboard', { replace: true });
          break;
        case ROLES.CLIENTE:
          navigate('/cliente', { replace: true });
          break;
        default:
          navigate('/cliente', { replace: true });
      }
    }
    setJustLoggedIn(false);
  }
}, [isAuthenticated, user, justLoggedIn, navigate, location]);
```

---

## 🎯 Flujo Corregido

### Escenario 1: Usuario Hace Logout

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuario autenticado en Dashboard/Cliente             │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Click "Cerrar Sesión"                                │
│    handleLogout() → logout() → navigate('/')            │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. AuthContext limpia todo                              │
│    ✅ user = null                                        │
│    ✅ token = ''                                         │
│    ✅ localStorage limpio                                │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. navigate('/') → Carga Home                           │
│    ✅ isAuthenticated = false                            │
│    ✅ Home muestra botones públicos                      │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Usuario ve Home público                              │
│    ✅ NO hay redirección automática                      │
│    ✅ Puede navegar libremente                           │
│    ✅ Puede hacer click "Iniciar Sesión" si quiere       │
└─────────────────────────────────────────────────────────┘
```

### Escenario 2: Usuario Hace Login Desde Home

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuario en Home público                              │
│    Click "Iniciar Sesión"                               │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Carga /login                                          │
│    justLoggedIn = false                                 │
│    ✅ NO hay redirección automática                      │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Usuario ingresa credenciales                         │
│    handleSubmit() → login()                             │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Login exitoso                                        │
│    setJustLoggedIn(true)                                │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. useEffect detecta justLoggedIn = true                │
│    ✅ Redirecciona según rol                             │
│    - Admin → /dashboard                                 │
│    - Cliente → /cliente                                 │
└─────────────────────────────────────────────────────────┘
```

### Escenario 3: Usuario Ya Autenticado Va a /login

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuario ya autenticado navega a /login               │
│    (ej: escribe URL manualmente)                        │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Login.jsx carga                                       │
│    isAuthenticated = true                               │
│    user = { ... }                                       │
│    justLoggedIn = false  ← CLAVE                        │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. useEffect verifica condiciones                       │
│    if (isAuthenticated && user && justLoggedIn)         │
│    ❌ justLoggedIn = false                               │
│    ✅ NO redirecciona automáticamente                    │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Usuario ve formulario de login                       │
│    Puede:                                               │
│    - Cerrar sesión manualmente                          │
│    - Navegar de vuelta con botón atrás                  │
│    - NO es forzado a ir al dashboard                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Comparación Antes vs Después

| Escenario | Antes (❌) | Después (✅) |
|-----------|-----------|-------------|
| **Logout desde Dashboard** | Redirecciona a `/login` | Se queda en `/` (Home) |
| **Logout desde Cliente** | Redirecciona a `/login` | Se queda en `/` (Home) |
| **Login exitoso** | Redirecciona correctamente | Redirecciona correctamente |
| **Usuario autenticado va a `/login`** | Redirecciona automáticamente | Muestra formulario (no fuerza redirect) |
| **Después de logout, ir a `/login`** | Loop de redirección | Funciona normal |

---

## 🧪 Testing

### Test 1: Logout desde Admin Dashboard
```
1. Login como admin
2. Ir a /dashboard
3. Click "Cerrar Sesión"
4. ✅ Debe ir a /
5. ✅ Home muestra botones públicos
6. ✅ NO debe redirigir a /login
```

### Test 2: Logout desde Cliente
```
1. Login como cliente
2. Ir a /cliente
3. Click "Cerrar Sesión"
4. ✅ Debe ir a /
5. ✅ Home muestra botones públicos
6. ✅ NO debe redirigir a /login
```

### Test 3: Login Normal
```
1. Ir a Home (no autenticado)
2. Click "Iniciar Sesión"
3. Ingresar credenciales
4. ✅ Debe redirigir a /dashboard o /cliente según rol
5. ✅ NO debe quedarse en /login
```

### Test 4: Navegar a /login Estando Autenticado
```
1. Ya autenticado como cliente
2. Escribir manualmente /login en URL
3. ✅ Debe mostrar formulario de login
4. ✅ NO debe redirigir automáticamente
5. ✅ Usuario puede cerrar sesión desde ahí si quiere
```

### Test 5: Pre-selección de Servicio
```
1. Ir a Home (no autenticado)
2. Click en servicio "Vehículos"
3. Sistema redirecciona a /login
4. Ingresar credenciales
5. ✅ Debe ir a /cliente/reservar
6. ✅ "Vehículos" debe estar pre-seleccionado
```

---

## 📝 Archivos Modificados

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `AuthContext.jsx` | 78-92 | Mejorado logout con llamada al backend |
| `Login.jsx` | 24 | Agregado estado `justLoggedIn` |
| `Login.jsx` | 48-78 | Modificado useEffect para solo redirigir después de login exitoso |
| `Login.jsx` | 95-104 | Modificado handleSubmit para activar flag |

---

## 🎯 Resumen de Solución

### Problema Raíz:
El `useEffect` en `Login.jsx` se ejecutaba cada vez que cambiaba el estado de autenticación, **incluso después del logout**, causando redirecciones no deseadas.

### Solución:
Agregar flag `justLoggedIn` que solo se activa después de un login exitoso, evitando redirecciones automáticas en otros momentos.

### Beneficios:
1. ✅ Logout funciona correctamente
2. ✅ Usuario se queda en Home después de cerrar sesión
3. ✅ No hay loops de redirección
4. ✅ Login sigue funcionando correctamente
5. ✅ Pre-selección de servicios preservada
6. ✅ Mejor UX general

---

## 🔮 Mejoras Futuras (Opcionales)

### 1. Confirmación de Logout
```javascript
const handleLogout = () => {
  if (window.confirm('¿Estás seguro de cerrar sesión?')) {
    logout();
    navigate('/');
  }
};
```

### 2. Mensaje de Logout Exitoso
```javascript
// En Home.jsx
const [logoutMessage, setLogoutMessage] = useState('');

useEffect(() => {
  if (location.state?.logoutSuccess) {
    setLogoutMessage('Sesión cerrada exitosamente');
    // Limpiar después de 3 segundos
    setTimeout(() => setLogoutMessage(''), 3000);
  }
}, [location.state]);

// En handleLogout:
navigate('/', { state: { logoutSuccess: true } });
```

### 3. Recordar Última Página
```javascript
// Antes de logout, guardar página actual
const handleLogout = () => {
  const currentPath = location.pathname;
  sessionStorage.setItem('lastPath', currentPath);
  logout();
  navigate('/');
};

// En próximo login, volver a la última página
if (sessionStorage.getItem('lastPath')) {
  const lastPath = sessionStorage.getItem('lastPath');
  sessionStorage.removeItem('lastPath');
  navigate(lastPath);
}
```

---

**Estado**: ✅ **RESUELTO**  
**Última actualización**: 2 de octubre de 2025
