import apiService from './apiService';

// Servicio de autenticación
export const authService = {
  async login(email, password) {
    return apiService.post('/api/auth/login', { email, password });
  },

  async register(userData) {
    return apiService.post('/api/auth/register', userData);
  },

  async logout() {
    try {
      await apiService.post('/api/auth/logout');
    } catch (error) {
      console.warn('Error al notificar logout al servidor:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async verifyToken() {
    return apiService.get('/api/auth/verify');
  },

  async forgotPassword(email) {
    return apiService.post('/api/auth/forgot-password', { email });
  },

  async resetPassword(token, password) {
    return apiService.post('/api/auth/reset-password', { token, password });
  },

  async updateProfile(profileData) {
    return apiService.put('/api/auth/profile', profileData);
  },

  async changePassword(currentPassword, newPassword) {
    return apiService.post('/api/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
  },
};

// Servicio de dashboard
export const dashboardService = {
  async getStats() {
    return apiService.get('/dashboard/stats');
  },

  async getRecentReservas() {
    return apiService.get('/dashboard/recent-reservas');
  },

  async getSystemHealth() {
    return apiService.get('/dashboard/health');
  },
};

// Servicio de agendamientos/reservas
export const agendamientoService = {
  async getAll(params = {}) {
    return apiService.get('/api/agendamiento', params);
  },

  async getById(id) {
    return apiService.get(`/api/agendamiento/${id}`);
  },

  async create(data) {
    return apiService.post('/api/agendamiento', data);
  },

  async update(id, data) {
    return apiService.put(`/api/agendamiento/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/agendamiento/${id}`);
  },

  async getMisCitas() {
    return apiService.get('/api/agendamiento/mis-citas');
  },

  async updateStatus(id, status) {
    return apiService.patch(`/api/agendamiento/${id}/status`, { status });
  },
};

// Servicio de clientes
export const clienteService = {
  async getAll(params = {}) {
    return apiService.get('/api/cliente', params);
  },

  async getById(id) {
    return apiService.get(`/api/cliente/${id}`);
  },

  async create(data) {
    return apiService.post('/api/cliente', data);
  },

  async update(id, data) {
    return apiService.put(`/api/cliente/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/cliente/${id}`);
  },

  async getConReservas() {
    return apiService.get('/api/cliente/con-reservas');
  },

  async convertirACliente(usuarioId) {
    return apiService.post('/api/cliente/convertir', { usuario_id: usuarioId });
  },
};

// Servicio de servicios
export const servicioService = {
  async getAll(params = {}) {
    return apiService.get('/api/service', params);
  },

  async getById(id) {
    return apiService.get(`/api/service/${id}`);
  },

  async create(data) {
    return apiService.post('/api/service', data);
  },

  async update(id, data) {
    return apiService.put(`/api/service/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/service/${id}`);
  },

  async getActivos() {
    return apiService.get('/api/service?activo=1');
  },
};

// Servicio de usuarios
export const usuarioService = {
  async getAll(params = {}) {
    return apiService.get('/api/usuario', params);
  },

  async getById(id) {
    return apiService.get(`/api/usuario/${id}`);
  },

  async create(data) {
    return apiService.post('/api/usuario', data);
  },

  async update(id, data) {
    return apiService.put(`/api/usuario/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/usuario/${id}`);
  },

  async updateProfile(data) {
    return apiService.put('/api/perfil', data);
  },

  async changePassword(passwordData) {
    return apiService.put('/api/usuario/password', passwordData);
  },
};

// Servicio de roles
export const rolService = {
  async getAll(params = {}) {
    return apiService.get('/api/rol', params);
  },

  async getById(id) {
    return apiService.get(`/api/rol/${id}`);
  },

  async create(data) {
    return apiService.post('/api/rol', data);
  },

  async update(id, data) {
    return apiService.put(`/api/rol/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/rol/${id}`);
  },

  async getWithUsers() {
    return apiService.get('/api/rol/with-users');
  },
};

// Servicio de permisos
export const permisoService = {
  async getAll(params = {}) {
    return apiService.get('/api/permiso', params);
  },

  async getById(id) {
    return apiService.get(`/api/permiso/${id}`);
  },

  async create(data) {
    return apiService.post('/api/permiso', data);
  },

  async update(id, data) {
    return apiService.put(`/api/permiso/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/permiso/${id}`);
  },

  async getByRole(roleId) {
    return apiService.get(`/api/rol/${roleId}/permisos`);
  },

  async assignToRole(roleId, permisoIds) {
    return apiService.post(`/api/rol-permiso`, { rol_id: roleId, permiso_ids: permisoIds });
  },
};

// Servicio de tipos de servicio
export const tipoServicioService = {
  async getAll(params = {}) {
    return apiService.get('/api/tipo_servicio', params);
  },

  async getById(id) {
    return apiService.get(`/api/tipo_servicio/${id}`);
  },

  async create(data) {
    return apiService.post('/api/tipo_servicio', data);
  },

  async update(id, data) {
    return apiService.put(`/api/tipo_servicio/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/tipo_servicio/${id}`);
  },
};
