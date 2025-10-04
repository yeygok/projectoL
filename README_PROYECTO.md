# 📋 SISTEMA DE RESERVAS - LAVADO VAPOR BOGOTÁ
**Documentación Consolidada**  
**Última actualización:** 3 de octubre de 2025

---

## 🎯 DESCRIPCIÓN DEL PROYECTO

Sistema web completo para gestión de servicios de limpieza con vapor, con dos interfaces principales:
- **Dashboard Administrativo:** Gestión completa del negocio
- **Portal de Cliente:** Reservas, perfil y seguimiento de servicios

---

## 🚀 INICIO RÁPIDO

### Requisitos
- Node.js 14+
- MySQL 8.0+
- npm o yarn

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/yeygok/projectoL.git
cd projectoL

# 2. Backend
cd backend
npm install
cp .env.example .env  # Configurar credenciales
npm start

# 3. Frontend (nueva terminal)
cd front_pl
npm install
npm run dev
```

### Acceso
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Credenciales Admin:** yeygok777@gmail.com / 121212

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### Base de Datos
- **Tablas totales:** 19
- **Con CRUD completo:** 11/19 (58%)
- **Base de datos:** LavadoVaporBogotaDB

### Backend (Node.js + Express)
- ✅ API REST funcional
- ✅ Autenticación JWT
- ✅ 23+ endpoints operativos
- ✅ Sistema de emails con Nodemailer
- ✅ Validaciones y middleware de seguridad

### Frontend (React + Vite + Material-UI)
- ✅ Dashboard Admin (11 páginas)
- ✅ Dashboard Cliente (4 páginas)
- ✅ Sistema de reservas paso a paso
- ✅ Landing page pública
- ✅ Responsive design

### Funcionalidades Principales
- ✅ Login/Registro con roles (Admin/Cliente)
- ✅ Sistema de reservas completo
- ✅ Gestión de servicios y categorías
- ✅ Asignación de técnicos
- ✅ Notificaciones por email automáticas
- ✅ Gestión de ubicaciones y vehículos
- ✅ Estados de reservas con seguimiento

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tablas Principales

| Tabla | Descripción | Estado CRUD |
|-------|-------------|-------------|
| Usuarios | Clientes, técnicos y admins | ✅ Completo |
| Roles | Admin, cliente, técnico | ✅ Completo |
| Permisos | Control de acceso | ✅ Completo |
| Reservas | Agendamientos de servicios | ✅ Completo |
| Servicios | Catálogo de servicios | ✅ Completo |
| CategoriasServicios | Categorización (Colchones, Vehículos, etc) | ✅ Completo |
| TiposServicio | Sencillo, Premium, Gold | ✅ Completo |
| EstadosReserva | Pendiente, confirmada, completada, etc | ✅ Completo |
| Ubicaciones | Direcciones de servicio | ✅ Completo |
| Vehiculos | Datos de vehículos a limpiar | ✅ Completo |
| RolesPermisos | Relación roles-permisos | ✅ Completo |

### Tablas Pendientes
- Calificaciones (sistema de reseñas)
- Notificaciones (alertas en app)
- HistorialServicios (auditoría)
- Soporte (tickets)

---

## 🔌 API ENDPOINTS

### Autenticación
```
POST   /api/auth/register          - Registro de usuarios
POST   /api/auth/login             - Login
GET    /api/auth/verify            - Verificar token
```

### Reservas/Agendamiento
```
GET    /api/agendamiento           - Listar todas
GET    /api/agendamiento/:id       - Ver una reserva
POST   /api/agendamiento           - Crear reserva
PUT    /api/agendamiento/:id       - Actualizar
DELETE /api/agendamiento/:id       - Eliminar
PUT    /api/agendamiento/:id/estado - Cambiar estado
GET    /api/agendamiento/cliente/:id - Reservas de un cliente
```

### Servicios
```
GET    /api/services               - Listar servicios
GET    /api/services/:id           - Ver servicio
POST   /api/services               - Crear (admin)
PUT    /api/services/:id           - Actualizar (admin)
DELETE /api/services/:id           - Eliminar (admin)
```

### Categorías
```
GET    /api/categorias             - Listar categorías
GET    /api/categorias/:id         - Ver categoría
POST   /api/categorias             - Crear (admin)
PUT    /api/categorias/:id         - Actualizar (admin)
DELETE /api/categorias/:id         - Soft delete (admin)
```

### Tipos de Servicio
```
GET    /api/tipos-servicio         - Listar tipos
POST   /api/tipos-servicio         - Crear (admin)
PUT    /api/tipos-servicio/:id     - Actualizar (admin)
DELETE /api/tipos-servicio/:id     - Eliminar (admin)
```

### Dashboard Admin
```
GET    /api/dashboard/usuarios     - Gestión usuarios
GET    /api/dashboard/clientes     - Solo clientes
GET    /api/dashboard/estadisticas - Métricas del negocio
```

### Perfil
```
GET    /api/perfil                 - Ver perfil del usuario logueado
PUT    /api/perfil                 - Actualizar perfil
```

---

## 📧 SISTEMA DE EMAILS

### Configuración
```env
EMAIL_USER=sierranicol805@gmail.com
EMAIL_PASS=tgbnrzwexhqokimk  # Contraseña de aplicación Gmail
EMAIL_FROM_NAME=Mega Malvado - Lavado Vapor Bogotá
```

### Emails Automáticos
1. **Confirmación de Reserva** → Al crear reserva
2. **Notificación a Técnico** → Al asignar técnico
3. **Cambio de Estado** → Al actualizar estado
4. **Recordatorio** → 1 día antes (implementable con cron)

### Probar Emails
```bash
cd backend
node scripts/testEmail.js
```

---

## 🎨 ESTRUCTURA FRONTEND

### Rutas Públicas
- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro

### Rutas de Cliente
- `/cliente` - Dashboard principal
- `/cliente/perfil` - Editar perfil
- `/cliente/reservar` - Nueva reserva (5 pasos)
- `/cliente/reservas` - Historial de reservas

### Rutas de Admin
- `/dashboard` - Dashboard principal con métricas
- `/dashboard/usuarios` - Gestión de usuarios
- `/dashboard/clientes` - Gestión de clientes
- `/dashboard/servicios` - CRUD servicios
- `/dashboard/categorias` - CRUD categorías
- `/dashboard/tipos-servicio` - CRUD tipos
- `/dashboard/estados` - CRUD estados de reserva
- `/dashboard/agendamientos` - Ver todas las reservas
- `/dashboard/roles` - Gestión de roles
- `/dashboard/permisos` - Gestión de permisos

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Roles
1. **Admin** (rol_id: 1)
   - Acceso completo al sistema
   - CRUD de todas las entidades
   - Asignación de técnicos
   - Ver métricas y reportes

2. **Cliente** (rol_id: 2)
   - Crear reservas
   - Ver sus propias reservas
   - Editar su perfil
   - Calificar servicios

3. **Técnico** (rol_id: 3)
   - Ver reservas asignadas
   - Actualizar estado de servicios

### JWT
- Token válido por 1 hora
- Renovación automática en frontend
- Middleware de autenticación en todas las rutas protegidas

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de datos:** MySQL 8.0
- **ORM/Query:** mysql2 (con prepared statements)
- **Autenticación:** jsonwebtoken + bcryptjs
- **Emails:** Nodemailer (Gmail)
- **Validación:** express-validator
- **Middleware:** CORS, body-parser

### Frontend
- **Framework:** React 19.1
- **Build Tool:** Vite 7.0
- **UI Library:** Material-UI v7
- **Routing:** React Router DOM v7
- **HTTP Client:** Fetch API
- **State:** React Hooks + Context
- **Date Handling:** date-fns
- **Icons:** Material Icons

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
project L/
├── backend/
│   ├── config/
│   │   ├── db.js              # Conexión MySQL
│   │   └── mailer.js          # Configuración Nodemailer
│   ├── controllers/           # Lógica de negocio
│   │   ├── authController.js
│   │   ├── agendamientoController.js
│   │   ├── serviceController.js
│   │   ├── categoriaController.js
│   │   └── ...
│   ├── middlewares/
│   │   └── authMiddleware.js  # JWT + RBAC
│   ├── routes/                # Definición de rutas
│   │   ├── auth.js
│   │   ├── agendamiento.js
│   │   ├── service.js
│   │   └── ...
│   ├── services/
│   │   └── emailService.js    # Plantillas de emails
│   ├── scripts/
│   │   └── testEmail.js       # Testing de emails
│   ├── .env                   # Variables de entorno
│   ├── index.js               # Punto de entrada
│   └── package.json
│
├── front_pl/
│   ├── src/
│   │   ├── assets/            # Imágenes, logos
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas principales
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ClienteDashboard.jsx
│   │   │   ├── Booking.jsx
│   │   │   └── ...
│   │   ├── services/          # API calls
│   │   │   ├── authService.js
│   │   │   ├── reservaService.js
│   │   │   └── ...
│   │   ├── App.jsx            # Rutas principales
│   │   ├── main.jsx           # Punto de entrada
│   │   └── index.css          # Estilos globales
│   ├── public/                # Archivos estáticos
│   ├── vite.config.js
│   └── package.json
│
└── README_PROYECTO.md         # Este archivo
```

