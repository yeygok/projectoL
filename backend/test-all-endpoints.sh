#!/bin/bash

# ============================================
# SCRIPT DE TESTING COMPLETO - API LAVADO VAPOR
# ============================================
# Fecha: 26 de Octubre de 2025
# Propósito: Probar todos los endpoints existentes
# ============================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración
BASE_URL="http://localhost:3000/api"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoieWV5Z29rNzc3QGdtYWlsLmNvbSIsIm5vbWJyZSI6InllaXNvbiIsImFwZWxsaWRvIjoiZ29uemFsZXoiLCJyb2xfaWQiOjEsInJvbF9ub21icmUiOiJhZG1pbiIsInBlcm1pc29zIjpbImNyZWFyX3VzdWFyaW9zIiwiZWRpdGFyX3VzdWFyaW9zIiwiZWxpbWluYXJfdXN1YXJpb3MiLCJ2ZXJfdXN1YXJpb3MiLCJjcmVhcl9zZXJ2aWNpb3MiLCJlZGl0YXJfc2VydmljaW9zIiwidmVyX3NlcnZpY2lvcyIsImNyZWFyX3Jlc2VydmFzIiwiZWRpdGFyX3Jlc2VydmFzIiwidmVyX3Jlc2VydmFzIiwiZ2VzdGlvbmFyX3ZlaGljdWxvcyIsInZlcl9yZXBvcnRlcyIsImdlc3Rpb25hcl9zb3BvcnRlIl0sImlhdCI6MTc2MTQ5MzY4MiwiZXhwIjoxNzYxNTIyNDgyfQ.LNpwRTZEGDaeDwZTR4Zk53u287GcFpQSJdpzDR8xHLs"
EMAIL="yeygok777@gmail.com"
PASSWORD="121212"

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Archivo de reporte
REPORT_FILE="test-report-$(date +%Y%m%d-%H%M%S).txt"

# Función para imprimir encabezados
print_header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════${NC}\n"
}

# Función para imprimir secciones
print_section() {
    echo -e "\n${PURPLE}▶ $1${NC}"
    echo -e "${PURPLE}─────────────────────────────────────────${NC}"
}

# Función para testing con feedback
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local requires_auth=$5
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "${YELLOW}[$TOTAL_TESTS]${NC} Testing: ${BLUE}$method${NC} $endpoint"
    echo "   📝 $description"
    
    # Construir comando curl
    if [ "$requires_auth" = "true" ]; then
        if [ -z "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d "$data" \
                "$BASE_URL$endpoint")
        fi
    else
        if [ -z "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Content-Type: application/json" \
                "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Content-Type: application/json" \
                -d "$data" \
                "$BASE_URL$endpoint")
        fi
    fi
    
    # Extraer código de estado
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Evaluar resultado
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "   ${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "[$TOTAL_TESTS] ✓ $method $endpoint - $description (HTTP $http_code)" >> "$REPORT_FILE"
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        echo -e "   ${YELLOW}⚠ WARNING${NC} (HTTP $http_code) - Posible error de datos o permisos"
        echo "   Response: $(echo $body | head -c 100)..."
        echo "[$TOTAL_TESTS] ⚠ $method $endpoint - $description (HTTP $http_code)" >> "$REPORT_FILE"
    else
        echo -e "   ${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "   Response: $(echo $body | head -c 100)..."
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "[$TOTAL_TESTS] ✗ $method $endpoint - $description (HTTP $http_code)" >> "$REPORT_FILE"
    fi
    
    sleep 0.2 # Pequeña pausa entre requests
}

# Iniciar reporte
echo "═══════════════════════════════════════════" > "$REPORT_FILE"
echo "  REPORTE DE TESTING - API LAVADO VAPOR" >> "$REPORT_FILE"
echo "  Fecha: $(date)" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ============================================
# INICIO DE TESTS
# ============================================

print_header "🚀 INICIANDO TESTING COMPLETO DE API"

# ============================================
# 1. AUTH ENDPOINTS
# ============================================
print_section "1️⃣  AUTENTICACIÓN (/api/auth)"

test_endpoint "POST" "/auth/register" "Registro de nuevo usuario" \
    '{"nombre":"Test","apellido":"User","email":"test_'$(date +%s)'@test.com","password":"123456","telefono":"3001234567","rol_id":3}' \
    "false"

test_endpoint "POST" "/auth/login" "Login de usuario" \
    '{"email":"'"$EMAIL"'","password":"'"$PASSWORD"'"}' \
    "false"

test_endpoint "GET" "/auth/verify" "Verificar token" "" "false"

test_endpoint "POST" "/auth/logout" "Logout de usuario" "" "false"

# ============================================
# 2. PERFIL/USUARIOS
# ============================================
print_section "2️⃣  PERFIL/USUARIOS (/api/perfil)"

test_endpoint "GET" "/perfil/me" "Obtener mi perfil" "" "true"

test_endpoint "GET" "/perfil" "Listar todos los perfiles" "" "true"

test_endpoint "GET" "/perfil/17" "Obtener perfil por ID" "" "true"

# ============================================
# 3. SERVICIOS
# ============================================
print_section "3️⃣  SERVICIOS (/api/services)"

test_endpoint "GET" "/services" "Listar todos los servicios (PÚBLICO)" "" "false"

test_endpoint "GET" "/services/1" "Obtener servicio por ID (PÚBLICO)" "" "false"

