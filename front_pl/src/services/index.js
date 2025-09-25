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
    return apiService.get('/api/clientes', params);
  },

  async getById(id) {
    return apiService.get(`/api/clientes/${id}`);
  },

  async create(data) {
    return apiService.post('/api/clientes', data);
  },

  async update(id, data) {
    return apiService.put(`/api/clientes/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/clientes/${id}`);
  },

  async getConReservas() {
    return apiService.get('/api/clientes/con-reservas');
  },

  async convertirACliente(usuarioId) {
    return apiService.post('/api/clientes/convertir', { usuario_id: usuarioId });
  },
};

// Servicio de servicios
export const servicioService = {
  async getAll(params = {}) {
    return apiService.get('/api/services', params);
  },

  async getById(id) {
    return apiService.get(`/api/services/${id}`);
  },

  async create(data) {
    return apiService.post('/api/services', data);
  },

  async update(id, data) {
    return apiService.put(`/api/services/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/services/${id}`);
  },

  async getActivos() {
    return apiService.get('/api/services?activo=1');
  },
};

// Alias para mantener compatibilidad
export const serviceService = servicioService;

// Servicio de productos (usa servicios por ahora hasta crear la ruta)
export const productService = {
  async getAll(params = {}) {
    return apiService.get('/api/services', params);
  },

  async getById(id) {
    return apiService.get(`/api/services/${id}`);
  },

  async create(data) {
    return apiService.post('/api/services', data);
  },

  async update(id, data) {
    return apiService.put(`/api/services/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/services/${id}`);
  },

  async getActivos() {
    return apiService.get('/api/services?activo=1');
  },
};

// Servicio de tipos de documento (mock temporal)
export const tipoDocumentoService = {
  async getAll(params = {}) {
    // Mock data temporal hasta crear la ruta
    return [
      { id_tipo_documento: 1, nombre_tipo_documento: 'Cédula' },
      { id_tipo_documento: 2, nombre_tipo_documento: 'Pasaporte' },
      { id_tipo_documento: 3, nombre_tipo_documento: 'Tarjeta de identidad' }
    ];
  },

  async getById(id) {
    return { id_tipo_documento: id, nombre_tipo_documento: 'Documento' };
  },

  async create(data) {
    return { ...data, id_tipo_documento: Date.now() };
  },

  async update(id, data) {
    return { ...data, id_tipo_documento: id };
  },

  async delete(id) {
    return { success: true };
  },
};

// Servicio de tipos de servicio
export const tipoServicioService = {
  async getAll(params = {}) {
    return apiService.get('/api/tipos-servicio', params);
  },

  async getById(id) {
    return apiService.get(`/api/tipos-servicio/${id}`);
  },

  async create(data) {
    return apiService.post('/api/tipos-servicio', data);
  },

  async update(id, data) {
    return apiService.put(`/api/tipos-servicio/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/tipos-servicio/${id}`);
  },
};

// Servicio de usuarios
export const usuarioService = {
  async getAll(params = {}) {
    return apiService.get('/api/dashboard/usuarios', params);
  },

  async getById(id) {
    return apiService.get(`/api/dashboard/usuarios/${id}`);
  },

  async create(data) {
    return apiService.post('/api/dashboard/usuarios', data);
  },

  async update(id, data) {
    return apiService.put(`/api/dashboard/usuarios/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/dashboard/usuarios/${id}`);
  },

  async updateProfile(data) {
    return apiService.put('/api/perfiles', data);
  },

  async changePassword(passwordData) {
    return apiService.put('/api/dashboard/usuarios/password', passwordData);
  },
};

// Alias para mantener compatibilidad
export const userService = usuarioService;

// Servicio de estados de usuario (mock temporal)
export const estadoUsuarioService = {
  async getAll(params = {}) {
    // Mock data temporal hasta crear la ruta
    return [
      { id_estado_usuario: 1, nombre_estado: 'Activo' },
      { id_estado_usuario: 2, nombre_estado: 'Inactivo' },
      { id_estado_usuario: 3, nombre_estado: 'Suspendido' },
      { id_estado_usuario: 4, nombre_estado: 'Bloqueado' }
    ];
  },

  async getById(id) {
    return { id_estado_usuario: id, nombre_estado: 'Estado' };
  },

  async create(data) {
    return { ...data, id_estado_usuario: Date.now() };
  },

  async update(id, data) {
    return { ...data, id_estado_usuario: id };
  },

  async delete(id) {
    return { success: true };
  },
};

// Servicio de roles
export const rolService = {
  async getAll(params = {}) {
    return apiService.get('/api/roles', params);
  },

  async getById(id) {
    return apiService.get(`/api/roles/${id}`);
  },

  async create(data) {
    return apiService.post('/api/roles', data);
  },

  async update(id, data) {
    return apiService.put(`/api/roles/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/roles/${id}`);
  },

  async getWithUsers() {
    return apiService.get('/api/roles/with-users');
  },
};

// Servicio de permisos
export const permisoService = {
  async getAll(params = {}) {
    return apiService.get('/api/permisos', params);
  },

  async getById(id) {
    return apiService.get(`/api/permisos/${id}`);
  },

  async create(data) {
    return apiService.post('/api/permisos', data);
  },

  async update(id, data) {
    return apiService.put(`/api/permisos/${id}`, data);
  },

  async delete(id) {
    return apiService.delete(`/api/permisos/${id}`);
  },

  async getByRole(roleId) {
    return apiService.get(`/api/roles/${roleId}/permisos`);
  },

  async assignToRole(roleId, permisoIds) {
    return apiService.post(`/api/rol-permisos`, { rol_id: roleId, permiso_ids: permisoIds });
  },
};
