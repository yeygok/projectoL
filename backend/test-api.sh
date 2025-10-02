#!/bin/bash

# 🧪 Script de Testing Automatizado - API Lavado Vapor
# Ejecutar: chmod +x test-api.sh && ./test-api.sh

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
BASE_URL="http://localhost:3000/api"
TOKEN=""
ADMIN_EMAIL="yeygok777@gmail.com"
ADMIN_PASSWORD="121212"

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Función para imprimir resultados
print_result() {
    local test_name=$1
    local status_code=$2
    local expected=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status_code" == "$expected" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name (Status: $status_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC} - $test_name (Expected: $expected, Got: $status_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Función para extraer status code
get_status_code() {
    echo "$1" | tail -n1
}

# Banner
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🧪 API Testing - Lavado Vapor Bogotá            ║${NC}"
echo -e "${BLUE}║  Fecha: $(date '+%Y-%m-%d %H:%M:%S')                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que el servidor esté corriendo
echo -e "${YELLOW}🔍 Verificando servidor...${NC}"
SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/../health)
if [ "$SERVER_STATUS" != "200" ]; then
    echo -e "${RED}❌ ERROR: Servidor no está corriendo en http://localhost:3000${NC}"
    echo -e "${YELLOW}💡 Ejecuta: cd backend && npm start${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Servidor corriendo en http://localhost:3000${NC}"
echo ""

# ============================================
# FASE 1: AUTENTICACIÓN
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  FASE 1: AUTENTICACIÓN 🔐${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

echo -e "${YELLOW}📝 Login como admin...${NC}"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

LOGIN_STATUS=$(get_status_code "$LOGIN_RESPONSE")
print_result "Login Admin" "$LOGIN_STATUS" "200"

if [ "$LOGIN_STATUS" == "200" ]; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | sed '$d' | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}❌ No se pudo extraer token de la respuesta.${NC}"
        exit 1
    fi
    echo -e "${GREEN}🔑 Token obtenido: ${TOKEN:0:20}...${NC}"
else
    echo -e "${RED}❌ No se pudo obtener token. Verifica credenciales.${NC}"
    exit 1
fi
echo ""

# ============================================
# FASE 2: CATEGORÍAS
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  FASE 2: CATEGORÍAS 📦${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Test 2.1: GET All Categorías
echo -e "${YELLOW}Test 2.1: GET All Categorías${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/categorias" -H "Authorization: Bearer $TOKEN")
STATUS=$(get_status_code "$RESPONSE")
print_result "GET /categorias" "$STATUS" "200"
echo ""

# Test 2.2: GET Categoría by ID
echo -e "${YELLOW}Test 2.2: GET Categoría by ID${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/categorias/1" -H "Authorization: Bearer $TOKEN")
STATUS=$(get_status_code "$RESPONSE")
print_result "GET /categorias/1" "$STATUS" "200"
echo ""

# Test 2.3: POST Create Categoría
echo -e "${YELLOW}Test 2.3: POST Create Categoría${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test Tapetes API","descripcion":"Categoría de prueba desde script"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST /categorias (Create)" "$STATUS" "201"

# Extraer ID de la categoría creada
if [ "$STATUS" == "201" ]; then
    CATEGORIA_ID=$(echo "$RESPONSE" | sed '$d' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
    echo -e "${GREEN}📝 Categoría creada con ID: $CATEGORIA_ID${NC}"
else
    CATEGORIA_ID=999  # ID temporal para evitar errores
    echo -e "${YELLOW}⚠️  No se pudo crear categoría, usando ID temporal${NC}"
fi
echo ""

# Test 2.4: PUT Update Categoría
echo -e "${YELLOW}Test 2.4: PUT Update Categoría${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
  "$BASE_URL/categorias/$CATEGORIA_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test Tapetes Premium","descripcion":"Categoría actualizada"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "PUT /categorias/$CATEGORIA_ID (Update)" "$STATUS" "200"
echo ""

# Test 2.5: DELETE Categoría (Soft Delete)
echo -e "${YELLOW}Test 2.5: DELETE Categoría (Soft Delete)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE \
  "$BASE_URL/categorias/$CATEGORIA_ID" \
  -H "Authorization: Bearer $TOKEN")
STATUS=$(get_status_code "$RESPONSE")
print_result "DELETE /categorias/$CATEGORIA_ID (Soft Delete)" "$STATUS" "200"
echo ""

# Test 2.6: PUT Reactivar Categoría
echo -e "${YELLOW}Test 2.6: PUT Reactivar Categoría${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
  "$BASE_URL/categorias/$CATEGORIA_ID/reactivar" \
  -H "Authorization: Bearer $TOKEN")
