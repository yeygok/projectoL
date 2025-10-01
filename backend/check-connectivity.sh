#!/bin/bash

# Script para mostrar información de conectividad del servidor
echo "🔍 ANALIZANDO CONECTIVIDAD DEL SERVIDOR"
echo "========================================"

# Obtener IP local
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📡 IP Local actual: $LOCAL_IP"

# Verificar si el servidor está corriendo
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Servidor corriendo en puerto 3000"
else
    echo "❌ Servidor NO está corriendo en puerto 3000"
    exit 1
fi

# Probar conectividad local
echo ""
echo "🧪 PRUEBAS DE CONECTIVIDAD:"
echo "---------------------------"

# Prueba localhost
echo -n "Localhost (localhost:3000): "
if curl -s --max-time 5 http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ FALLÓ"
fi

# Prueba IP local
echo -n "IP Local ($LOCAL_IP:3000): "
if curl -s --max-time 5 http://$LOCAL_IP:3000/health > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ FALLÓ"
fi

# Información para Flutter
echo ""
echo "📱 CONFIGURACIÓN PARA FLUTTER:"
echo "------------------------------"
echo "Base URL: http://$LOCAL_IP:3000/api"
echo ""
echo "Ejemplo de uso en Flutter:"
echo "const String baseUrl = 'http://$LOCAL_IP:3000/api';"
echo ""
echo "Endpoints principales:"
echo "- Login: http://$LOCAL_IP:3000/api/auth/login"
echo "- Dashboard: http://$LOCAL_IP:3000/api/dashboard/stats"
echo "- Servicios: http://$LOCAL_IP:3000/api/services"
echo ""
echo "⚠️  NOTAS IMPORTANTES:"
echo "- Asegúrate de que tu dispositivo móvil esté en la misma red WiFi"
echo "- Si cambias de red, la IP puede cambiar - ejecuta este script nuevamente"
echo "- El servidor debe estar corriendo (npm start)"
echo ""
echo "🔄 Para refrescar la IP: ./check-connectivity.sh"