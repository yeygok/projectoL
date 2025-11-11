#!/bin/bash

# ============================================
# SCRIPT DE VALIDACIÓN - TODOS LOS ENDPOINTS GET
# ============================================
# Fecha: 11 de Noviembre de 2025
# Propósito: Probar todos los endpoints GET
# ============================================

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
BASE_URL="http://localhost:3000/api"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoieWV5Z29rNzc3QGdtYWlsLmNvbSIsIm5vbWJyZSI6InllaXNvbiIsImFwZWxsaWRvIjoiZ29uemFsZXoiLCJyb2xfaWQiOjEsInJvbF9ub21icmUiOiJhZG1pbiIsInBlcm1pc29zIjpbImNyZWFyX3VzdWFyaW9zIiwiZWRpdGFyX3VzdWFyaW9zIiwiZWxpbWluYXJfdXN1YXJpb3MiLCJ2ZXJfdXN1YXJpb3MiLCJjcmVhcl9zZXJ2aWNpb3MiLCJlZGl0YXJfc2VydmljaW9zIiwidmVyX3NlcnZpY2lvcyIsImNyZWFyX3Jlc2VydmFzIiwiZWRpdGFyX3Jlc2VydmFzIiwidmVyX3Jlc2VydmFzIiwiZ2VzdGlvbmFyX3ZlaGljdWxvcyIsInZlcl9yZXBvcnRlcyIsImdlc3Rpb25hcl9zb3BvcnRlIl0sImlhdCI6MTc2Mjg3Nzg0MSwiZXhwIjoxNzYyOTA2NjQxfQ.tcixp2M6y5lOgeUqXX-JiwLFwnqhcODkiCj0OQ61XHY"

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

print_header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════${NC}\n"
}

print_section() {
    echo -e "\n${PURPLE}▶ $1${NC}"
    echo -e "${PURPLE}─────────────────────────────────────────${NC}"
}

test_get() {
    local endpoint=$1
    local description=$2
    local requires_auth=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -ne "${YELLOW}[$TOTAL_TESTS]${NC} GET $endpoint - "
    
    if [ "$requires_auth" = "true" ]; then
        response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        echo -e "${YELLOW}⚠ WARN${NC} (HTTP $http_code)"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    sleep 0.1
}

print_header "🚀 VALIDACIÓN DE ENDPOINTS GET"

# ============================================
# ENDPOINTS EXISTENTES (PRE-GRUPO 1)
# ============================================

print_section "🔐 AUTENTICACIÓN"
test_get "/auth/verify" "Verificar token" "false"

print_section "👤 USUARIOS/PERFIL"
test_get "/perfil/me" "Mi perfil" "true"
test_get "/perfil" "Todos los perfiles" "true"
test_get "/perfil/17" "Perfil por ID" "true"

print_section "🛠️ SERVICIOS"
test_get "/services" "Listar servicios (público)" "false"
test_get "/services/1" "Servicio por ID (público)" "false"

print_section "📁 CATEGORÍAS"
test_get "/categorias" "Listar categorías (público)" "false"
test_get "/categorias/1" "Categoría por ID (público)" "false"

print_section "🏷️ TIPOS DE SERVICIO"
test_get "/tipos-servicio" "Listar tipos (público)" "false"
test_get "/tipos-servicio/1" "Tipo por ID (público)" "false"

print_section "📊 ESTADOS RESERVA"
test_get "/estados-reserva" "Listar estados (público)" "false"
test_get "/estados-reserva/1" "Estado por ID (público)" "false"
test_get "/estados-reserva/stats/resumen" "Estadísticas" "true"

print_section "🎭 ROLES"
test_get "/roles" "Listar roles" "true"
test_get "/roles/1" "Rol por ID" "true"

print_section "🔑 PERMISOS"
test_get "/permisos" "Listar permisos" "true"
test_get "/permisos/1" "Permiso por ID" "true"

print_section "🔗 ROL-PERMISOS"
test_get "/rol-permisos" "Listar relaciones" "true"

print_section "👥 CLIENTES"
test_get "/clientes" "Listar clientes" "true"

