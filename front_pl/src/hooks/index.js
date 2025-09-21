import { useState, useEffect } from 'react';
import { ApiError } from '../services/apiService';

// Hook personalizado para manejar llamadas a la API
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// Hook para operaciones CRUD
export const useCrud = (service) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (data) => {
    try {
      setLoading(true);
      const newItem = await service.create(data);
      setItems(prev => [...prev, newItem]);
      return { success: true, data: newItem };
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(err.message);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, data) => {
    try {
      setLoading(true);
      const updatedItem = await service.update(id, data);
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ));
      return { success: true, data: updatedItem };
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(err.message);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      await service.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(err.message);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  };
};

// Hook para formularios con validación
export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouchedState] = useState({});

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const setTouched = (name) => {
    setTouchedState(prev => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.message || `${field} es requerido`;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} no tiene el formato correcto`;
      } else if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[field] = rule.message || `${field} debe tener al menos ${rule.minLength} caracteres`;
      } else if (rule.maxLength && value && value.length > rule.maxLength) {
        newErrors[field] = rule.message || `${field} no puede tener más de ${rule.maxLength} caracteres`;
      } else if (rule.custom && value) {
        const customError = rule.custom(value, values);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  };

  const handleSubmit = (onSubmit) => (event) => {
    event.preventDefault();
    
    // Marcar todos los campos como touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouchedState(allTouched);
    
    if (validate()) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validate,
    reset,
    handleSubmit,
    isValid: Object.keys(errors).length === 0,
  };
};

// Hook para paginación
export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const reset = () => {
    setCurrentPage(1);
  };
  
  return {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export default {
  useApi,
  useCrud,
  useForm,
  usePagination,
};
