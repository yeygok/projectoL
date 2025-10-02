# 🚀 GUÍA RÁPIDA - PROBAR NUEVAS PÁGINAS

**Fecha:** 2 de octubre de 2025  
**Estado:** ✅ TODO LISTO PARA PROBAR

---

## 🎯 SERVIDORES CORRIENDO

### Backend
- **URL:** http://localhost:3000
- **Estado:** ✅ Corriendo
- **API Endpoints:** /api/categorias, /api/tipos-servicio, /api/estados-reserva

### Frontend
- **URL:** http://localhost:5173
- **Estado:** ✅ Corriendo
- **Vite Ready:** 794ms

---

## 🔐 CREDENCIALES DE ACCESO

**Email:** yeygok777@gmail.com  
**Password:** 121212  
**Rol:** Admin

---

## 📱 PASOS PARA PROBAR

### 1. Abrir el Dashboard
```
1. Abrir navegador en: http://localhost:5173
2. Hacer login con las credenciales
3. Serás redirigido al dashboard de admin
```

### 2. Navegar a las Nuevas Páginas

En el menú lateral izquierdo, encontrarás **3 NUEVAS opciones**:

#### 📦 Categorías
- **Ubicación en menú:** Después de "Servicios"
- **Ícono:** Cuadrado con categorías (CategoryIcon)
- **URL:** http://localhost:5173/dashboard/categorias

**Qué probar:**
- ✅ Ver listado de categorías
- ✅ Crear nueva categoría
- ✅ Editar categoría existente
- ✅ Desactivar categoría (soft delete)
- ✅ Reactivar categoría
- ✅ Ver conteo de servicios asociados

---

#### 🎨 Tipos de Servicio
- **Ubicación en menú:** Después de "Categorías"
- **Ícono:** Etiqueta de estilo (StyleIcon)
- **URL:** http://localhost:5173/dashboard/tipos-servicio

