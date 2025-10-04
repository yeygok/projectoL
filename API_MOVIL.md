# 📱 API para App Móvil - MEGA LAVADO

> Documentación de endpoints para integración con aplicaciones móviles

---

## 🔐 Autenticación

### 1. Registro de Usuario

#### **Endpoint**
```
POST http://localhost:3000/api/auth/register
```

#### **Headers**
```
Content-Type: application/json
```

#### **Body (JSON)**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "3001234567",
  "password": "123456"
}
```

#### **Validaciones**
- `nombre`: String, requerido
- `apellido`: String, requerido
- `email`: String, único, formato email válido, requerido
- `telefono`: String, requerido (mínimo 10 dígitos)
- `password`: String, requerido (mínimo 6 caracteres)

#### **Response Exitoso (201 Created)**
```json
{
  "mensaje": "Usuario creado exitosamente",
  "id": 17
}
```

#### **Response Error (400 Bad Request)**
```json
{
  "error": "El email ya está registrado"
}
```

#### **Response Error (409 Conflict)**
```json
{
  "error": "El email ya existe"
}
```

#### **Response Error (500 Internal Server Error)**
```json
{
  "error": "Error al crear usuario"
}
```

---

### 2. Login de Usuario

#### **Endpoint**
```
POST http://localhost:3000/api/auth/login
```

#### **Headers**
```
Content-Type: application/json
```

#### **Body (JSON)**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

#### **Response Exitoso (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 17,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "3001234567",
    "rol_id": 2,
    "rol_nombre": "cliente",
    "permisos": []
  }
}
```

#### **Response Error (401 Unauthorized)**
```json
{
  "error": "Credenciales inválidas"
}
```

#### **Response Error (403 Forbidden)**
```json
{
  "error": "Usuario inactivo"
}
```

---

### 3. Verificar Token

#### **Endpoint**
```
GET http://localhost:3000/api/auth/verify
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Response Exitoso (200 OK)**
```json
{
  "valid": true,
  "user": {
    "id": 17,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "rol_id": 2,
    "rol_nombre": "cliente"
  }
}
```

#### **Response Error (401 Unauthorized)**
```json
{
  "error": "Token inválido o expirado"
}
```

---

### 4. Logout

#### **Endpoint**
```
POST http://localhost:3000/api/auth/logout
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Response Exitoso (200 OK)**
```json
{
  "mensaje": "Sesión cerrada exitosamente"
}
```

---

## 📅 Reservas (Agendamiento)

### 5. Obtener Reservas del Cliente

#### **Endpoint**
```
GET http://localhost:3000/api/agendamiento/cliente/:clienteId
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Parámetros URL**
- `clienteId`: ID del cliente (número)

#### **Response Exitoso (200 OK)**
```json
[
  {
    "id": 789,
    "fecha_servicio": "2025-10-05T14:00:00.000Z",
    "fecha_reserva": "2025-10-01T10:30:00.000Z",
    "precio_total": 150000,
    "tipo_servicio": "Premium",
    "estado": "pendiente",
    "estado_color": "#FFA726",
    "direccion": "Calle 123 #45-67",
    "barrio": "Chapinero",
    "localidad": "Bogotá",
    "zona": "norte",
    "observaciones": "Favor llegar temprano",
    "vehiculo_modelo": "Toyota Corolla 2020",
    "vehiculo_placa": "ABC123",
    "tecnico_nombre": null,
    "tecnico_apellido": null
  },
  {
    "id": 790,
    "fecha_servicio": "2025-10-10T09:00:00.000Z",
    "precio_total": 100000,
    "tipo_servicio": "Sencillo",
    "estado": "confirmada",
    "estado_color": "#66BB6A",
    "direccion": "Carrera 7 #80-45",
    "barrio": "Usaquén",
    "observaciones": null
  }
]
```

#### **Response Error (404 Not Found)**
```json
{
  "error": "No se encontraron reservas para este cliente"
}
```

---

### 6. Crear Nueva Reserva

#### **Endpoint**
```
POST http://localhost:3000/api/agendamiento
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### **Body (JSON)**

