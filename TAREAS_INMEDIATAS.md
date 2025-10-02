# 🎯 TAREAS INMEDIATAS - COMENZAR FASE 1 HOY

## 📋 **CHECKLIST PARA EMPEZAR (30 minutos)**

### **Preparación del Entorno:**
```bash
□ Git status - commit cambios pendientes
□ Crear branch: git checkout -b feature/fase1-crud-completo
□ Verificar backend corriendo (npm start)
□ Verificar frontend corriendo (npm run dev)
□ Verificar MySQL corriendo
□ Abrir Postman collection
```

---

## 🔥 **DÍA 1: CRUD CategoriasServicios (3-4 horas)**

### **TAREA 1.1: Backend - Controlador (1 hora)**

#### **Archivo a crear:** `backend/controllers/categoriaController.js`

```javascript
const pool = require('../config/db');

class CategoriaController {
  
  // GET /api/categorias - YA EXISTE en dashboardController
  // Mover aquí o mantener, tu decides
  
  // POST /api/categorias - Crear nueva categoría
  async createCategoria(req, res) {
    const { nombre, descripcion, icono, orden } = req.body;
    
    // Validaciones
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    try {
      // Verificar que nombre no exista
      const [existente] = await pool.query(
        'SELECT id FROM CategoriasServicios WHERE nombre = ?',
        [nombre]
      );
      
      if (existente.length > 0) {
        return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
      }
      
      // Si no se especifica orden, usar el siguiente disponible
      let ordenFinal = orden;
      if (!ordenFinal) {
        const [maxOrden] = await pool.query(
          'SELECT MAX(orden) as max_orden FROM CategoriasServicios'
        );
        ordenFinal = (maxOrden[0].max_orden || 0) + 1;
      }
      
      // Insertar
      const [result] = await pool.query(`
        INSERT INTO CategoriasServicios 
        (nombre, descripcion, icono, orden, activa)
        VALUES (?, ?, ?, ?, 1)
      `, [nombre, descripcion, icono, ordenFinal]);
      
      res.status(201).json({
        id: result.insertId,
        mensaje: 'Categoría creada exitosamente',
        categoria: { 
          id: result.insertId,
          nombre, 
          descripcion, 
          icono, 
          orden: ordenFinal 
        }
      });
      
    } catch (error) {
      console.error('❌ Error al crear categoría:', error);
      res.status(500).json({ error: 'Error al crear categoría' });
    }
  }
  
  // PUT /api/categorias/:id - Actualizar categoría
  async updateCategoria(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, icono, orden, activa } = req.body;
    
    try {
      // Verificar que existe
      const [categoria] = await pool.query(
        'SELECT id FROM CategoriasServicios WHERE id = ?',
        [id]
      );
      
      if (categoria.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      // Verificar nombre único (excluyendo la misma categoría)
      if (nombre) {
        const [existente] = await pool.query(
          'SELECT id FROM CategoriasServicios WHERE nombre = ? AND id != ?',
          [nombre, id]
        );
        
        if (existente.length > 0) {
          return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        }
      }
      
      // Actualizar
      const [result] = await pool.query(`
        UPDATE CategoriasServicios 
        SET nombre = ?, descripcion = ?, icono = ?, orden = ?, activa = ?, updated_at = NOW()
        WHERE id = ?
      `, [nombre, descripcion, icono, orden, activa, id]);
      
      res.json({ 
        id, 
        mensaje: 'Categoría actualizada exitosamente',
        categoria: { id, nombre, descripcion, icono, orden, activa }
      });
      
    } catch (error) {
      console.error('❌ Error al actualizar categoría:', error);
      res.status(500).json({ error: 'Error al actualizar categoría' });
    }
  }
  
  // DELETE /api/categorias/:id - Eliminar (soft delete)
  async deleteCategoria(req, res) {
    const { id } = req.params;
    
    try {
      // Verificar que existe
      const [categoria] = await pool.query(
        'SELECT id FROM CategoriasServicios WHERE id = ?',
        [id]
      );
      
      if (categoria.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      // Verificar que no tenga servicios activos
      const [servicios] = await pool.query(
        'SELECT COUNT(*) as total FROM Servicios WHERE categoria_id = ? AND activo = 1',
        [id]
      );
      
      if (servicios[0].total > 0) {
        return res.status(400).json({ 
          error: `No se puede eliminar la categoría porque tiene ${servicios[0].total} servicio(s) activo(s)` 
        });
      }
      
      // Soft delete
      const [result] = await pool.query(
        'UPDATE CategoriasServicios SET activa = 0, updated_at = NOW() WHERE id = ?',
        [id]
      );
      
      res.json({ mensaje: 'Categoría desactivada exitosamente' });
      
    } catch (error) {
      console.error('❌ Error al eliminar categoría:', error);
      res.status(500).json({ error: 'Error al eliminar categoría' });
    }
  }
  
  // GET /api/categorias/:id - Obtener una categoría
  async getCategoriaById(req, res) {
    const { id } = req.params;
    
    try {
      const [categoria] = await pool.query(`
        SELECT cs.*, COUNT(s.id) as total_servicios
        FROM CategoriasServicios cs
        LEFT JOIN Servicios s ON cs.id = s.categoria_id AND s.activo = 1
        WHERE cs.id = ?
        GROUP BY cs.id
      `, [id]);
      
      if (categoria.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      res.json(categoria[0]);
      
    } catch (error) {
      console.error('❌ Error al obtener categoría:', error);
      res.status(500).json({ error: 'Error al obtener categoría' });
    }
  }
  
  // GET /api/categorias - Obtener todas
  async getAllCategorias(req, res) {
    try {
      const [categorias] = await pool.query(`
        SELECT cs.*, COUNT(s.id) as total_servicios
        FROM CategoriasServicios cs
        LEFT JOIN Servicios s ON cs.id = s.categoria_id AND s.activo = 1
        GROUP BY cs.id
        ORDER BY cs.orden ASC, cs.nombre ASC
      `);
      
      res.json(categorias);
      
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }
}

module.exports = new CategoriaController();
```

