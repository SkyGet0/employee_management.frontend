import axios from 'axios';

const API_BASE_URL = 'https://localhost:7149/api';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: {
    rejectUnauthorized: false,
  },
});

// add token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Error 401 handling (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const employeeAPI = {
  getAll: (pageNumber = 1, pageSize = 10, department = null, searchTerm = null) =>
    api.get('/employees', {
      params: { pageNumber, pageSize, department, searchTerm },
    }),

  getById: (id) => api.get(`/employees/${id}`),

  create: (data) => api.post('/employees', data),

  update: (id, data) => api.put(`/employees/${id}`, data),

  delete: (id) => api.delete(`/employees/${id}`),

  getByDepartment: (department) => api.get(`/employees/department/${department}`),
};

export default api;