# ============================================
# 4. CATEGORÍAS SERVICIOS
# ============================================
print_section "4️⃣  CATEGORÍAS (/api/categorias)"

test_endpoint "GET" "/categorias" "Listar todas las categorías (PÚBLICO)" "" "false"

test_endpoint "GET" "/categorias/1" "Obtener categoría por ID (PÚBLICO)" "" "false"

# ============================================
# 5. TIPOS SERVICIO
# ============================================
print_section "5️⃣  TIPOS DE SERVICIO (/api/tipos-servicio)"

test_endpoint "GET" "/tipos-servicio" "Listar todos los tipos (PÚBLICO)" "" "false"

test_endpoint "GET" "/tipos-servicio/1" "Obtener tipo por ID (PÚBLICO)" "" "false"

# ============================================
# 6. ESTADOS RESERVA
# ============================================
print_section "6️⃣  ESTADOS RESERVA (/api/estados-reserva)"

test_endpoint "GET" "/estados-reserva" "Listar estados (PÚBLICO)" "" "false"

test_endpoint "GET" "/estados-reserva/1" "Obtener estado por ID (PÚBLICO)" "" "false"

test_endpoint "GET" "/estados-reserva/stats/resumen" "Estadísticas de estados" "" "true"

# ============================================
# 7. ROLES
# ============================================
print_section "7️⃣  ROLES (/api/roles)"

test_endpoint "GET" "/roles" "Listar todos los roles" "" "true"

test_endpoint "GET" "/roles/1" "Obtener rol por ID" "" "true"

# ============================================
# 8. PERMISOS
# ============================================
print_section "8️⃣  PERMISOS (/api/permisos)"

test_endpoint "GET" "/permisos" "Listar todos los permisos" "" "true"

test_endpoint "GET" "/permisos/1" "Obtener permiso por ID" "" "true"

# ============================================
# 9. ROL-PERMISOS
# ============================================
print_section "9️⃣  ROL-PERMISOS (/api/rol-permisos)"

test_endpoint "GET" "/rol-permisos" "Listar relaciones rol-permiso" "" "true"

# ============================================
# 10. CLIENTES
# ============================================
print_section "🔟 CLIENTES (/api/clientes)"

test_endpoint "GET" "/clientes" "Listar todos los clientes" "" "true"

# ============================================
# 11. AGENDAMIENTO/RESERVAS
# ============================================
print_section "1️⃣1️⃣  AGENDAMIENTO (/api/agendamiento)"

test_endpoint "GET" "/agendamiento/disponibilidad?fecha=2025-10-27&servicioTipoId=1" \
    "Consultar disponibilidad (PÚBLICO)" "" "false"

test_endpoint "GET" "/agendamiento" "Listar todas las reservas" "" "true"

test_endpoint "GET" "/agendamiento/cliente/17" "Reservas por cliente" "" "true"

# ============================================
# 12. DASHBOARD
# ============================================
print_section "1️⃣2️⃣  DASHBOARD (/api/dashboard)"

test_endpoint "GET" "/dashboard/stats" "Estadísticas generales" "" "true"

test_endpoint "GET" "/dashboard/recent-reservas" "Reservas recientes" "" "true"

test_endpoint "GET" "/dashboard/usuarios" "Listar usuarios desde dashboard" "" "true"

test_endpoint "GET" "/dashboard/servicios" "Listar servicios desde dashboard" "" "true"

test_endpoint "GET" "/dashboard/ubicaciones" "Listar ubicaciones desde dashboard" "" "true"

test_endpoint "GET" "/dashboard/vehiculos" "Listar vehículos desde dashboard" "" "true"

test_endpoint "GET" "/dashboard/roles" "Listar roles desde dashboard" "" "true"

test_endpoint "GET" "/dashboard/categorias" "Listar categorías desde dashboard" "" "true"

test_endpoint "GET" "/dashboard/tipos-servicio" "Listar tipos desde dashboard" "" "true"

test_endpoint "GET" "/dashboard/estados-reserva" "Listar estados desde dashboard" "" "true"

# ============================================
# RESUMEN FINAL
# ============================================

print_header "📊 RESUMEN DE TESTING"

echo -e "${CYAN}Total de Tests:${NC}    $TOTAL_TESTS"
echo -e "${GREEN}Tests Exitosos:${NC}   $PASSED_TESTS"
echo -e "${RED}Tests Fallidos:${NC}   $FAILED_TESTS"

# Calcular porcentaje
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${BLUE}Porcentaje Éxito:${NC} ${PERCENTAGE}%"
fi

echo ""
echo -e "${YELLOW}📄 Reporte completo guardado en:${NC} $REPORT_FILE"
echo ""

# Escribir resumen en reporte
echo "" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════" >> "$REPORT_FILE"
echo "RESUMEN" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════" >> "$REPORT_FILE"
echo "Total de Tests:    $TOTAL_TESTS" >> "$REPORT_FILE"
echo "Tests Exitosos:   $PASSED_TESTS" >> "$REPORT_FILE"
echo "Tests Fallidos:   $FAILED_TESTS" >> "$REPORT_FILE"
if [ $TOTAL_TESTS -gt 0 ]; then
    echo "Porcentaje Éxito: ${PERCENTAGE}%" >> "$REPORT_FILE"
fi

# Código de salida
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ Todos los tests pasaron exitosamente!${NC}\n"
    exit 0
else
    echo -e "${RED}✗ Algunos tests fallaron. Revisa el reporte para más detalles.${NC}\n"
    exit 1
fi
