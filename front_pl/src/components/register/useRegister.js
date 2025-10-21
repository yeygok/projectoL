import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateField, validateForm } from './registerUtils';

/**
 * Hook personalizado para manejar el estado y lógica del formulario de registro.
 * @returns {Object} Estado y funciones del formulario de registro
 */
export function useRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  // Estado de UI
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldValid, setFieldValid] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  /**
   * Actualiza un campo del formulario y valida en tiempo real.
   * @param {string} field - Nombre del campo
   * @param {string} value - Nuevo valor
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (error) setError('');

    // Validar campo en tiempo real
    const result = validateField(field, value, { ...formData, [field]: value });
    setFieldErrors(prev => ({
      ...prev,
      [field]: result.error
    }));
    setFieldValid(prev => ({
      ...prev,
      [field]: result.isValid
    }));
  }, [formData, error]);

  /**
   * Maneja el cambio de un campo del formulario.
   * @param {string} field - Nombre del campo
   * @returns {Function} Handler para onChange
   */
  const handleInputChange = useCallback((field) => (event) => {
    updateField(field, event.target.value);
  }, [updateField]);

  /**
   * Alterna la visibilidad de la contraseña.
   * @param {string} field - Campo de contraseña ('password' o 'confirmPassword')
   */
  const togglePasswordVisibility = useCallback((field) => () => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  }, []);

  /**
   * Maneja el envío del formulario de registro.
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    // Validar formulario completo
    const validation = validateForm(formData, acceptTerms);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError(validation.generalError);
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para registro
      const registerData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.replace(/\s/g, ''),
        password: formData.password,
        rol_id: 2 // Cliente
      };

      const result = await register(registerData);

      if (result.success) {
        // Redirigir según contexto
        const from = location.state?.from;
        const categoriaPreseleccionada = location.state?.categoriaPreseleccionada;

        if (from === '/cliente/reservar' && categoriaPreseleccionada) {
          navigate('/cliente/reservar', {
            state: { categoriaPreseleccionada },
            replace: true
          });
        } else {
          navigate('/', {
            state: {
              welcomeMessage: `¡Bienvenido ${formData.nombre}! Tu cuenta ha sido creada exitosamente.`
            },
            replace: true
          });
        }
      } else {
        setError(result.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error al registrar usuario. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [formData, acceptTerms, register, location.state, navigate]);

  /**
   * Cancela el registro y redirige al home.
   */
  const handleCancel = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  /**
   * Navega al login manteniendo el estado.
   */
  const goToLogin = useCallback(() => {
    navigate('/login', { state: location.state });
  }, [navigate, location.state]);

  // Mostrar formulario con animación al montar
  useState(() => {
    setShowForm(true);
  });

  return {
    // Estado del formulario
    formData,
    fieldErrors,
    fieldValid,
    showPassword,
    showConfirmPassword,
    acceptTerms,
    error,
    loading,
    showForm,

    // Handlers
    handleInputChange,
    togglePasswordVisibility,
    setAcceptTerms,
    handleSubmit,
    handleCancel,
    goToLogin,
  };
}