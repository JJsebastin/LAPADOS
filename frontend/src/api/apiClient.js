import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
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

// Entity API methods
export const entities = {
  User: {
    me: async () => {
      const { data } = await apiClient.get('/auth/me');
      return data;
    },
    list: async (sort = '-created_date', limit = 50) => {
      const { data } = await apiClient.get(`/users?sort=${sort}&limit=${limit}`);
      return data;
    },
    update: async (id, updates) => {
      const { data } = await apiClient.put(`/users/${id}`, updates);
      return data;
    },
  },
  
  UserProgress: {
    list: async (sort = '-total_points', limit = 50) => {
      const { data } = await apiClient.get(`/user-progress?sort=${sort}&limit=${limit}`);
      return data;
    },
    filter: async (filter, sort = '-created_date', limit = 50) => {
      const { data } = await apiClient.post('/user-progress/filter', { filter, sort, limit });
      return data;
    },
    create: async (progressData) => {
      const { data } = await apiClient.post('/user-progress', progressData);
      return data;
    },
    update: async (id, updates) => {
      const { data } = await apiClient.put(`/user-progress/${id}`, updates);
      return data;
    },
  },

  Blog: {
    list: async (sort = '-created_date', limit = 50) => {
      const { data } = await apiClient.get(`/blogs?sort=${sort}&limit=${limit}`);
      return data;
    },
    get: async (id) => {
      const { data } = await apiClient.get(`/blogs/${id}`);
      return data;
    },
    create: async (blogData) => {
      const { data } = await apiClient.post('/blogs', blogData);
      return data;
    },
    update: async (id, updates) => {
      const { data } = await apiClient.put(`/blogs/${id}`, updates);
      return data;
    },
    delete: async (id) => {
      const { data } = await apiClient.delete(`/blogs/${id}`);
      return data;
    },
  },

  Comment: {
    filter: async (filter, sort = '-created_date', limit = 50) => {
      const { data } = await apiClient.post('/comments/filter', { filter, sort, limit });
      return data;
    },
    create: async (commentData) => {
      const { data } = await apiClient.post('/comments', commentData);
      return data;
    },
  },

  Modulo: {
    list: async (sort = '-created_date', limit = 50) => {
      const { data } = await apiClient.get(`/moduloz?sort=${sort}&limit=${limit}`);
      return data;
    },
    get: async (id) => {
      const { data } = await apiClient.get(`/moduloz/${id}`);
      return data;
    },
  },

  Badge: {
    list: async (sort = '-created_date', limit = 50) => {
      const { data } = await apiClient.get(`/badges?sort=${sort}&limit=${limit}`);
      return data;
    },
  },
};

// Auth methods
export const auth = {
  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },
  
  register: async (full_name, email, password) => {
    const { data } = await apiClient.post('/auth/register', { full_name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  me: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
  
  updateMe: async (updates) => {
    const { data } = await apiClient.put('/auth/me', updates);
    return data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Integrations
export const integrations = {
  Core: {
    UploadFile: async ({ file }) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post('/integrations/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    
    InvokeLLM: async ({ prompt, add_context_from_internet, response_json_schema, file_urls }) => {
      const { data } = await apiClient.post('/integrations/invoke-llm', {
        prompt,
        add_context_from_internet,
        response_json_schema,
        file_urls,
      });
      return data;
    },
    
    SendEmail: async ({ to, subject, body, from_name }) => {
      const { data } = await apiClient.post('/integrations/send-email', {
        to,
        subject,
        body,
        from_name,
      });
      return data;
    },
  },
};

export const base44 = {
  entities,
  auth,
  integrations,
};

export default apiClient;