---

## 🧪 TESTING

### Backend
```bash
# Probar conexión DB
cd backend
npm start
# Ver: "Conectado a la base de datos MySQL"

# Probar emails
node scripts/testEmail.js

# Probar endpoint específico (Postman/Thunder Client)
GET http://localhost:3000/api/test-users
```

### Frontend
```bash
cd front_pl
npm run dev
# Abrir: http://localhost:5173
```

### Testing Manual
1. Login como admin: yeygok777@gmail.com / 121212
2. Crear una reserva desde cliente
3. Verificar email de confirmación
4. Asignar técnico desde admin
5. Verificar email a técnico
6. Cambiar estado de reserva
7. Verificar email de actualización

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Backend no inicia
```bash
# Verificar MySQL corriendo
mysql -u root -p

# Verificar puerto 3000 disponible
lsof -i :3000

# Ver logs de error
tail -f backend/logs/error.log
```

### Frontend con errores
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar backend corriendo
curl http://localhost:3000/api/test-users
```

### Emails no llegan
```bash
# Probar script de test
node scripts/testEmail.js

# Verificar .env
cat backend/.env | grep EMAIL

# Verificar carpeta SPAM en Gmail
```

### Error de CORS
```bash
# Verificar configuración en backend/index.js
# Debe tener: app.use(cors())
```

---

## 🚀 DESPLIEGUE A PRODUCCIÓN

### Backend (Render/Railway/Heroku)
```bash
# 1. Configurar variables de entorno
DB_HOST=tu_host_produccion
DB_USER=tu_usuario
DB_PASSWORD=tu_password
EMAIL_PASS=tu_password_aplicacion

