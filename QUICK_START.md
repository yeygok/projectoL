# 🚀 QUICK START - MEGA LAVADO

## Iniciar el Proyecto

### 1. Backend
```bash
cd backend
npm start
# API: http://localhost:3000
```

### 2. Frontend
```bash
cd front_pl
npm run dev
# App: http://localhost:5173
```

### 3. Base de Datos
```
Host: localhost:3306
Database: LavadoVaporBogotaDB
User: root
```

## Usuarios de Prueba

### Admin
```
Email: admin@megalavado.com
Password: admin123
Rol: admin (id=1)
Acceso: /dashboard
```

### Cliente
```
Email: cliente@test.com
Password: test123
Rol: cliente (id=2)
Acceso: /cliente
```

## Estructura del Proyecto

```
project L/
├── backend/               # API Node.js + Express
│   ├── index.js          # Servidor principal (puerto 3000)
│   ├── config/           # Configuración DB y mailer
│   ├── controllers/      # Lógica de negocio
│   ├── routes/           # Definición de endpoints
│   ├── middlewares/      # Auth middleware (JWT)
│   └── services/         # Servicios externos (email)
│
├── front_pl/             # App React + Vite
│   └── src/
│       ├── App.jsx       # Rutas principales
│       ├── pages/        # Vistas (Home, Login, Dashboard, etc)
│       ├── components/   # Componentes reutilizables
│       ├── context/      # AuthContext (estado global)
│       ├── services/     # API services
│       └── theme/        # Material-UI theme
│
├── dataAnalisis.md       # 📊 Documentación técnica completa
└── QUICK_START.md        # Este archivo
```

## Endpoints Principales

### Autenticación
```
POST   /api/auth/login       # Iniciar sesión
POST   /api/auth/register    # Crear cuenta
POST   /api/auth/logout      # Cerrar sesión
GET    /api/auth/verify      # Verificar token
```

### Dashboard Admin
```
GET    /api/dashboard/stats              # Estadísticas
GET    /api/dashboard/usuarios           # CRUD usuarios
GET    /api/dashboard/agendamientos      # TODAS las reservas
GET    /api/dashboard/servicios          # CRUD servicios
```

### Cliente
```
GET    /api/agendamiento/cliente/:id     # Reservas del cliente
POST   /api/agendamiento                 # Crear reserva
GET    /api/perfil/me                    # Perfil del usuario
PUT    /api/perfil/me                    # Actualizar perfil
```

## Flujo de Uso Rápido

### Como Cliente (Crear Reserva)
1. Ir a http://localhost:5173
2. Login con cliente@test.com
3. Dashboard → "Nueva Reserva"
4. Seguir wizard de 5 pasos
5. Ver reserva en "Mis Reservas"

### Como Admin (Gestionar)
1. Ir a http://localhost:5173
2. Login con admin@megalavado.com
3. Dashboard → Ver todas las reservas en "Agendamientos"

## Variables de Entorno

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=LavadoVaporBogotaDB
JWT_SECRET=tu_secret
EMAIL_USER=info@megalavado.com
PORT=3000
```

## Testing con cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@megalavado.com","password":"admin123"}'

# Health check
curl http://localhost:3000/health
```

## Troubleshooting

### Backend no arranca
```bash
# Verificar MySQL corriendo
mysql -u root -p -e "SHOW DATABASES;"
```

### Frontend no arranca
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Información

- **Email:** info@megalavado.com
- **Documentación completa:** Ver `dataAnalisis.md`

---

**Estado:** ✅ Sistema funcional
