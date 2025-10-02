#!/bin/bash

echo "======================================"
echo "🧪 TEST: Rutas Públicas del Home"
echo "======================================"
echo ""

echo "1️⃣ Testeando /api/categorias-servicio..."
response=$(curl -s http://localhost:3000/api/categorias-servicio)
count=$(echo $response | grep -o '"id":' | wc -l)
echo "   ✅ Categorías encontradas: $count"
echo ""

echo "2️⃣ Testeando /api/tipos-servicio..."
response=$(curl -s http://localhost:3000/api/tipos-servicio)
count=$(echo $response | grep -o '"id":' | wc -l)
echo "   ✅ Tipos de servicio encontrados: $count"
echo ""

echo "3️⃣ Verificando que NO requiera token..."
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/categorias-servicio)
if [ "$status" = "200" ]; then
  echo "   ✅ Acceso público sin token: OK"
else
  echo "   ❌ Error: Requiere autenticación (Status: $status)"
fi
echo ""

echo "4️⃣ Estructura de una categoría:"
curl -s http://localhost:3000/api/categorias-servicio | python3 -m json.tool | head -15
echo ""

echo "5️⃣ Estructura de un tipo:"
curl -s http://localhost:3000/api/tipos-servicio | python3 -m json.tool | head -15
echo ""

echo "======================================"
echo "✅ Test completado"
echo "======================================"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Abre http://localhost:5173/"
echo "   2. Verifica que se muestren las categorías"
echo "   3. Verifica que se muestren los planes"
echo "   4. Abre DevTools Console (F12)"
echo "   5. Busca los logs: 'Categorías recibidas' y 'Tipos recibidos'"
