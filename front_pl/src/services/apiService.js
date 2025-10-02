// Configuración base de la API
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Clase para manejar errores de API
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Servicio base de API
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  // Obtener headers con token de autenticación
  getHeaders(customHeaders = {}, skipAuth = false) {
    const token = localStorage.getItem('token');
    const headers = {
      ...this.defaultHeaders,
      ...customHeaders,
    };

    // Solo agregar token si no se especifica skipAuth
    if (token && !skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Método fetch con configuración base
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: this.getHeaders(options.headers, options.skipAuth),
      ...options,
    };


    try {
      // Crear AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        // Manejar errores de autenticación
        if (response.status === 401) {
          this.handleUnauthorized();
        }

        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      // Intentar parsear como JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, null);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }

      // Error de red o conexión
      throw new ApiError(
        'Network error or server unavailable',
        0,
        { originalError: error.message }
      );
    }
  }

  // Manejar errores 401 (no autorizado)
  handleUnauthorized() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Métodos HTTP
  async get(endpoint, params = {}, skipAuth = false) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET', skipAuth });
  }

  async post(endpoint, data = {}, skipAuth = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth,
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Método para subir archivos
  async uploadFile(endpoint, fileData, onProgress = null) {
    const formData = new FormData();
    Object.keys(fileData).forEach(key => {
      formData.append(key, fileData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // No establecer Content-Type para FormData
        ...this.getHeaders(),
        'Content-Type': undefined,
      },
    });
  }
}

// Instancia global del servicio API
const apiService = new ApiService();

// ============================================
// SERVICIOS ESPECÍFICOS
// ============================================

// Servicio de Categorías
export const categoriaService = {
  getAll: async (skipAuth = true) => {
    const response = await apiService.get('/api/categorias-servicio', {}, skipAuth);
    // Manejar diferentes estructuras de respuesta
    return Array.isArray(response) ? response : (response.data || response);
  },
  
  getById: async (id, skipAuth = true) => {
    const response = await apiService.get(`/api/categorias-servicio/${id}`, {}, skipAuth);
    return response.data || response;
  },
  
  create: async (data) => {
    const response = await apiService.post('/api/categorias-servicio', data);
    return response.categoria || response.data || response;
  },
  
  update: async (id, data) => {
    const response = await apiService.put(`/api/categorias-servicio/${id}`, data);
    return response.data || response;
  },
  
  delete: async (id) => {
    const response = await apiService.delete(`/api/categorias-servicio/${id}`);
    return response.data || response;
  },
  
  reactivate: async (id) => {
    const response = await apiService.put(`/api/categorias-servicio/${id}/reactivar`);
    return response.data || response;
  }
};

// Servicio de Tipos de Servicio
export const tipoServicioService = {
  getAll: async (skipAuth = true) => {
    const response = await apiService.get('/api/tipos-servicio', {}, skipAuth);
    return Array.isArray(response) ? response : (response.data || response);
  },
  
  getById: async (id, skipAuth = true) => {
    const response = await apiService.get(`/api/tipos-servicio/${id}`, {}, skipAuth);
    return response.data || response;
  },
  
  create: async (data) => {
    const response = await apiService.post('/api/tipos-servicio', data);
    return response.tipo || response.data || response;
  },
  
  update: async (id, data) => {
    const response = await apiService.put(`/api/tipos-servicio/${id}`, data);
    return response.data || response;
  },
  
  delete: async (id) => {
    const response = await apiService.delete(`/api/tipos-servicio/${id}`);
    return response.data || response;
  }
};

// Servicio de Estados de Reserva
export const estadoReservaService = {
  getAll: async () => {
    const response = await apiService.get('/api/estados-reserva');
    return Array.isArray(response) ? response : (response.data || response);
  },
  
  getById: async (id) => {
    const response = await apiService.get(`/api/estados-reserva/${id}`);
    return response.data || response;
  },
  
  getEstadisticas: async () => {
    const response = await apiService.get('/api/estados-reserva/stats/resumen');
    return Array.isArray(response) ? response : (response.data || response);
  },
  
  create: async (data) => {
    const response = await apiService.post('/api/estados-reserva', data);
    return response.estado || response.data || response;
  },
  
  update: async (id, data) => {
    const response = await apiService.put(`/api/estados-reserva/${id}`, data);
    return response.data || response;
  },
  
  delete: async (id) => {
    const response = await apiService.delete(`/api/estados-reserva/${id}`);
    return response.data || response;
  }
};

export default apiService;
export { ApiError };
