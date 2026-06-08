import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api-solicitud';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar redirecciones si el token expira
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o token inválido. Redirigiendo al login.');
      localStorage.removeItem('token');
      localStorage.removeItem('candidato');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // 1. AUTENTICACIÓN
  async login(cedula: string) {
    const response = await api.post('/auth/login', { cedula });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('candidato', JSON.stringify(response.data.candidato));
    }
    return response.data;
  },

  async loginEmail(email: string, password: string) {
    const response = await api.post('/auth/login-email', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('candidato', JSON.stringify(response.data.candidato));
    }
    return response.data;
  },

  async validarToken(token: string) {
    const response = await api.get(`/auth/validar-token/${token}`);
    return response.data;
  },

  async registro(token: string, email: string, password: string) {
    const response = await api.post('/auth/registro', { token, email, password });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('candidato');
  },

  getCurrentUser() {
    const cand = localStorage.getItem('candidato');
    return cand ? JSON.parse(cand) : null;
  },

  async getMe() {
    const response = await api.get('/candidatos/me');
    return response.data;
  },

  // 2. CANDIDATO (COMPLETO)
  async getCandidato(cedula: string) {
    const response = await api.get(`/candidatos/${cedula}`);
    return response.data.data;
  },

  async guardarCandidato(datos: any) {
    const response = await api.post('/candidatos', datos);
    return response.data;
  },

  // 3. DATOS FAMILIARES
  async guardarFamiliar(cedula: string, familiar: any) {
    const response = await api.post(`/candidatos/${cedula}/familiares`, familiar);
    return response.data;
  },

  async eliminarFamiliar(cedula: string, id: number) {
    const response = await api.delete(`/candidatos/${cedula}/familiares/${id}`);
    return response.data;
  },

  // 4. DATOS ACADÉMICOS
  async guardarAcademico(cedula: string, academico: any) {
    const response = await api.post(`/candidatos/${cedula}/academicos`, academico);
    return response.data;
  },

  async eliminarAcademico(cedula: string, id: number) {
    const response = await api.delete(`/candidatos/${cedula}/academicos/${id}`);
    return response.data;
  },

  // 5. EXPERIENCIA PROFESIONAL
  async guardarExperiencia(cedula: string, experiencia: any) {
    const response = await api.post(`/candidatos/${cedula}/experiencia`, experiencia);
    return response.data;
  },

  async eliminarExperiencia(cedula: string, id: number) {
    const response = await api.delete(`/candidatos/${cedula}/experiencia/${id}`);
    return response.data;
  },

  // 6. REFERENCIAS
  async guardarReferencia(cedula: string, referencia: any) {
    const response = await api.post(`/candidatos/${cedula}/referencias`, referencia);
    return response.data;
  },

  async eliminarReferencia(cedula: string, id: number) {
    const response = await api.delete(`/candidatos/${cedula}/referencias/${id}`);
    return response.data;
  },

  // 7. IDIOMAS
  async guardarIdioma(cedula: string, idioma: any) {
    const response = await api.post(`/candidatos/${cedula}/idiomas`, idioma);
    return response.data;
  },

  async eliminarIdioma(cedula: string, codIdioma: number) {
    const response = await api.delete(`/candidatos/${cedula}/idiomas/${codIdioma}`);
    return response.data;
  },

  // 8. BÚSQUEDA (ADMIN)
  async buscarCandidatos(query: string, page = 1, limit = 10) {
    const response = await api.get('/buscar', {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  // 9. CATÁLOGOS
  async getIdiomas() {
    const response = await api.get('/catalogos/idiomas');
    return response.data.data;
  },

  async getNacionalidades() {
    const response = await api.get('/catalogos/nacionalidades');
    return response.data.data;
  },

  async getNivelesAcademicos() {
    const response = await api.get('/catalogos/niveles-academicos');
    return response.data.data;
  },

  async getEstadosCiviles() {
    const response = await api.get('/catalogos/estados-civiles');
    return response.data.data;
  },

  async getTiposSangre() {
    const response = await api.get('/catalogos/tipos-sangre');
    return response.data.data;
  },
};
export default api;
