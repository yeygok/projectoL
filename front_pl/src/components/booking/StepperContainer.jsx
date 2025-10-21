import React from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Button } from '../common';

/**
 * Componente genérico para manejar un stepper con navegación.
 * Permite reutilizar la lógica de navegación en diferentes flujos.
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.steps - Lista de nombres de pasos
 * @param {number} props.activeStep - Paso activo actual
 * @param {Function} props.onNext - Función para avanzar al siguiente paso
 * @param {Function} props.onBack - Función para retroceder al paso anterior
 * @param {Function} props.onSubmit - Función para confirmar/submit en el último paso
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @param {Function} props.onErrorClose - Función para cerrar el error
 * @param {React.Component} props.children - Contenido del paso actual
 * @param {string} props.submitLabel - Etiqueta del botón de submit (default: 'Confirmar')
 * @param {boolean} props.disableBack - Deshabilitar botón atrás (default: false)
 * @returns {JSX.Element} Componente del stepper
 */
export function StepperContainer({
  steps,
  activeStep,
  onNext,
  onBack,
  onSubmit,
  loading,
  error,
  onErrorClose,
  children,
  submitLabel = 'Confirmar',
  disableBack = false,
}) {
  /**
   * Maneja el clic en el botón siguiente.
   * Si es el último paso, llama a onSubmit; de lo contrario, a onNext.
   */
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <Box>
      {/* Stepper Visual */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={onErrorClose}>
          {error}
        </Alert>
      )}

      {/* Contenido del Paso Actual */}
      <Box sx={{ mb: 5 }}>
        {children}
      </Box>

      {/* Botones de Navegación */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={activeStep === 0 || loading || disableBack}
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Atrás
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            size="large"
            sx={{
              borderRadius: 2,
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              submitLabel
            ) : (
              'Siguiente'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}