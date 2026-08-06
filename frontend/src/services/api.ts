import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token'); localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = { login: (u: string, p: string) => api.post('/auth/login', { username: u, password: p }), register: (d: any) => api.post('/auth/register', d), me: () => api.get('/auth/me'), listUsers: () => api.get('/auth/users'), toggleUser: (id: string) => api.patch(`/auth/users/${id}/toggle-active`) };
export const regionsApi = { list: () => api.get('/regions'), create: (d: any) => api.post('/regions', d), update: (id: string, d: any) => api.put(`/regions/${id}`, d), delete: (id: string) => api.delete(`/regions/${id}`) };
export const seedsApi = { list: () => api.get('/seeds'), create: (d: any) => api.post('/seeds', d), update: (id: string, d: any) => api.put(`/seeds/${id}`, d), delete: (id: string) => api.delete(`/seeds/${id}`) };
export const cropsApi = { list: () => api.get('/crops'), create: (d: any) => api.post('/crops', d), update: (id: string, d: any) => api.put(`/crops/${id}`, d), delete: (id: string) => api.delete(`/crops/${id}`) };
export const farmsApi = { list: (rid?: string) => api.get('/farms', { params: rid ? { region_id: rid } : {} }), create: (d: any) => api.post('/farms', d), update: (id: string, d: any) => api.put(`/farms/${id}`, d), delete: (id: string) => api.delete(`/farms/${id}`) };
export const plantingsApi = { list: (fid?: string) => api.get('/plantings', { params: fid ? { farm_id: fid } : {} }), create: (d: any) => api.post('/plantings', d), update: (id: string, d: any) => api.put(`/plantings/${id}`, d), delete: (id: string) => api.delete(`/plantings/${id}`) };
export const harvestsApi = { list: (p?: any) => api.get('/harvests', { params: p }), create: (d: any) => api.post('/harvests', d), update: (id: string, d: any) => api.put(`/harvests/${id}`, d), delete: (id: string) => api.delete(`/harvests/${id}`) };
export const costsApi = { list: (p?: any) => api.get('/costs', { params: p }), create: (d: any) => api.post('/costs', d), update: (id: string, d: any) => api.put(`/costs/${id}`, d), delete: (id: string) => api.delete(`/costs/${id}`) };
export const financeApi = { summary: (fid?: string) => api.get('/finance/summary', { params: fid ? { farm_id: fid } : {} }) };
export default api;