**✅ Completado cuando:**
- [ ] Archivo creado
- [ ] Todos los métodos implementados
- [ ] Validaciones incluidas
- [ ] Error handling correcto

---

### **TAREA 1.2: Backend - Rutas (20 minutos)**

#### **Archivo a crear:** `backend/routes/categoria.js`

```javascript
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas protegidas con autenticación
router.use(authMiddleware);

// Rutas públicas (solo lectura) - pueden ser accedidas por cualquier usuario autenticado
router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);

// Rutas de administración - solo admin
router.post('/', isAdmin, categoriaController.createCategoria);
router.put('/:id', isAdmin, categoriaController.updateCategoria);
router.delete('/:id', isAdmin, categoriaController.deleteCategoria);

module.exports = router;
```

**✅ Completado cuando:**
- [ ] Archivo creado
- [ ] Rutas definidas
- [ ] Middleware aplicado

---

### **TAREA 1.3: Backend - Registrar Rutas (10 minutos)**

#### **Archivo a modificar:** `backend/routes/index.js`

```javascript
// ... imports existentes ...

const categoriaRoutes = require('./categoria');

// ... código existente ...

// Registrar nueva ruta
router.use('/categorias', categoriaRoutes);

// ... resto del código ...
```

**✅ Completado cuando:**
- [ ] Import agregado
- [ ] Ruta registrada
- [ ] Backend reiniciado sin errores

---

### **TAREA 1.4: Backend - Middleware isAdmin (15 minutos)**

#### **Archivo a modificar:** `backend/middlewares/authMiddleware.js`

```javascript
// ... código existente del authMiddleware ...

// Middleware para verificar rol admin
const isAdmin = (req, res, next) => {
  try {
    // req.user ya fue seteado por authMiddleware
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    // Verificar que el rol sea admin
    if (req.user.rol_nombre !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado. Solo administradores pueden realizar esta acción.' 
      });
    }
    
    next();
    
  } catch (error) {
    console.error('❌ Error en middleware isAdmin:', error);
    res.status(500).json({ error: 'Error en verificación de permisos' });
  }
};

module.exports = { authMiddleware, isAdmin };
```

**✅ Completado cuando:**
- [ ] Función isAdmin creada
- [ ] Exportada correctamente
- [ ] Probado que funciona

---

### **TAREA 1.5: Backend - Testing con Postman (30 minutos)**

#### **Crear Collection en Postman:**

