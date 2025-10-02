-- Script para activar todos los usuarios registrados
-- Ejecutar esto solo una vez para corregir usuarios existentes

USE LavadoVaporBogotaDB;

-- Ver estado actual de usuarios
SELECT id, nombre, apellido, email, rol_id, activo, created_at 
FROM Usuarios 
ORDER BY created_at DESC;

-- Activar todos los usuarios que están inactivos
UPDATE Usuarios 
SET activo = 1 
WHERE activo = 0 OR activo IS NULL;

-- Verificar cambios
SELECT 
    COUNT(*) as total_usuarios,
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as usuarios_activos,
    SUM(CASE WHEN activo = 0 OR activo IS NULL THEN 1 ELSE 0 END) as usuarios_inactivos
FROM Usuarios;

-- Ver usuarios actualizados
SELECT id, nombre, apellido, email, rol_id, activo, created_at 
FROM Usuarios 
WHERE activo = 1
ORDER BY created_at DESC;
 