STATUS=$(get_status_code "$RESPONSE")
print_result "PUT /categorias/$CATEGORIA_ID/reactivar" "$STATUS" "200"
echo ""

# ============================================
# FASE 3: TIPOS DE SERVICIO
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  FASE 3: TIPOS DE SERVICIO 🎨${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Test 3.1: GET All Tipos
echo -e "${YELLOW}Test 3.1: GET All Tipos de Servicio${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/tipos-servicio")
STATUS=$(get_status_code "$RESPONSE")
print_result "GET /tipos-servicio" "$STATUS" "200"
echo ""

# Test 3.2: GET Tipo by ID
echo -e "${YELLOW}Test 3.2: GET Tipo by ID${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/tipos-servicio/1")
STATUS=$(get_status_code "$RESPONSE")
print_result "GET /tipos-servicio/1" "$STATUS" "200"
echo ""

# Test 3.3: POST Create Tipo
echo -e "${YELLOW}Test 3.3: POST Create Tipo de Servicio${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/tipos-servicio" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Express Test","descripcion":"Servicio express de prueba","multiplicador":1.5,"color":"#FF5722"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST /tipos-servicio (Create)" "$STATUS" "201"

if [ "$STATUS" == "201" ]; then
    TIPO_ID=$(echo "$RESPONSE" | sed '$d' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
    echo -e "${GREEN}📝 Tipo creado con ID: $TIPO_ID${NC}"
else
    TIPO_ID=999
    echo -e "${YELLOW}⚠️  No se pudo crear tipo, usando ID temporal${NC}"
fi
echo ""

# Test 3.4: PUT Update Tipo
echo -e "${YELLOW}Test 3.4: PUT Update Tipo de Servicio${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
  "$BASE_URL/tipos-servicio/$TIPO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Express Premium","multiplicador":2.0}')
STATUS=$(get_status_code "$RESPONSE")
print_result "PUT /tipos-servicio/$TIPO_ID (Update)" "$STATUS" "200"
echo ""

# Test 3.5: DELETE Tipo
echo -e "${YELLOW}Test 3.5: DELETE Tipo de Servicio${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE \
  "$BASE_URL/tipos-servicio/$TIPO_ID" \
  -H "Authorization: Bearer $TOKEN")
STATUS=$(get_status_code "$RESPONSE")
print_result "DELETE /tipos-servicio/$TIPO_ID (Hard Delete)" "$STATUS" "200"
echo ""

# ============================================
# FASE 4: ESTADOS DE RESERVA
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  FASE 4: ESTADOS DE RESERVA 📊${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Test 4.1: GET All Estados
echo -e "${YELLOW}Test 4.1: GET All Estados de Reserva${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/estados-reserva")
STATUS=$(get_status_code "$RESPONSE")
print_result "GET /estados-reserva" "$STATUS" "200"
echo ""

# Test 4.2: GET Estado by ID
echo -e "${YELLOW}Test 4.2: GET Estado by ID${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/estados-reserva/1")
STATUS=$(get_status_code "$RESPONSE")
print_result "GET /estados-reserva/1" "$STATUS" "200"
echo ""

# Test 4.3: GET Estadísticas
echo -e "${YELLOW}Test 4.3: GET Estadísticas de Estados${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/estados-reserva/stats/resumen")
STATUS=$(get_status_code "$RESPONSE")
print_result "GET /estados-reserva/stats/resumen" "$STATUS" "200"
echo ""

# Test 4.4: POST Create Estado
echo -e "${YELLOW}Test 4.4: POST Create Estado de Reserva${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/estados-reserva" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado":"en_camino_test","descripcion":"El técnico está en camino","color":"#17A2B8"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST /estados-reserva (Create)" "$STATUS" "201"

