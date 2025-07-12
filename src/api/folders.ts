// src/api/folders.ts
import { api } from './axios'

export interface Folder {
  folderId: string
  name: string
  updatedAt: string
  category?: string
}

export interface FilterOption {
  label: string
  value: string
}

export interface FetchFoldersResponse {
    folders: Folder[]
    totalFolders: number
  }


// GET /folders?filter=&sort=
export async function fetchFolders(params: {
     category: string 
     sort: string
     page: number
     limit: number
    }): Promise<FetchFoldersResponse> {
  return api
    .get<FetchFoldersResponse>('/folder', { params })
    .then(res => res.data)
}

// folder list
export async function fetchFolderList(): Promise<Folder[]> {
 return api
   .get<Folder[]>('/folder/list')
   .then(res => res.data)
}

// GET /folders/filters
export async function fetchFilterOptions() {
  return api
    .get<string[]>('/folder/categories')
    .then(res => res.data)
}

// GET /folders/search?q=
export async function searchFolders(q: string) {
  return api
    .get<Folder[]>('/folder/search', { params: { name: q } })
    .then(res => {
      // map to SearchOption shape
      return res.data.map(f => ({ label: f.name, value: f.folderId }))
    })
}

// POST /folders
export async function createFolderApi(data: { name: string; category: string }) {
  return api.post<Folder>('/folder', data).then(res => res.data)
}

// PUT /folders/:id
export async function updateFolderApi(
  id: string,
  data: { name: string; category: string }
) {
  return api.put<Folder>(`/folder/${id}`, data).then(res => res.data)
}

// DELETE /folders/:id
export async function deleteFolderApi(id: string) {
  return api.delete<void>(`/folder/${id}`).then(res => res.data)
}

export async function getFolderName(id:string){
  return api.get<Folder>(`/folder/name/${id}`).then(res=> res.data)
}