```json
{
  "name": "Categorias CRUD",
  "item": [
    {
      "name": "GET All Categorias",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/api/categorias"
      }
    },
    {
      "name": "GET Categoria by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/api/categorias/1"
      }
    },
    {
      "name": "POST Create Categoria",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"nombre\": \"Categoría de Prueba\",\n  \"descripcion\": \"Descripción de prueba\",\n  \"icono\": \"fa-test\",\n  \"orden\": 10\n}"
        },
        "url": "{{baseUrl}}/api/categorias"
      }
    },
    {
      "name": "PUT Update Categoria",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"nombre\": \"Categoría Actualizada\",\n  \"descripcion\": \"Descripción actualizada\",\n  \"icono\": \"fa-updated\",\n  \"orden\": 5,\n  \"activa\": 1\n}"
        },
        "url": "{{baseUrl}}/api/categorias/8"
      }
    },
    {
      "name": "DELETE Categoria",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/api/categorias/8"
      }
    }
  ]
}
```

**Checklist de Testing:**
```bash
□ Login como admin (obtener token)
□ GET /api/categorias (200 OK)
□ GET /api/categorias/1 (200 OK)
□ POST /api/categorias (201 Created) - con datos válidos
□ POST /api/categorias (409 Conflict) - con nombre duplicado
□ POST /api/categorias (400 Bad Request) - sin nombre
□ PUT /api/categorias/:id (200 OK) - actualización válida
□ PUT /api/categorias/999 (404 Not Found) - ID inexistente
□ DELETE /api/categorias/:id (200 OK) - categoría sin servicios
□ DELETE /api/categorias/1 (400 Bad Request) - categoría con servicios
□ GET /api/categorias (no debe aparecer la eliminada)
□ Login como cliente (403 Forbidden en POST/PUT/DELETE)
```

**✅ Completado cuando:**
- [ ] Todos los tests pasan
- [ ] Validaciones funcionan
- [ ] Error handling apropiado

---

## 🔥 **DÍA 2: CRUD TiposServicio (3-4 horas)**

### **TAREA 2.1: Backend - Controlador TiposServicio (1 hora)**

#### **Archivo a crear:** `backend/controllers/tipoServicioController.js`

