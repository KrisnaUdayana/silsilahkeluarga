import axios from 'axios';
import type { 
  Person, 
  PersonSummary, 
  Marriage, 
  User, 
  Media, 
  Stats, 
  TreeNode,
  LoginResponse,
  PersonFormData,
  MarriageFormData,
  UserFormData,
  GalleryYear,
  GalleryYearFormData,
  GalleryEvent,
  GalleryEventFormData,
  GalleryMedia,
  GalleryMediaFormData
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ASSET_URL = API_URL.replace(/\/api\/?$/, '');

export const getAssetUrl = (path?: string | null) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;

  return `${ASSET_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  
  refresh: async () => {
    const { data } = await api.post('/auth/refresh');
    return data;
  },
};

// Person API
export const personApi = {
  getAll: async (params?: { search?: string; gender?: string }): Promise<Person[]> => {
    const { data } = await api.get<Person[]>('/persons', { params });
    return data;
  },
  
  getById: async (id: string): Promise<Person> => {
    const { data } = await api.get<Person>(`/persons/${id}`);
    return data;
  },
  
  create: async (formData: PersonFormData): Promise<Person> => {
    const { data } = await api.post<Person>('/persons', formData);
    return data;
  },
  
  update: async (id: string, formData: Partial<PersonFormData>): Promise<Person> => {
    const { data } = await api.put<Person>(`/persons/${id}`, formData);
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/persons/${id}`);
  },
  
  getTree: async (): Promise<{ nodes: TreeNode[] }> => {
    const { data } = await api.get<{ nodes: TreeNode[] }>('/persons/tree');
    return data;
  },
  
  getChildren: async (id: string): Promise<PersonSummary[]> => {
    const { data } = await api.get<PersonSummary[]>(`/persons/${id}/children`);
    return data;
  },
  
  getSiblings: async (id: string): Promise<PersonSummary[]> => {
    const { data } = await api.get<PersonSummary[]>(`/persons/${id}/siblings`);
    return data;
  },
  
  search: async (q: string): Promise<PersonSummary[]> => {
    const { data } = await api.get<PersonSummary[]>('/persons/search', { params: { q } });
    return data;
  },
};

// Marriage API
export const marriageApi = {
  getAll: async (): Promise<Marriage[]> => {
    const { data } = await api.get<Marriage[]>('/marriages');
    return data;
  },
  
  create: async (formData: MarriageFormData): Promise<Marriage> => {
    const { data } = await api.post<Marriage>('/marriages', formData);
    return data;
  },
  
  update: async (id: string, formData: Partial<MarriageFormData>): Promise<Marriage> => {
    const { data } = await api.put<Marriage>(`/marriages/${id}`, formData);
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/marriages/${id}`);
  },
};

// Media API
export const mediaApi = {
  getByPerson: async (personId: string): Promise<Media[]> => {
    const { data } = await api.get<Media[]>(`/media/${personId}`);
    return data;
  },
  
  upload: async (personId: string, file: File, caption?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personId', personId);
    if (caption) formData.append('caption', caption);
    
    const { data } = await api.post<Media>('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  
  uploadProfilePhoto: async (personId: string, file: File): Promise<{ profilePhoto: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post(`/media/profile/${personId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
  },
};

export const galleryApi = {
  getAll: async (): Promise<GalleryYear[]> => {
    const { data } = await api.get<GalleryYear[]>('/gallery');
    return data;
  },

  createYear: async (formData: GalleryYearFormData): Promise<GalleryYear> => {
    const { data } = await api.post<GalleryYear>('/gallery', formData);
    return data;
  },

  updateYear: async (id: string, formData: Partial<GalleryYearFormData>): Promise<GalleryYear> => {
    const { data } = await api.put<GalleryYear>(`/gallery/${id}`, formData);
    return data;
  },

  deleteYear: async (id: string): Promise<void> => {
    await api.delete(`/gallery/${id}`);
  },

  createEvent: async (yearId: string, formData: GalleryEventFormData): Promise<GalleryEvent> => {
    const { data } = await api.post<GalleryEvent>(`/gallery/${yearId}/events`, formData);
    return data;
  },

  updateEvent: async (eventId: string, formData: Partial<GalleryEventFormData>): Promise<GalleryEvent> => {
    const { data } = await api.put<GalleryEvent>(`/gallery/events/${eventId}`, formData);
    return data;
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    await api.delete(`/gallery/events/${eventId}`);
  },

  createMedia: async (eventId: string, formData: GalleryMediaFormData): Promise<GalleryMedia> => {
    const { data } = await api.post<GalleryMedia>(`/gallery/events/${eventId}/media`, formData);
    return data;
  },

  updateMedia: async (mediaId: string, formData: Partial<GalleryMediaFormData>): Promise<GalleryMedia> => {
    const { data } = await api.put<GalleryMedia>(`/gallery/media/${mediaId}`, formData);
    return data;
  },

  deleteMedia: async (mediaId: string): Promise<void> => {
    await api.delete(`/gallery/media/${mediaId}`);
  },
};

// User API
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },
  
  create: async (formData: UserFormData): Promise<User> => {
    const { data } = await api.post<User>('/users', formData);
    return data;
  },
  
  update: async (id: string, formData: Partial<UserFormData>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, formData);
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Stats API
export const statsApi = {
  getStats: async (): Promise<Stats> => {
    const { data } = await api.get<Stats>('/stats');
    return data;
  },
  
  getPublicStats: async (): Promise<{ totalPersons: number; totalMarriages: number }> => {
    const { data } = await api.get('/stats/public');
    return data;
  },
};

export default api;