**Ejemplo Básico (sin vehículo):**
```json
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
  "observaciones": "Favor llegar temprano"
}
```

**Ejemplo con Vehículo:**
```json
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
```

#### **Campos Requeridos**
- `servicio_tipo_id`: ID del tipo de servicio (1=Sencillo, 2=Premium, 3=Gold)
- `fecha_servicio`: Fecha y hora del servicio (ISO 8601)
- `precio_total`: Precio calculado (número)
- `ubicacion.direccion`: Dirección completa
- `ubicacion.barrio`: Barrio
- `ubicacion.localidad`: Ciudad
- `ubicacion.zona`: Zona (norte/sur/oriente/occidente/centro)

#### **Campos Opcionales**
- `vehiculo.modelo`: Modelo del vehículo (si aplica)
- `vehiculo.placa`: Placa del vehículo (si aplica)
- `observaciones`: Notas adicionales

#### **Response Exitoso (201 Created)**
```json
{
  "id": 789,
  "mensaje": "Reserva creada exitosamente",
  "cliente": "Juan Pérez",
  "fecha_servicio": "2025-10-05T14:00:00.000Z",
  "precio_total": 150000
}
```

#### **Response Error (400 Bad Request)**
```json
{
  "error": "Campos requeridos faltantes"
}
```

#### **Notas Importantes**
- El `cliente_id` se obtiene automáticamente del token JWT
- El `estado_id` se asigna automáticamente como 1 (pendiente)
- Si NO se proporciona `ubicacion_id`, el sistema crea automáticamente la ubicación
- Si NO se proporciona `vehiculo_id`, el sistema crea o busca el vehículo por placa
- El `tecnico_id` se asigna después por el administrador

---

### 7. Obtener Detalle de una Reserva

#### **Endpoint**
```
GET http://localhost:3000/api/agendamiento/:id
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Parámetros URL**
- `id`: ID de la reserva

#### **Response Exitoso (200 OK)**
```json
{
  "id": 789,
  "cliente_id": 17,
  "cliente_nombre": "Juan Pérez",
  "cliente_email": "juan@example.com",
  "cliente_telefono": "3001234567",
  "tecnico_id": 5,
  "tecnico_nombre": "Carlos López",
  "tecnico_telefono": "3009876543",
  "servicio_tipo_id": 2,
  "tipo_servicio": "Premium",
  "multiplicador_precio": 1.5,
  "fecha_servicio": "2025-10-05T14:00:00.000Z",
  "fecha_reserva": "2025-10-01T10:30:00.000Z",
  "precio_total": 150000,
  "estado_id": 2,
  "estado": "confirmada",
  "estado_color": "#66BB6A",
  "direccion": "Calle 123 #45-67",
  "barrio": "Chapinero",
  "localidad": "Bogotá",
  "zona": "norte",
  "vehiculo_id": 12,
  "vehiculo_modelo": "Toyota Corolla 2020",
  "vehiculo_placa": "ABC123",
  "observaciones": "Favor llegar temprano",
  "notas_tecnico": null,
  "created_at": "2025-10-01T10:30:00.000Z",
  "updated_at": "2025-10-02T15:20:00.000Z"
}
```

---

## 👤 Perfil de Usuario

### 8. Obtener Perfil del Usuario Autenticado

#### **Endpoint**
```
GET http://localhost:3000/api/perfil/me
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Response Exitoso (200 OK)**
```json
{
  "id": 17,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "3001234567",
  "rol_id": 2,
  "rol_nombre": "cliente",
  "activo": 1,
  "fecha_ultimo_acceso": "2025-10-03T08:30:00.000Z",
  "created_at": "2025-09-15T12:00:00.000Z",
  "updated_at": "2025-10-03T08:30:00.000Z"
}
```

---

### 9. Actualizar Perfil