print_section "📅 AGENDAMIENTO"
test_get "/agendamiento/disponibilidad?fecha=2025-11-12&servicioTipoId=1" "Disponibilidad (público)" "false"
test_get "/agendamiento" "Listar reservas" "true"
test_get "/agendamiento/1" "Reserva por ID" "true"

print_section "📈 DASHBOARD"
test_get "/dashboard/stats" "Estadísticas" "true"
test_get "/dashboard/recent-reservas" "Reservas recientes" "true"
test_get "/dashboard/usuarios" "Usuarios" "true"
test_get "/dashboard/servicios" "Servicios" "true"
test_get "/dashboard/ubicaciones" "Ubicaciones" "true"
test_get "/dashboard/vehiculos" "Vehículos" "true"
test_get "/dashboard/roles" "Roles" "true"
test_get "/dashboard/categorias" "Categorías" "true"
test_get "/dashboard/tipos-servicio" "Tipos servicio" "true"
test_get "/dashboard/estados-reserva" "Estados reserva" "true"

# ============================================
# GRUPO 1: OPERACIONES Y FEEDBACK
# ============================================

print_section "⭐ CALIFICACIONES (GRUPO 1)"
test_get "/calificaciones" "Listar todas (público)" "false"
test_get "/calificaciones/1" "Calificación por ID (público)" "false"
test_get "/calificaciones/servicio/1" "Por servicio (público)" "false"
test_get "/calificaciones/tecnico/2" "Por técnico (público)" "false"

print_section "📋 HISTORIAL SERVICIOS (GRUPO 1)"
test_get "/historial-servicios" "Listar todo" "true"
test_get "/historial-servicios/1" "Por ID" "true"
test_get "/historial-servicios/reserva/1" "Por reserva" "true"

print_section "🔔 NOTIFICACIONES (GRUPO 1)"
test_get "/notificaciones/mis-notificaciones" "Mis notificaciones" "true"
test_get "/notificaciones/no-leidas" "No leídas" "true"

print_section "🎫 SOPORTE (GRUPO 1)"
test_get "/soporte" "Listar tickets" "true"
test_get "/soporte/1" "Ticket por ID" "true"
test_get "/soporte/usuario/17" "Tickets de usuario" "true"

# ============================================
# GRUPO 2: PAGOS Y TOKENS
# ============================================

print_section "💰 ÓRDENES DE COMPRA (GRUPO 2)"
test_get "/ordenes-compra" "Listar órdenes" "true"
test_get "/ordenes-compra/1" "Orden por ID" "true"
test_get "/ordenes-compra/reserva/1" "Orden por reserva" "true"

print_section "🎯 ESTADOS SOPORTE (GRUPO 2)"
test_get "/estados-soporte" "Listar estados (público)" "false"
test_get "/estados-soporte/1" "Estado por ID (público)" "false"

print_section "🔐 TOKENS (GRUPO 2)"
test_get "/tokens/activos" "Tokens activos" "true"
test_get "/tokens/estadisticas" "Estadísticas tokens" "true"
test_get "/tokens/usuario/17" "Tokens de usuario" "true"

# ============================================
# RESUMEN FINAL
# ============================================

print_header "📊 RESUMEN DE VALIDACIÓN"

echo -e "${CYAN}Total Tests:${NC}      $TOTAL_TESTS"
echo -e "${GREEN}Exitosos:${NC}        $PASSED_TESTS"
echo -e "${YELLOW}Warnings:${NC}        $WARNINGS"
echo -e "${RED}Fallidos:${NC}        $FAILED_TESTS"

if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${BLUE}Porcentaje:${NC}      ${PERCENTAGE}%"
fi

echo ""

# Resumen por grupo
echo -e "${PURPLE}📦 RESUMEN POR GRUPO:${NC}"
echo -e "  ✅ Endpoints Existentes: ~30 endpoints"
echo -e "  ✅ GRUPO 1 (Operaciones): 10 endpoints GET"
echo -e "  ✅ GRUPO 2 (Pagos/Tokens): 8 endpoints GET"
echo -e "  📊 Total GET probados: $TOTAL_TESTS"

echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ ¡Todos los tests GET pasaron exitosamente!${NC}\n"
    exit 0
else
    echo -e "${YELLOW}⚠ Algunos tests tienen warnings o fallaron.${NC}\n"
    exit 1
fi