```javascript
const pool = require('../config/db');

class TipoServicioController {
  
  // GET /api/tipos-servicio - Obtener todos
  async getAllTipos(req, res) {
    try {
      const [tipos] = await pool.query(`
        SELECT ts.*, COUNT(r.id) as total_reservas
        FROM TiposServicio ts
        LEFT JOIN Reservas r ON ts.id = r.servicio_tipo_id
        GROUP BY ts.id
        ORDER BY ts.nombre ASC
      `);
      
      res.json(tipos);
      
    } catch (error) {
      console.error('❌ Error al obtener tipos de servicio:', error);
      res.status(500).json({ error: 'Error al obtener tipos de servicio' });
    }
  }
  
  // GET /api/tipos-servicio/:id - Obtener uno
  async getTipoById(req, res) {
    const { id } = req.params;
    
    try {
      const [tipo] = await pool.query(`
        SELECT ts.*, COUNT(r.id) as total_reservas
        FROM TiposServicio ts
        LEFT JOIN Reservas r ON ts.id = r.servicio_tipo_id
        WHERE ts.id = ?
        GROUP BY ts.id
      `, [id]);
      
      if (tipo.length === 0) {
        return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
      }
      
      res.json(tipo[0]);
      
    } catch (error) {
      console.error('❌ Error al obtener tipo de servicio:', error);
      res.status(500).json({ error: 'Error al obtener tipo de servicio' });
    }
  }
  
  // POST /api/tipos-servicio - Crear nuevo
  async createTipo(req, res) {
    const { nombre, descripcion, multiplicador_precio, color } = req.body;
    
    // Validaciones
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    if (multiplicador_precio && (multiplicador_precio < 0 || multiplicador_precio > 10)) {
      return res.status(400).json({ error: 'El multiplicador debe estar entre 0 y 10' });
    }
    
    // Validar formato de color (#RRGGBB)
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({ error: 'Color debe estar en formato HEX (#RRGGBB)' });
    }
    
    try {
      // Verificar nombre único
      const [existente] = await pool.query(
        'SELECT id FROM TiposServicio WHERE nombre = ?',
        [nombre]
      );
      
      if (existente.length > 0) {
        return res.status(409).json({ error: 'Ya existe un tipo con ese nombre' });
      }
      
      // Insertar
      const [result] = await pool.query(`
        INSERT INTO TiposServicio 
        (nombre, descripcion, multiplicador_precio, color)
        VALUES (?, ?, ?, ?)
      `, [nombre, descripcion, multiplicador_precio || 1.00, color]);
      
      res.status(201).json({
        id: result.insertId,
        mensaje: 'Tipo de servicio creado exitosamente',
        tipo: { 
          id: result.insertId,
          nombre, 
          descripcion, 
          multiplicador_precio: multiplicador_precio || 1.00,
          color 
        }
      });
      
    } catch (error) {
      console.error('❌ Error al crear tipo de servicio:', error);
      res.status(500).json({ error: 'Error al crear tipo de servicio' });
    }
  }
  
  // PUT /api/tipos-servicio/:id - Actualizar
  async updateTipo(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, multiplicador_precio, color } = req.body;
    
    // Validaciones
    if (multiplicador_precio && (multiplicador_precio < 0 || multiplicador_precio > 10)) {
      return res.status(400).json({ error: 'El multiplicador debe estar entre 0 y 10' });
    }
    
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({ error: 'Color debe estar en formato HEX (#RRGGBB)' });
    }
    
    try {
      // Verificar que existe
      const [tipo] = await pool.query(
        'SELECT id FROM TiposServicio WHERE id = ?',
        [id]
      );
      
      if (tipo.length === 0) {
        return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
      }
      
      // Verificar nombre único (excluyendo el mismo tipo)
      if (nombre) {
        const [existente] = await pool.query(
          'SELECT id FROM TiposServicio WHERE nombre = ? AND id != ?',
          [nombre, id]
        );
        
        if (existente.length > 0) {
          return res.status(409).json({ error: 'Ya existe un tipo con ese nombre' });
        }
      }
      
      // Actualizar
      const [result] = await pool.query(`
        UPDATE TiposServicio 
        SET nombre = ?, descripcion = ?, multiplicador_precio = ?, color = ?, updated_at = NOW()
        WHERE id = ?
      `, [nombre, descripcion, multiplicador_precio, color, id]);
      
      res.json({ 
        id, 
        mensaje: 'Tipo de servicio actualizado exitosamente',
        tipo: { id, nombre, descripcion, multiplicador_precio, color }
      });
      
    } catch (error) {
      console.error('❌ Error al actualizar tipo de servicio:', error);
      res.status(500).json({ error: 'Error al actualizar tipo de servicio' });
    }
  }
  
  // DELETE /api/tipos-servicio/:id - Eliminar
  async deleteTipo(req, res) {
    const { id } = req.params;
    
    try {
      // Verificar que existe
      const [tipo] = await pool.query(
        'SELECT id FROM TiposServicio WHERE id = ?',
        [id]
      );
      
      if (tipo.length === 0) {
        return res.status(404).json({ error: 'Tipo de servicio no encontrado' });
      }
      
      // Verificar que no tenga reservas
      const [reservas] = await pool.query(
        'SELECT COUNT(*) as total FROM Reservas WHERE servicio_tipo_id = ?',
        [id]
      );
      
      if (reservas[0].total > 0) {
        return res.status(400).json({ 
          error: `No se puede eliminar el tipo porque tiene ${reservas[0].total} reserva(s) asociada(s)` 
        });
      }
      
      // Eliminar permanentemente (no hay campo 'activo' en TiposServicio)
      const [result] = await pool.query(
        'DELETE FROM TiposServicio WHERE id = ?',
        [id]
      );
      
      res.json({ mensaje: 'Tipo de servicio eliminado exitosamente' });
      
    } catch (error) {
      console.error('❌ Error al eliminar tipo de servicio:', error);
      res.status(500).json({ error: 'Error al eliminar tipo de servicio' });
    }
  }
}

module.exports = new TipoServicioController();
```

**✅ Completado cuando:**
- [ ] Archivo creado
- [ ] Validaciones implementadas
- [ ] Error handling completo

---

### **TAREA 2.2: Backend - Actualizar Rutas (15 minutos)**

#### **Archivo a modificar:** `backend/routes/tipo_servicio.js`