#### **Endpoint**
```
PUT http://localhost:3000/api/perfil/me
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### **Body (JSON)**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "telefono": "3001234567"
}
```

#### **Campos Actualizables**
- `nombre`
- `apellido`
- `telefono`

**Nota:** El `email` NO se puede cambiar desde este endpoint

#### **Response Exitoso (200 OK)**
```json
{
  "mensaje": "Perfil actualizado exitosamente",
  "user": {
    "id": 17,
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "email": "juan@example.com",
    "telefono": "3001234567"
  }
}
```

---

### 10. Cambiar Contraseña

#### **Endpoint**
```
PUT http://localhost:3000/api/perfil/me/password
```

#### **Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### **Body (JSON)**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```

#### **Response Exitoso (200 OK)**
```json
{
  "mensaje": "Contraseña actualizada exitosamente"
}
```

#### **Response Error (401 Unauthorized)**
```json
{
  "error": "Contraseña actual incorrecta"
}
```

---

## 📦 Datos Auxiliares

### 11. Obtener Categorías de Servicio

#### **Endpoint**
```
GET http://localhost:3000/api/categorias
```

#### **Headers**
```
Content-Type: application/json
```

**Nota:** Este endpoint es público (no requiere autenticación)

#### **Response Exitoso (200 OK)**
```json
[
  {
    "id": 1,
    "nombre": "Colchones",
    "descripcion": "Limpieza profunda de colchones",
    "icono": "🛏️",
    "activa": 1,
    "orden": 1
  },
  {
    "id": 4,
    "nombre": "Automóviles",
    "descripcion": "Lavado de vehículos",
    "icono": "🚗",
    "activa": 1,
    "orden": 4
  },
  {
    "id": 5,
    "nombre": "Tapetes",
    "descripcion": "Limpieza de tapetes",
    "icono": "📐",
    "activa": 1,
    "orden": 5
  }
]
```

---

### 12. Obtener Tipos de Servicio

#### **Endpoint**
```
GET http://localhost:3000/api/tipos-servicio
```

#### **Headers**
```
Content-Type: application/json
```

**Nota:** Este endpoint es público (no requiere autenticación)

#### **Response Exitoso (200 OK)**
```json
[
  {
    "id": 1,
    "nombre": "Sencillo",
    "descripcion": "Servicio básico",
    "multiplicador_precio": 1.0,
    "color": "#90CAF9"
  },
  {
    "id": 2,
    "nombre": "Premium",
    "descripcion": "Servicio completo",
    "multiplicador_precio": 1.5,
    "color": "#FFA726"
  },
  {
    "id": 3,
    "nombre": "Gold",
    "descripcion": "Servicio premium",
    "multiplicador_precio": 2.0,
    "color": "#FFD700"
  }
]
```

---

### 13. Obtener Estados de Reserva

#### **Endpoint**
```
GET http://localhost:3000/api/estados-reserva
```

#### **Headers**
```
Content-Type: application/json
```

**Nota:** Este endpoint es público (no requiere autenticación)

#### **Response Exitoso (200 OK)**
```json
[
  {
    "id": 1,
    "estado": "pendiente",
    "descripcion": "Reserva pendiente de confirmación",
    "color": "#FFA726"
  },
  {
    "id": 2,
    "estado": "confirmada",
    "descripcion": "Reserva confirmada",
    "color": "#66BB6A"
  },
  {
    "id": 3,
    "estado": "en_proceso",
    "descripcion": "Servicio en proceso",
    "color": "#42A5F5"
  },
  {
    "id": 4,
    "estado": "completada",
    "descripcion": "Servicio completado",
    "color": "#26A69A"
  },
  {
    "id": 5,
    "estado": "cancelada",
    "descripcion": "Reserva cancelada",
    "color": "#EF5350"
  }
]
```

---

## 🔧 Ejemplos de Implementación

### React Native con Axios

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

