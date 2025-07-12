import { api } from "./axios";

export interface Note {
  noteId: string;
  name: string;
  folderId?: string;
  content?: string;
  updatedAt: string;
  isPinned?: boolean;
  isArchived ?:boolean;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalNotes: number;
}

export async function fetchNotes(
  id: string,
  params: {
  filter: string;
  sort: string;
  page: number;
  limit: number;
}): Promise<FetchNotesResponse> {
  return api
    .get<FetchNotesResponse>(`/note/getAll/${id}`, { params })
    .then((res) => res.data);
}

export async function fetchAllNotes(params: {
  filter: string;
  sort: string;
  page: number;
  limit: number;
}): Promise<FetchNotesResponse> {
  return api
    .get<FetchNotesResponse>("/note", { params })
    .then((res) => res.data);
}

export async function getNotes(id: string) {
  return api
    .get<Note>(`/note/get/${id}`)
    .then((res) => {
      return res.data;
    });
}

export async function searchNotes(q: string) {
  return api
    .get<Note[]>(`/note/search`, { params: { name: q } })
    .then((res) => {
      return res.data.map((f) => ({ label: f.name, value: f.noteId, folderId: f.folderId }));
    });
}

export async function searchNotesForFolder(id: string, q: string) {
  return api
    .get<Note[]>(`/note/search/${id}`, { params: { name: q } })
    .then((res) => {
      return res.data.map((f) => ({ label: f.name, value: f.noteId }));
    });
}


export async function createNoteApi(folderId: string, data: {
  name: string;
  content: string;
}) {
  return api.post<Note>(`/note/create/${folderId}`, data).then((res) => res.data);
}

export async function updateNoteApi(
  id: string,
  data: { name: string; content: string }
) {
  return api.put<Note>(`/note/update/${id}`, data).then((res) => res.data);
}

export async function ArchiveNoteApi(
  id: string
) {
  return api.put<Note>(`/note/archived/${id}`).then((res) => res.data);
}

export async function UnarchiveNoteApi(
  id: string
) {
  return api.put<Note>(`/note/unarchived/${id}`).then((res) => res.data);
}

export async function PinNoteApi(
  id: string
) {
  return api.put<Note>(`/note/pinned/${id}`).then((res) => res.data);
}

export async function UnpinNoteApi(
  id: string
) {
  return api.put<Note>(`/note/unpinned/${id}`).then((res) => res.data);
}

export async function deleteNoteApi(id: string) {
  return api.delete<void>(`/note/${id}`).then((res) => res.data);
}

// note list
export async function fetchNoteList(id: string): Promise<Note[]> {
 return api
   .get<Note[]>(`/note/list/${id}` )
   .then(res => res.data)
}