```javascript
const express = require('express');
const router = express.Router();
const tipoServicioController = require('../controllers/tipoServicioController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas (lectura)
router.get('/', tipoServicioController.getAllTipos);
router.get('/:id', tipoServicioController.getTipoById);

// Rutas protegidas (admin only)
router.post('/', authMiddleware, isAdmin, tipoServicioController.createTipo);
router.put('/:id', authMiddleware, isAdmin, tipoServicioController.updateTipo);
router.delete('/:id', authMiddleware, isAdmin, tipoServicioController.deleteTipo);

module.exports = router;
```

**✅ Completado cuando:**
- [ ] Rutas actualizadas
- [ ] Middleware aplicado
- [ ] Backend reiniciado

---

### **TAREA 2.3: Testing TiposServicio (30 minutos)**

**Checklist similar a Categorías:**
```bash
□ GET /api/tipos-servicio (200)
□ POST /api/tipos-servicio (201) - válido
□ POST /api/tipos-servicio (409) - nombre duplicado
□ POST /api/tipos-servicio (400) - multiplicador inválido
□ POST /api/tipos-servicio (400) - color inválido
□ PUT /api/tipos-servicio/:id (200) - válido
□ DELETE /api/tipos-servicio/:id (400) - con reservas
□ DELETE /api/tipos-servicio/:id (200) - sin reservas
```

**✅ Completado cuando:**
- [ ] Todos los tests pasan

---

## 📊 **CHECKPOINT DÍA 2 (30 minutos)**

### **Actualizar Documentación:**

```bash
# Actualizar ROUTES_SUMMARY.md
□ Agregar CategoriasServicios: CRUD Completo ✅
□ Agregar TiposServicio: CRUD Completo ✅
□ Nueva cobertura: 10/19 tablas (52.6%)

# Actualizar VALIDATION_CHECKLIST.md
□ Marcar CategoriasServicios CRUD: ✅
□ Marcar TiposServicio CRUD: ✅

# Commit y Push
git add .
git commit -m "feat: complete CRUD for CategoriasServicios and TiposServicio"
git push origin feature/fase1-crud-completo
```

---

## 🚀 **SIGUIENTE PASO: Frontend (Día 3)**

Una vez completado el backend, estarás listo para:
1. Crear páginas en React para gestionar categorías
2. Crear páginas para gestionar tipos de servicio
3. Integrar con las nuevas APIs
4. Testing E2E

---

## 💡 **TIPS IMPORTANTES**

### **Durante el Desarrollo:**
1. ✅ **Prueba cada endpoint en Postman antes de continuar**
2. ✅ **Lee los errores con atención** (MySQL te dice exactamente qué falla)
3. ✅ **Usa `console.log`** para debuggear
4. ✅ **Commits frecuentes** (cada tarea completada)
5. ✅ **No avances si algo no funciona** (arregla primero)

### **Si algo falla:**
1. Revisa la consola del backend
2. Revisa la respuesta en Postman
3. Verifica que la tabla existe: `DESCRIBE NombreTabla;`
4. Verifica los datos: `SELECT * FROM NombreTabla LIMIT 5;`
5. Verifica las relaciones: `SHOW CREATE TABLE NombreTabla;`

---

## ✅ **CHECKLIST FINAL DÍA 1-2**

```bash
Backend - CategoriasServicios:
□ Controlador creado
□ Rutas configuradas
□ Middleware isAdmin implementado
□ Tests en Postman pasando
□ Documentación actualizada

Backend - TiposServicio:
□ Controlador creado
□ Rutas actualizadas
□ Tests en Postman pasando
□ Documentación actualizada

Git:
□ Branch creado
□ Commits realizados
□ Push a remoto (opcional)

Siguiente:
□ Listo para frontend (Día 3)
□ Plan revisado
□ Dudas aclaradas
```

---

## 🆘 **¿TIENES DUDAS?**

Si algo no funciona:
1. Lee el error con calma
2. Google el error específico
3. Revisa la documentación oficial
4. Pregúntame específicamente qué parte falla

**¡Adelante! Empecemos con la TAREA 1.1** 🚀

---

**📅 Creado:** 2 de octubre de 2025  
**🎯 Objetivo:** Completar Fase 1 en 2 días  
**⏱️ Tiempo estimado:** 6-8 horas totales