// Configurar axios con interceptor para token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicio de Autenticación
export const authService = {
  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrar',
      };
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, data: { token, user } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión',
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      // Aún si falla, eliminar datos locales
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false };
    }
  },
};

// Servicio de Reservas
export const reservaService = {
  // Obtener reservas del cliente
  getReservasByCliente: async (clienteId) => {
    try {
      const response = await api.get(`/agendamiento/cliente/${clienteId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener reservas',
      };
    }
  },

  // Crear nueva reserva
  createReserva: async (reservaData) => {
    try {
      const response = await api.post('/agendamiento', reservaData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear reserva',
      };
    }
  },

  // Obtener detalle de reserva
  getReservaById: async (id) => {
    try {
      const response = await api.get(`/agendamiento/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener detalle',
      };
    }
  },
};

// Servicio de Perfil
export const perfilService = {
  // Obtener perfil
  getProfile: async () => {
    try {
      const response = await api.get('/perfil/me');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener perfil',
      };
    }
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/perfil/me', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar perfil',
      };
    }
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/perfil/me/password', {
        currentPassword,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cambiar contraseña',
      };
    }
  },
};

// Servicio de Datos Auxiliares
export const dataService = {
  // Obtener categorías
  getCategorias: async () => {
    try {
      const response = await api.get('/categorias');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Error al obtener categorías' };
    }
  },

  // Obtener tipos de servicio
  getTiposServicio: async () => {
    try {
      const response = await api.get('/tipos-servicio');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Error al obtener tipos' };
    }
  },

  // Obtener estados de reserva
  getEstadosReserva: async () => {
    try {
      const response = await api.get('/estados-reserva');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Error al obtener estados' };
    }
  },
};
```

---

## 🌐 URLs según Entorno

### Desarrollo Local
```
http://localhost:3000/api
```

### Android Emulador
```
http://10.0.2.2:3000/api
```

### iOS Simulator
```
http://localhost:3000/api
```

### Producción
```
https://api.megalavado.com/api
```

---

## 📝 Notas Importantes

### Token JWT
- **Duración:** 8 horas
- **Almacenamiento:** AsyncStorage / SecureStore
- **Header:** `Authorization: Bearer <token>`

### Códigos de Estado HTTP
- **200 OK:** Operación exitosa
- **201 Created:** Recurso creado
- **400 Bad Request:** Datos inválidos
- **401 Unauthorized:** Token inválido o faltante
- **403 Forbidden:** Sin permisos
- **404 Not Found:** Recurso no encontrado
- **409 Conflict:** Conflicto (ej: email duplicado)
- **500 Internal Server Error:** Error del servidor

### Cálculo de Precio
```javascript
const PRECIO_BASE = 100000; // COP

const calcularPrecio = (multiplicador) => {
  return PRECIO_BASE * multiplicador;
};

// Ejemplos:
// Sencillo (1.0): $100,000
// Premium (1.5): $150,000
// Gold (2.0):    $200,000
```

### Formato de Fechas
Usar formato ISO 8601:
```
2025-10-05T14:00:00.000Z
```

### Zonas Disponibles
- `norte`
- `sur`
- `oriente`
- `occidente`
- `centro`

---

## 🚀 Flujo Completo de Usuario

1. **Registro** → `POST /auth/register`
2. **Login** → `POST /auth/login` (recibe token)
3. **Obtener Categorías** → `GET /categorias`
4. **Obtener Tipos** → `GET /tipos-servicio`
5. **Crear Reserva** → `POST /agendamiento`
6. **Ver Mis Reservas** → `GET /agendamiento/cliente/:id`
7. **Ver Detalle** → `GET /agendamiento/:id`
8. **Ver Perfil** → `GET /perfil/me`
9. **Actualizar Perfil** → `PUT /perfil/me`
10. **Logout** → `POST /auth/logout`

---

**Documentación actualizada:** Octubre 2025  
**Versión API:** 1.0  
**Contacto:** info@megalavado.com