**Qué probar:**
- ✅ Ver listado de tipos
- ✅ Crear nuevo tipo
- ✅ Selector de colores (6 predefinidos)
- ✅ Validación de color HEX (#RRGGBB)
- ✅ Multiplicador con preview de precio
- ✅ Editar tipo existente
- ✅ Intentar eliminar tipo con reservas (debe fallar)
- ✅ Eliminar tipo sin reservas

**Features especiales:**
- 🎨 Vista previa de color en tiempo real
- 💰 Cálculo de precio ejemplo
- 🔒 Validación de multiplicador (0-10)

---

#### 📊 Estados de Reserva
- **Ubicación en menú:** Después de "Tipos de Servicio"
- **Ícono:** Timeline (TimelineIcon)
- **URL:** http://localhost:5173/dashboard/estados-reserva

**Qué probar:**
- ✅ Ver 4 tarjetas de estadísticas en la parte superior:
  - Total de reservas
  - Reservas futuras
  - Reservas completadas
  - Ingresos totales
- ✅ Ver listado de estados con contadores
- ✅ Crear nuevo estado
- ✅ Editar estado existente
- ✅ Intentar eliminar estado crítico (debe fallar con mensaje)
- ✅ Intentar eliminar estado con reservas (debe fallar)
- ✅ Ver estadísticas detalladas por estado (scroll abajo)
- ✅ Chips de estados críticos en rojo

**Estados críticos protegidos:**
- pendiente
- confirmada
- completada
- cancelada

**Features especiales:**
- 📊 Panel de estadísticas globales
- 💳 Tarjetas detalladas por estado
- 🛡️ Triple protección contra eliminación
- 📈 Ingresos y promedios por estado

---

## 🧪 CHECKLIST DE PRUEBAS

### Categorías
- [ ] Tabla carga correctamente
- [ ] Puedo crear nueva categoría
- [ ] Validación: No permite nombre vacío
- [ ] Puedo editar categoría
- [ ] Soft delete funciona (cambia a "Inactiva")
- [ ] Puedo reactivar categoría inactiva
- [ ] Botón "Reactivar" aparece solo en inactivas
- [ ] Contador de servicios se muestra
- [ ] Notificaciones toast aparecen

### Tipos de Servicio
- [ ] Tabla carga correctamente
- [ ] Puedo crear nuevo tipo
- [ ] Selector de colores funciona
- [ ] Validación: Color HEX inválido muestra error
- [ ] Validación: Multiplicador fuera de rango (0-10) no se guarda
- [ ] Vista previa de color se actualiza en tiempo real
- [ ] Precio ejemplo se calcula correctamente
- [ ] Puedo editar tipo
- [ ] No puedo eliminar tipo con reservas (mensaje)
- [ ] Puedo eliminar tipo sin reservas
- [ ] Botón eliminar está deshabilitado si tiene reservas

### Estados de Reserva
- [ ] 4 tarjetas de estadísticas se muestran arriba
- [ ] Estadísticas tienen datos correctos
- [ ] Tabla carga correctamente
- [ ] Columna "Futuras" muestra chip azul
- [ ] Columna "Pasadas" muestra chip gris
- [ ] Puedo crear nuevo estado
- [ ] Validación: Color HEX funciona
- [ ] NO puedo eliminar estados críticos (mensaje de error)
- [ ] Chip "Crítico" aparece en estados protegidos
- [ ] NO puedo eliminar estado con reservas
- [ ] Puedo editar descripción de estado crítico
- [ ] NO puedo cambiar nombre de estado crítico
- [ ] Estadísticas detalladas se muestran abajo (tarjetas)
- [ ] Cada tarjeta muestra ingresos y promedios

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot read property 'data'"
**Causa:** La API está apagada o no responde  
**Solución:**
```bash
cd backend
npm start
```

### Error: "401 Unauthorized"
**Causa:** Token expiró o no existe  
**Solución:** Hacer logout y login nuevamente

### Error: "Network Error"
**Causa:** Backend no está corriendo en puerto 3000  
**Solución:** Verificar que backend esté en http://localhost:3000

### Error: "Failed to fetch"
**Causa:** CORS o backend caído  
**Solución:**
```bash
# Reiniciar backend
cd backend
npm start
```

### Página en blanco
**Causa:** Error de JavaScript en consola  
**Solución:**
1. Abrir DevTools (F12)
2. Ver errores en Console
3. Verificar que todos los imports existan

---

## 📊 DATOS DE PRUEBA SUGERIDOS

### Para Categorías:
```
Nombre: Tapicería de Vehículos
Descripción: Limpieza profunda de asientos, alfombras y tapizados de automóviles
Icono: 🚗
Orden: 5
```

### Para Tipos de Servicio:
```
Nombre: Express
Descripción: Servicio rápido en menos de 2 horas
Multiplicador: 1.5
Color: #FF5722 (Naranja)
```

### Para Estados:
```
Estado: en_camino
Descripción: El técnico está en ruta hacia la ubicación del cliente
Color: #2196F3 (Azul)
```

---

## 🎬 FLUJO DE PRUEBA RECOMENDADO

### 1. Login (2 min)
- Abrir http://localhost:5173
- Login con credenciales
- Verificar que el dashboard carga

### 2. Probar Categorías (5 min)
- Navegar a Categorías
- Crear 2 categorías de prueba
- Editar una
- Desactivar una
- Reactivar la desactivada

### 3. Probar Tipos de Servicio (5 min)
- Navegar a Tipos de Servicio
- Crear tipo con color personalizado
- Probar selector de colores
- Ver cálculo de precio en vivo
- Intentar multiplicador fuera de rango

### 4. Probar Estados (5 min)
- Navegar a Estados de Reserva
- Verificar estadísticas arriba
- Crear estado nuevo
- Intentar eliminar "pendiente" (debe fallar)
- Ver estadísticas detalladas abajo

### 5. Validaciones (3 min)
- Intentar crear categoría sin nombre
- Intentar crear tipo con color inválido
- Intentar crear estado duplicado

**Tiempo total:** ~20 minutos

---

## 📸 SCREENSHOTS ESPERADOS

### Menú Lateral
Deberías ver:
```
📊 Inicio
📅 Citas
👥 Clientes
🚗 Servicios
📦 Categorías          ← NUEVO
🎨 Tipos de Servicio   ← NUEVO
📈 Estados             ← NUEVO
👤 Usuarios
🔒 Roles
⚙️  Configuración
👤 Mi Perfil
```

### Dashboard Categorías
- Tabla con columnas: ID, Nombre, Descripción, Servicios, Estado, Acciones
- Botón "Nueva Categoría" arriba
- Chips de estado (Verde=Activa, Gris=Inactiva)

### Dashboard Tipos
- Tabla con columnas: ID, Nombre (con círculo de color), Descripción, Multiplicador, Color, Reservas, Acciones
- Chips de multiplicador
- Vista previa de color en celdas

### Dashboard Estados
- 4 tarjetas grandes arriba con estadísticas
- Tabla con contadores de futuras/pasadas
- Chips de "Crítico" en estados protegidos
- Tarjetas de estadísticas detalladas abajo

---

## ✅ RESULTADO ESPERADO

Al completar todas las pruebas:
- ✅ 3 páginas funcionando perfectamente
- ✅ CRUD completo operativo
- ✅ Validaciones trabajando
- ✅ Notificaciones mostrándose
- ✅ Estadísticas calculándose correctamente
- ✅ Protecciones de datos críticos funcionando

---

## 🎉 NEXT STEPS

Una vez que verifiques que todo funciona:

1. **Tomar screenshots** de las 3 páginas
2. **Documentar cualquier bug** encontrado
3. **Decidir próximo paso:**
   - Continuar con más tablas (75% cobertura)
   - Ir a Fase 2 (Landing page pública)
   - Agregar features adicionales

---

**¿Listo para probar?** 🚀

Abre tu navegador en: **http://localhost:5173** y ¡disfruta tu nuevo dashboard! 🎨
