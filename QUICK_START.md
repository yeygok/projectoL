# 🚀 **GUÍA DE INICIO RÁPIDO - MEGA MALVADO**

## ⚡ **INICIAR EL SISTEMA (3 PASOS)**

### **1. Iniciar Backend**
```bash
cd backend
npm install  # Solo la primera vez
npm start
```
✅ **Resultado:** Servidor corriendo en `http://localhost:3000`

### **2. Iniciar Frontend**
```bash
cd front_pl
npm install  # Solo la primera vez
npm run dev
```
✅ **Resultado:** Aplicación en `http://localhost:5173`

### **3. Verificar Base de Datos**
```bash
mysql -u root -p
USE LavadoVaporBogotaDB;
SELECT COUNT(*) FROM Usuarios;  # Debe mostrar 8
```
✅ **Resultado:** Base de datos conectada y con datos

---

## 🔐 **ACCEDER AL SISTEMA**

### **Credenciales de Prueba:**
- **Admin:** admin@mega-malvado.com / admin123
- **Cliente:** cliente1@email.com / cliente123
- **Técnico:** tecnico1@email.com / tecnico123

### **URLs Importantes:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Postman Collection:** Importar `postman_collection.json`

---

## 📊 **PRUEBAS RÁPIDAS**

### **API con Postman:**
1. **Login:** `POST /api/auth/login`
   ```json
   {
     "email": "admin@mega-malvado.com",
     "password": "admin123"
   }
   ```
2. **Estadísticas:** `GET /api/dashboard/stats`
3. **Reservas Recientes:** `GET /api/dashboard/recent-reservas`

### **Frontend:**
1. Ir a http://localhost:5173
2. Login con credenciales de admin
3. Ver dashboard con estadísticas
4. Navegar entre módulos (Usuarios, Servicios, etc.)

---

## 🗂️ **ARCHIVOS IMPORTANTES**

### **Documentación:**
- `POSTMAN_API_GUIDE.md` - Guía completa de la API
- `DATABASE_ANALYSIS.md` - Análisis detallado de la BD
- `DATABASE_SUMMARY.md` - Resumen ejecutivo
- `VALIDATION_CHECKLIST.md` - Checklist de validación

### **Configuración:**
- `backend/package.json` - Dependencias backend
- `front_pl/package.json` - Dependencias frontend
- `backend/config/db.js` - Configuración BD
- `postman_collection.json` - Colección Postman

---

## 🎯 **FUNCIONALIDADES DISPONIBLES**

### **Módulos Operativos:**
- ✅ **Autenticación** (login/register/verify)
- ✅ **Dashboard** (estadísticas, reservas recientes)
- ✅ **Usuarios** (CRUD completo)
- ✅ **Servicios** (CRUD completo)
- ✅ **Reservas/Agendamiento** (CRUD completo)
- ✅ **Roles y Permisos** (gestión completa)
- ✅ **Ubicaciones** (CRUD completo)
- ✅ **Vehículos** (CRUD completo)

### **Datos de Prueba:**
- **8 Usuarios** (admin, clientes, técnicos, soporte)
- **12 Reservas** (distintos estados)
- **10 Servicios** (7 categorías)
- **4 Vehículos** (activos)
- **14 Ubicaciones** (Bogotá)

---

## 🔧 **COMANDOS ÚTILES**

### **Backend:**
```bash
# Ver logs del servidor
cd backend && npm start

# Verificar dependencias
npm list --depth=0

# Reiniciar servidor
rs  # Si usas nodemon
```

### **Frontend:**
```bash
# Ver logs de desarrollo
cd front_pl && npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### **Base de Datos:**
```bash
# Conectar
mysql -u root -p -D LavadoVaporBogotaDB

# Ver tablas
SHOW TABLES;

# Contar registros
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM Usuarios
UNION ALL
SELECT 'Reservas', COUNT(*) FROM Reservas
UNION ALL
SELECT 'Servicios', COUNT(*) FROM Servicios;
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Backend no inicia:**
```bash
# Verificar Node.js
node --version

# Verificar dependencias
cd backend && npm install

# Verificar BD
mysql -u root -p -e "SELECT 1"
```

### **Frontend no carga:**
```bash
# Limpiar cache
cd front_pl && rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **API no responde:**
```bash
# Verificar servidor backend
curl http://localhost:3000/api/test-users

# Verificar BD
mysql -u root -p -e "USE LavadoVaporBogotaDB; SELECT COUNT(*) FROM Usuarios;"
```

---

## 📈 **PRÓXIMOS PASOS**

### **Inmediatos:**
1. **Probar todas las rutas** con Postman
2. **Validar formularios** del frontend
3. **Crear nuevas reservas** desde la interfaz
4. **Probar operaciones CRUD** completas

### **Mediano Plazo:**
1. **Implementar reportes** de ingresos
2. **Agregar notificaciones** push
3. **Sistema de calificaciones**
4. **Optimización de consultas**

### **Futuro:**
1. **App móvil**
2. **Integración pagos**
3. **API de mapas**
4. **Sistema de soporte**

---

## 📞 **SOPORTE**

### **Documentación Disponible:**
- 📖 `POSTMAN_API_GUIDE.md` - Referencia completa de API
- 📊 `DATABASE_ANALYSIS.md` - Detalles técnicos de BD
- ✅ `VALIDATION_CHECKLIST.md` - Verificación del sistema

### **Puntos de Contacto:**
- **API Endpoints:** http://localhost:3000/api/
- **Frontend App:** http://localhost:5173
- **Base de Datos:** LavadoVaporBogotaDB (MySQL)

---

**🎯 Estado del Sistema:** **TOTALMENTE OPERATIVO**  
**📅 Última actualización:** $(date)  
**🚀 ¡Listo para usar!**
