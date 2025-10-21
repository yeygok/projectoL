import { useReducer, useEffect, useCallback } from 'react';
import { categoriaService, serviceService, tipoServicioService, agendamientoService } from '../../services';

/**
 * Estado inicial del booking. Define todos los campos necesarios para el proceso de reserva.
 * Incluye datos de selección, ubicación, vehículo y estado de la UI.
 */
const initialState = {
  // Selección de servicio
  categoria_id: null,
  servicio_id: null,
  tipo_servicio_id: null,

  // Fecha y hora
  fecha_servicio: null,

  // Ubicación
  direccion: '',
  barrio: '',
  localidad: '',
  zona: 'norte',
  telefono: '',

  // Vehículo (solo si aplica)
  vehiculo_modelo: '',
  vehiculo_placa: '',

  // Observaciones
  observaciones: '',

  // Estado de carga y errores
  loading: false,
  error: '',
  success: false,

  // Datos cargados desde API
  categorias: [],
  servicios: [],
  tiposServicio: [],
};

/**
 * Acciones para el reducer. Cada acción representa un cambio específico en el estado.
 */
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  SET_CATEGORIA: 'SET_CATEGORIA',
  SET_TIPO_SERVICIO: 'SET_TIPO_SERVICIO',
  SET_FECHA: 'SET_FECHA',
  SET_UBICACION: 'SET_UBICACION',
  SET_VEHICULO: 'SET_VEHICULO',
  SET_OBSERVACIONES: 'SET_OBSERVACIONES',
  LOAD_DATA: 'LOAD_DATA',
  RESET: 'RESET',
};

/**
 * Reducer para manejar el estado del booking. Procesa acciones y actualiza el estado de manera inmutable.
 * @param {Object} state - Estado actual
 * @param {Object} action - Acción con tipo y payload
 * @returns {Object} Nuevo estado
 */
function bookingReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_SUCCESS:
      return { ...state, success: action.payload };
    case ACTIONS.SET_CATEGORIA:
      return { ...state, categoria_id: action.payload };
    case ACTIONS.SET_TIPO_SERVICIO:
      return { ...state, tipo_servicio_id: action.payload };
    case ACTIONS.SET_FECHA:
      return { ...state, fecha_servicio: action.payload };
    case ACTIONS.SET_UBICACION:
      return { ...state, ...action.payload };
    case ACTIONS.SET_VEHICULO:
      return { ...state, ...action.payload };
    case ACTIONS.SET_OBSERVACIONES:
      return { ...state, observaciones: action.payload };
    case ACTIONS.LOAD_DATA:
      return { ...state, ...action.payload, loading: false };
    case ACTIONS.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

/**
 * Hook personalizado para manejar el estado y lógica del proceso de booking.
 * Utiliza useReducer para un manejo eficiente del estado complejo.
 * @param {Object} user - Usuario autenticado
 * @param {Function} navigate - Función de navegación de React Router
 * @returns {Object} Estado y funciones para manejar el booking
 */
export function useBooking(user, navigate) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

    /**
   * Carga datos iniciales desde los servicios API.
   * Se ejecuta al montar el componente.
   */
  const loadData = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      const [categoriasData, serviciosData, tiposData] = await Promise.all([
        categoriaService.getAll(),
        serviceService.getAll(),
        tipoServicioService.getAll(),
      ]);

      dispatch({
        type: ACTIONS.LOAD_DATA,
        payload: {
          categorias: categoriasData || [],
          servicios: serviciosData || [],
          tiposServicio: tiposData || [],
          telefono: user?.telefono || '',
        },
      });
    } catch (_error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Error al cargar los datos. Por favor, recarga la página.' });
    }
  }, [user?.telefono]);

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [loadData]); // loadData es estable gracias a useCallback

  /**
   * Valida el estado actual según el paso del stepper.
   * @param {number} step - Paso actual (0-4)
   * @returns {string|null} Mensaje de error si no pasa validación, null si es válido
   */
  const validateStep = (step) => {
    switch (step) {
      case 0:
        return state.categoria_id ? null : 'Por favor, selecciona un servicio';
      case 1:
        return state.tipo_servicio_id ? null : 'Por favor, selecciona un tipo de servicio';
      case 2:
        return state.fecha_servicio ? null : 'Por favor, selecciona una fecha y hora';
      case 3:
        if (!state.direccion || !state.barrio || !state.localidad) {
          return 'Por favor, completa todos los campos de ubicación';
        }
        if (state.categoria_id === 2 && (!state.vehiculo_modelo || !state.vehiculo_placa)) {
          return 'Por favor, completa los datos del vehículo';
        }
        return null;
      default:
        return null;
    }
  };

  /**
   * Calcula el precio total basado en el tipo de servicio seleccionado.
   * @returns {number} Precio total
   */
  const calculateTotal = () => {
    const tipo = state.tiposServicio.find(t => t.id === state.tipo_servicio_id);
    if (!tipo) return 0;
    const precioBase = 80000; // Precio base configurable
    return precioBase * (tipo.multiplicador_precio || 1);
  };

  /**
   * Envía la reserva al backend.
   * Maneja errores y éxito, redirigiendo al usuario.
   */
  const submitBooking = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.SET_ERROR, payload: '' });

      const reservaData = {
        cliente_id: user.id,
        servicio_tipo_id: state.tipo_servicio_id,
        fecha_servicio: state.fecha_servicio.toISOString(),
        precio_total: calculateTotal(),
        observaciones: state.observaciones || null,
        ubicacion: {
          direccion: state.direccion,
          barrio: state.barrio,
          localidad: state.localidad,
          zona: state.zona,
        },
      };

      if (state.vehiculo_modelo && state.vehiculo_placa) {
        reservaData.vehiculo = {
          modelo: state.vehiculo_modelo,
          placa: state.vehiculo_placa,
        };
      }

      await agendamientoService.create(reservaData);

      dispatch({ type: ACTIONS.SET_SUCCESS, payload: true });
      setTimeout(() => {
        navigate('/cliente/reservas');
      }, 2000);
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message || 'Error al crear la reserva. Por favor, intenta nuevamente.' });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Funciones de acción para actualizar estado
  const setCategoria = (id) => dispatch({ type: ACTIONS.SET_CATEGORIA, payload: id });
  const setTipoServicio = (id) => dispatch({ type: ACTIONS.SET_TIPO_SERVICIO, payload: id });
  const setFecha = (fecha) => dispatch({ type: ACTIONS.SET_FECHA, payload: fecha });
  const setUbicacion = (data) => dispatch({ type: ACTIONS.SET_UBICACION, payload: data });
  const setVehiculo = (data) => dispatch({ type: ACTIONS.SET_VEHICULO, payload: data });
  const setObservaciones = (obs) => dispatch({ type: ACTIONS.SET_OBSERVACIONES, payload: obs });
  const setError = (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  return {
    state,
    actions: {
      setCategoria,
      setTipoServicio,
      setFecha,
      setUbicacion,
      setVehiculo,
      setObservaciones,
      setError,
      submitBooking,
      validateStep,
      calculateTotal,
    },
  };
}