if [ "$STATUS" == "201" ]; then
    ESTADO_ID=$(echo "$RESPONSE" | sed '$d' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
    echo -e "${GREEN}📝 Estado creado con ID: $ESTADO_ID${NC}"
else
    ESTADO_ID=999
    echo -e "${YELLOW}⚠️  No se pudo crear estado, usando ID temporal${NC}"
fi
echo ""

# Test 4.5: PUT Update Estado
echo -e "${YELLOW}Test 4.5: PUT Update Estado de Reserva${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
  "$BASE_URL/estados-reserva/$ESTADO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado":"en_ruta_test","descripcion":"Técnico en ruta actualizado"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "PUT /estados-reserva/$ESTADO_ID (Update)" "$STATUS" "200"
echo ""

# Test 4.6: DELETE Estado
echo -e "${YELLOW}Test 4.6: DELETE Estado de Reserva${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE \
  "$BASE_URL/estados-reserva/$ESTADO_ID" \
  -H "Authorization: Bearer $TOKEN")
STATUS=$(get_status_code "$RESPONSE")
print_result "DELETE /estados-reserva/$ESTADO_ID (Hard Delete)" "$STATUS" "200"
echo ""

# ============================================
# FASE 5: TESTS DE VALIDACIÓN (ERRORES)
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  FASE 5: TESTS DE VALIDACIÓN ❌${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Test V1: Categoría sin nombre (400)
echo -e "${YELLOW}Test V1: Categoría sin nombre (debe fallar)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Test sin nombre"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST /categorias sin nombre (400)" "$STATUS" "400"
echo ""

# Test V2: Estado sin nombre (400)
echo -e "${YELLOW}Test V2: Estado sin nombre (debe fallar)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/estados-reserva" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Estado sin nombre","color":"#000000"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST /estados-reserva sin nombre (400)" "$STATUS" "400"
echo ""

# Test V3: Tipo con color inválido (400)
echo -e "${YELLOW}Test V3: Tipo con color inválido (debe fallar)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/tipos-servicio" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test Color","color":"rojo","multiplicador":1.0}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST /tipos-servicio color inválido (400)" "$STATUS" "400"
echo ""

# Test V4: Estado duplicado (409)
echo -e "${YELLOW}Test V4: Estado duplicado (debe fallar)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/estados-reserva" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado":"pendiente","descripcion":"Duplicado","color":"#FFC107"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST /estados-reserva duplicado (409)" "$STATUS" "409"
echo ""

# Test V5: Delete estado crítico (400)
echo -e "${YELLOW}Test V5: Delete estado crítico (debe fallar)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE \
  "$BASE_URL/estados-reserva/1" \
  -H "Authorization: Bearer $TOKEN")
STATUS=$(get_status_code "$RESPONSE")
print_result "DELETE estado crítico (400)" "$STATUS" "400"
echo ""

# Test V6: Acceso sin token (401)
echo -e "${YELLOW}Test V6: Acceso sin token (debe fallar)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/categorias" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test sin auth"}')
STATUS=$(get_status_code "$RESPONSE")
print_result "POST sin token (401)" "$STATUS" "401"
echo ""

# ============================================
# RESUMEN FINAL
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  📊 RESUMEN DE TESTING${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ Tests pasados: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests fallidos: $TESTS_FAILED${NC}"
echo -e "${YELLOW}📝 Total de tests: $TOTAL_TESTS${NC}"
echo ""

PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL_TESTS))
echo -e "${BLUE}Porcentaje de éxito: $PERCENTAGE%${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!       ║${NC}"
    echo -e "${GREEN}║  ✅ API funcionando correctamente                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}🚀 PRÓXIMO PASO: Crear vistas del Frontend Dashboard${NC}"
    echo ""
else
    echo -e "${RED}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ⚠️  ALGUNOS TESTS FALLARON                       ║${NC}"
    echo -e "${RED}║  Revisa los errores arriba                        ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
fi

echo -e "${BLUE}Hora de finalización: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
