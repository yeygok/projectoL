import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useBooking,
  StepperContainer,
  ServiceSelectionStep,
  ServiceTypeStep,
  DateTimeStep,
  LocationStep,
  ConfirmationStep,
  STEPS,
} from '../components/booking';

/**
 * Componente principal para el proceso de reserva de servicios.
 * Utiliza un stepper para guiar al usuario a través de los pasos de selección.
 * @returns {JSX.Element} Página de reserva
 */
const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  // Hook personalizado para manejar el estado del booking
  const { state, actions } = useBooking(user, navigate);

  /**
   * Efecto para verificar autenticación y manejar pre-selecciones desde Home.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Manejar pre-selección desde Home
    const { categoriaPreseleccionada, tipoPreseleccionado } = location.state || {};

    if (categoriaPreseleccionada) {
      actions.setCategoria(categoriaPreseleccionada.id);
      if (activeStep === 0) {
        setActiveStep(1);
      }
    }

    if (tipoPreseleccionado) {
      actions.setTipoServicio(tipoPreseleccionado.id);
    }
  }, [isAuthenticated, navigate, location.state, actions, activeStep]);

  /**
   * Maneja el avance al siguiente paso con validación.
   */
  const handleNext = () => {
    const error = actions.validateStep(activeStep);
    if (error) {
      actions.setError(error);
      return;
    }
    actions.setError('');
    setActiveStep((prev) => prev + 1);
  };

  /**
   * Maneja el retroceso al paso anterior.
   */
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    actions.setError('');
  };

  /**
   * Renderiza el contenido del paso activo.
   * @returns {JSX.Element} Componente del paso actual
   */
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ServiceSelectionStep
            categorias={state.categorias}
            selectedCategoriaId={state.categoria_id}
            onSelect={actions.setCategoria}
          />
        );
      case 1:
        return (
          <ServiceTypeStep
            tiposServicio={state.tiposServicio}
            selectedTipoId={state.tipo_servicio_id}
            onSelect={actions.setTipoServicio}
          />
        );
      case 2:
        return (
          <DateTimeStep
            fechaServicio={state.fecha_servicio}
            onFechaChange={actions.setFecha}
          />
        );
      case 3:
        return (
          <LocationStep
            ubicacion={{
              direccion: state.direccion,
              barrio: state.barrio,
              localidad: state.localidad,
              telefono: state.telefono,
            }}
            onUbicacionChange={actions.setUbicacion}
            vehiculo={{
              modelo: state.vehiculo_modelo,
              placa: state.vehiculo_placa,
            }}
            onVehiculoChange={actions.setVehiculo}
            observaciones={state.observaciones}
            onObservacionesChange={actions.setObservaciones}
            categoriaId={state.categoria_id}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            state={state}
            calculateTotal={actions.calculateTotal}
            success={state.success}
          />
        );
      default:
        return null;
    }
  };

  // Mostrar loading inicial
  if (state.loading && state.categorias.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        py: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Agenda tu Servicio
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Sigue los pasos para completar tu reserva
          </Typography>
        </Box>

        {/* Stepper Container */}
        <StepperContainer
          steps={STEPS}
          activeStep={activeStep}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={actions.submitBooking}
          loading={state.loading}
          error={state.error}
          onErrorClose={() => actions.setError('')}
          submitLabel="Confirmar Reserva"
        >
          {renderStepContent()}
        </StepperContainer>
      </Container>
    </Box>
  );
};

export default Booking;