# 2. Build y start
npm install --production
npm start
```

### Frontend (Vercel/Netlify)
```bash
# 1. Build
npm run build

# 2. Configurar variable de entorno
VITE_API_URL=https://tu-backend.com/api
```

### Base de Datos (PlanetScale/AWS RDS)
```sql
-- Exportar BD local
mysqldump -u root -p LavadoVaporBogotaDB > dump.sql

-- Importar en producción
mysql -h host_produccion -u usuario -p nombre_bd < dump.sql
```

---

## 📊 MÉTRICAS Y ESTADÍSTICAS

### Cobertura Actual
- **Backend:** 58% tablas con CRUD (11/19)
- **Frontend:** 100% rutas principales implementadas
- **Testing:** Manual (Postman collection disponible)
- **Documentación:** 100% actualizada

### Rendimiento
- **Backend:** ~50-200ms por request
- **Frontend:** First Load: ~500ms
- **Emails:** 1-2 segundos de envío

---

## 🔜 ROADMAP Y MEJORAS FUTURAS

### Prioridad Alta
- [ ] Sistema de calificaciones y reseñas
- [ ] Notificaciones push en tiempo real
- [ ] Programa de fidelización (puntos)
- [ ] Dashboard con gráficos (Chart.js)

### Prioridad Media
- [ ] Sistema de tickets de soporte
- [ ] Chat en vivo con técnicos
- [ ] Pasarela de pagos (PSE/Tarjetas)
- [ ] App móvil (React Native)

### Prioridad Baja
- [ ] Historial de mantenimiento
- [ ] Gestión de inventario
- [ ] Sistema de facturación
- [ ] Multi-idioma (i18n)

---

## 👥 EQUIPO Y CONTACTO

- **Desarrollador Principal:** yeygok
- **Email:** yeygok777@gmail.com
- **GitHub:** https://github.com/yeygok/projectoL
- **Empresa:** Mega Malvado - Lavado Vapor Bogotá

---

## 📄 LICENCIA

Proyecto privado - Todos los derechos reservados © 2025

---

## 📝 NOTAS IMPORTANTES

### Seguridad
- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT con expiración
- ✅ Prepared statements (prevención SQL injection)
- ✅ Middleware de autenticación en rutas protegidas
- ✅ Variables de entorno para credenciales
- ⚠️ Implementar rate limiting (futuro)
- ⚠️ Implementar HTTPS en producción

### Mantenimiento
- Renovar contraseña de aplicación Gmail cada 6 meses
- Backup de base de datos semanal
- Actualizar dependencias mensualmente
- Revisar logs de error diariamente

### Contacto de Soporte
- Email: sierranicol805@gmail.com
- WhatsApp: +57 300 123 4567 (ejemplo)

---

**Última actualización:** 3 de octubre de 2025  
**Versión del documento:** 1.0  
**Estado del proyecto:** ✅ Producción / Desarrollo Activo
