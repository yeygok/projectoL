import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  Button,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  CarRepair as ServiceIcon,
  TrendingUp,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Importar componentes personalizados y servicios
import { Card, StatCard } from '../components/common';
import { dashboardService } from '../services';
import { useApi } from '../hooks';

const DashboardHome = () => {
  // Estado para mostrar última actualización
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Usar hooks personalizados para obtener datos
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useApi(() => dashboardService.getStats());

  const {
    data: recentReservas,
    loading: reservasLoading,
    error: reservasError,
    refetch: refetchReservas
  } = useApi(() => dashboardService.getRecentReservas());

  const loading = statsLoading || reservasLoading;
  const error = statsError || reservasError;

  // ⚡ ACTUALIZACIÓN AUTOMÁTICA CADA 30 SEGUNDOS
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchStats();
      refetchReservas();
      setLastUpdate(new Date());
    }, 30000); // 30 segundos

    // Cleanup: limpiar intervalo al desmontar componente
    return () => clearInterval(intervalId);
  }, [refetchStats, refetchReservas]);

  // Función para actualizar manualmente
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetchStats();
    await refetchReservas();
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'programada': return 'warning';
      case 'en proceso': return 'info';
      case 'completada': return 'success';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Cargando datos del dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Panel de Control
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bienvenido al dashboard de Lavado Vapor Bogotá
          </Typography>
        </Box>
        
        {/* Indicador de última actualización y botón refrescar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Actualización automática cada 30s
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
            </Typography>
          </Box>
          <Tooltip title="Actualizar ahora">
            <IconButton 
              color="primary" 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              sx={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => {
              refetchStats();
              refetchReservas();
            }}>
              Reintentar
            </Button>
          }
        >
          {error.message || 'Error al cargar los datos del dashboard'}
        </Alert>
      )}

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usuarios"
            value={stats?.totalUsuarios || 0}
            subtitle="Usuarios registrados"
            icon={<PeopleIcon />}
            color="primary"
            trend="up"
            trendValue="+5%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clientes Activos"
            value={stats?.totalClientes || 0}
            subtitle="Clientes en el sistema"
            icon={<PeopleIcon />}
            color="success"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reservas Hoy"
            value={stats?.reservasHoy || 0}
            subtitle="Citas programadas hoy"
            icon={<CalendarIcon />}
            color="warning"
            trend="up"
            trendValue="+8%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Servicios Activos"
            value={stats?.totalServicios || 0}
            subtitle="Servicios disponibles"
            icon={<ServiceIcon />}
            color="info"
            trend="flat"
          />
        </Grid>
      </Grid>

      {/* Estadísticas adicionales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card 
            title="Resumen de Actividad" 
            variant="elevated"
            sx={{ height: '100%' }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats?.reservasPendientes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reservas Pendientes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    ${(stats?.ingresosMes || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos del Mes
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card 
            title="Estado del Sistema" 
            variant="elevated"
            sx={{ height: '100%' }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Capacidad del servidor</Typography>
                <Typography variant="body2" color="success.main">85%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ mb: 3, height: 8, borderRadius: 4 }}
                color="success"
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Base de datos</Typography>
                <Typography variant="body2" color="info.main">92%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={92} 
                sx={{ mb: 3, height: 8, borderRadius: 4 }}
                color="info"
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Email service</Typography>
                <Typography variant="body2" color="warning.main">78%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={78} 
                sx={{ height: 8, borderRadius: 4 }}
                color="warning"
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Acciones rápidas */}
      <Card title="Acciones Rápidas" variant="elevated" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ py: 2 }}
              onClick={() => window.location.href = '/dashboard/agendamientos'}
            >
              Nueva Cita
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              fullWidth
              sx={{ py: 2 }}
              onClick={() => window.location.href = '/dashboard/clientes'}
            >
              Nuevo Cliente
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<ServiceIcon />}
              fullWidth
              sx={{ py: 2 }}
              onClick={() => window.location.href = '/dashboard/servicios'}
            >
              Gestionar Servicios
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<ViewIcon />}
              fullWidth
              sx={{ py: 2 }}
              onClick={() => window.location.href = '/dashboard/usuarios'}
            >
              Ver Usuarios
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Reservas recientes */}
      <Card 
        title="Reservas Recientes"
        variant="elevated"
        action={
          <Button 
            size="small" 
            onClick={() => window.location.href = '/dashboard/agendamientos'}
          >
            Ver todas
          </Button>
        }
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservasLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <Typography>Cargando reservas...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : reservasError ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="error" sx={{ py: 4 }}>
                      Error al cargar las reservas recientes
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : recentReservas && recentReservas.length > 0 ? (
                recentReservas.slice(0, 5).map((reserva) => (
                  <TableRow key={reserva.id_agendamiento} hover>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {reserva.cliente_nombre || 'Cliente no disponible'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {reserva.cliente_email || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>{reserva.servicio_nombre || 'Servicio no disponible'}</TableCell>
                    <TableCell>
                      {new Date(reserva.fecha_agendamiento).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={reserva.estado_orden || 'Pendiente'}
                        color={
                          reserva.estado_orden === 'Confirmada' ? 'success' :
                          reserva.estado_orden === 'Cancelada' ? 'error' : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        ${reserva.total?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No hay reservas recientes
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default DashboardHome;
