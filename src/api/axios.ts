// src/api/axios.ts
import axios from 'axios'

// baseURL could come from .env
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// attach token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// global response errors (e.g. 401 → logout)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // e.g. dispatch logout or redirect
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
