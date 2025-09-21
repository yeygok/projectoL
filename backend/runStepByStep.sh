#!/bin/bash

echo "🚀 ANÁLISIS PASO A PASO DE LA BASE DE DATOS"
echo "=========================================="
echo ""
echo "📋 PASOS DISPONIBLES:"
echo "1. npm run step1 - Probar conexión"
echo "2. npm run step2 - Listar tablas"
echo "3. npm run step3 - Analizar tablas principales"
echo "4. npm run step4 - Encontrar relaciones"
echo "5. npm run step5 - Análisis de seguridad"
echo ""
echo "💡 EJECUTA CADA PASO INDIVIDUALMENTE:"
echo "   cd backend && npm run step1"
echo "   cd backend && npm run step2"
echo "   etc..."
echo ""
echo "⚡ O ejecuta todos seguidos:"
echo "   ./runStepByStep.sh"
echo ""

read -p "¿Quieres ejecutar todos los pasos ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Ejecutando todos los pasos..."
    
    echo ""
    echo "▶️  PASO 1: Probando conexión..."
    npm run step1
    
    echo ""
    echo "▶️  PASO 2: Listando tablas..."
    npm run step2
    
    echo ""
    echo "▶️  PASO 3: Analizando tablas principales..."
    npm run step3
    
    echo ""
    echo "▶️  PASO 4: Encontrando relaciones..."
    npm run step4
    
    echo ""
    echo "▶️  PASO 5: Análisis de seguridad..."
    npm run step5
    
    echo ""
    echo "✅ ANÁLISIS COMPLETO FINALIZADO"
else
    echo "👍 Ejecuta los pasos manualmente cuando estés listo"
fi
