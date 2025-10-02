# 📧 Configuración de Gmail para Envío de Emails - Sistema de Reservas

## ⚠️ IMPORTANTE: Contraseña de Aplicación de Gmail

Gmail **NO permite** usar la contraseña normal de la cuenta directamente en aplicaciones. Debes usar una **"Contraseña de Aplicación"**.

---

## 🔐 Paso 1: Habilitar Verificación en 2 Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo, selecciona **"Seguridad"**
3. Busca la sección **"Cómo inicias sesión en Google"**
4. Haz clic en **"Verificación en dos pasos"**
5. Sigue los pasos para habilitarla (necesitarás tu teléfono)

**Nota:** Sin la verificación en 2 pasos, NO podrás crear contraseñas de aplicación.

---

## 🔑 Paso 2: Crear Contraseña de Aplicación

1. Una vez habilitada la verificación en 2 pasos, regresa a **"Seguridad"**
2. Busca **"Contraseñas de aplicaciones"** (aparece después de habilitar 2FA)
3. Haz clic en **"Contraseñas de aplicaciones"**
4. Es posible que te pida tu contraseña de Google nuevamente
5. En "Seleccionar app" → elige **"Correo"**
6. En "Seleccionar dispositivo" → elige **"Otro (nombre personalizado)"**
7. Escribe: **"Sistema de Reservas - Lavado Vapor"**
8. Haz clic en **"Generar"**

**Gmail te mostrará una contraseña de 16 caracteres:**
```
Ejemplo: abcd efgh ijkl mnop
```

⚠️ **IMPORTANTE:** Copia esta contraseña AHORA. Solo se muestra una vez.

---

## 📝 Paso 3: Actualizar el archivo .env

Con la contraseña de aplicación generada, actualiza el archivo `.env`:

```env
# Configuración de correo electrónico
EMAIL_USER=sierranicol805@gmail.com
EMAIL_PASS=abcdefghijklmnop    # ← Pegar aquí (SIN espacios)
EMAIL_FROM_NAME=Mega Malvado - Lavado Vapor Bogotá
```

**Notas:**
- Pega la contraseña SIN espacios: `abcdefghijklmnop`
- NO uses la contraseña normal de Gmail
- NO compartas esta contraseña con nadie

---

## 🧪 Paso 4: Probar la Configuración

### Opción A: Iniciar el servidor
```bash
cd backend
npm start
```

Al iniciar, deberías ver:
```
✅ Servidor de correo listo para enviar mensajes
📧 Enviando desde: sierranicol805@gmail.com
```

### Opción B: Script de prueba
```bash
cd backend
node scripts/testEmail.js
```

Esto enviará un email de prueba a tu propia dirección.

### Opción C: Endpoint de API (con Postman o Thunder Client)
```
GET http://localhost:3000/api/agendamiento/test-email
Headers:
  Authorization: Bearer {tu_token_de_admin}
```

---

## 🐛 Solución de Problemas

### Error: "Invalid login"
- ✅ Verifica que uses la **contraseña de aplicación**, NO la contraseña normal
- ✅ Verifica que la contraseña NO tenga espacios
- ✅ Asegúrate de que la verificación en 2 pasos esté activa

### Error: "Username and Password not accepted"
- ✅ Regenera la contraseña de aplicación
- ✅ Copia y pega sin espacios
- ✅ Reinicia el servidor backend

### No se envían emails pero no hay errores
- ✅ Revisa la carpeta de SPAM en Gmail
- ✅ Verifica que `EMAIL_USER` sea correcto
- ✅ Revisa los logs del servidor

### Error: "self signed certificate"
- ✅ Cambia `secure: true` a `secure: false` en `backend/config/mailer.js`
- ✅ Cambia `port: 465` a `port: 587`

---

## 📧 Configuración Actual

**Email configurado:** sierranicol805@gmail.com  
**Contraseña actual:** Nicol12345 ❌ *Esta NO es una contraseña de aplicación válida*

**Estado:** ❌ Error confirmado:
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

### ⚡ ACCIÓN REQUERIDA AHORA:
1. Ve a: https://myaccount.google.com/apppasswords
2. Si pide verificación en 2 pasos, actívala primero: https://myaccount.google.com/signinoptions/two-step-verification
3. Genera una contraseña de aplicación para "Correo"
4. Copia los 16 caracteres (ejemplo: `abcdefghijklmnop`)
5. Reemplaza `Nicol12345` en `.env` con esa contraseña
6. Reinicia el servidor: `npm start`
7. Prueba con: `node scripts/testEmail.js`

---

## 🎯 Verificación Final

Cuando todo esté configurado correctamente, deberías poder:

✅ Iniciar el servidor sin errores de email  
✅ Ver "✅ Servidor de correo listo" en la consola  
✅ Ejecutar `node scripts/testEmail.js` exitosamente  
✅ Recibir un email de prueba en tu bandeja  
✅ Crear una reserva y recibir email de confirmación  

---

## 📚 Referencias

- **Contraseñas de aplicación de Google:** https://support.google.com/accounts/answer/185833
- **Verificación en 2 pasos:** https://support.google.com/accounts/answer/185839
- **Nodemailer con Gmail:** https://nodemailer.com/usage/using-gmail/

---

## 🔒 Seguridad

⚠️ **NUNCA compartas:**
- Tu contraseña de aplicación
- El archivo `.env`
- Tokens de acceso

⚠️ **NUNCA subas a Git:**
- El archivo `.env` (debe estar en `.gitignore`)
- Contraseñas en código

✅ **Buenas prácticas:**
- Usa variables de entorno
- Mantén `.env` en `.gitignore`
- Usa contraseñas de aplicación específicas por proyecto
- Revoca contraseñas que no uses

---

**Última actualización:** 2 de octubre de 2025  
**Estado:** ⏳ Pendiente - Requiere generar contraseña de aplicación
