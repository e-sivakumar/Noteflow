// src/api/profile.ts
import { api } from './axios'
export function fetchProfile() {
  return api.get('/profile').then(res => res.data)
}
export function updateProfile(data: any) {
  return api.put('/profile', data).then(res => res.data)
}