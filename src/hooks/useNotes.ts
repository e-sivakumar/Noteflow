import { useQuery, useInfiniteQuery, keepPreviousData, useMutation, useQueryClient, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'
import {
  fetchNotes,
  fetchAllNotes,
  getNotes,
  searchNotes,
  searchNotesForFolder,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
  UnarchiveNoteApi,
  ArchiveNoteApi,
  PinNoteApi,
  UnpinNoteApi,
  type Note,
  type FetchNotesResponse,
  fetchNoteList,
} from '../api/notes'

type BaseOptions = Omit<
  UseQueryOptions<Note[], Error, Note[], QueryKey>,
  'queryKey' | 'queryFn'
>


export function useAllNotes(
    filter: string, 
    sort: string,
    limit: number
) {
  return useInfiniteQuery<FetchNotesResponse, Error>({
    queryKey: ['allNotes', { filter, sort }],
    queryFn: ({pageParam = 1}) => fetchAllNotes({ filter, sort, page: pageParam as number, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = Math.ceil(lastPage.totalNotes / limit)
      const nextPage = allPages.length + 1
      return nextPage <= maxPages ? nextPage : undefined
    },
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useNotes(
    id: string,
    filter: string, 
    sort: string,
    limit: number
) {
  return useInfiniteQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', { id, filter, sort }],
    queryFn: ({pageParam = 1}) => fetchNotes(id,{ filter, sort, page: pageParam as number, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = Math.ceil(lastPage.totalNotes / limit)
      const nextPage = allPages.length + 1
      return nextPage <= maxPages ? nextPage : undefined
    },
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useGetNote(id: string) {
    return useQuery<Note, Error>({
        queryKey: ['getNotes', id],
        queryFn: () => getNotes(id)
      })
}

export function useSearchNotes(id: string, q: string) {
  return useQuery<{ label: string; value: string }[], Error>({
    queryKey: ['searchNotes', q],
    queryFn: () => searchNotesForFolder(id,q),
    enabled: q.length >= 2,
  })
}

export function useSearchAllNotes(q: string) {
    return useQuery<{ label: string; value: string; folderId?: string }[], Error>({
      queryKey: ['searchNotes', q],
      queryFn: () => searchNotes(q),
      enabled: q.length >= 2,
    })
  }

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation<Note, Error, {folderId: string; data:{ name: string; content: string; }}>({
    mutationFn: ({ folderId, data }) => createNoteApi(folderId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation<Note, Error, { id: string; data: { name: string; content: string } }>({
    mutationFn: ({ id, data }) => updateNoteApi(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
      qc.invalidateQueries({ queryKey: ['allNotes'] })
      qc.invalidateQueries({ queryKey: ['getNotes'] })
    },
  })
}

export function useArchiveNote() {
    const qc = useQueryClient()
    return useMutation<Note, Error, { id: string }>({
      mutationFn: ({ id }) => ArchiveNoteApi(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['notes'] })
        qc.invalidateQueries({ queryKey: ['allNotes'] })
        qc.invalidateQueries({ queryKey: ['getNotes'] })
      },
    })
  }

export function useUnarchiveNote() {
    const qc = useQueryClient()
    return useMutation<Note, Error, { id: string }>({
        mutationFn: ({ id }) => UnarchiveNoteApi(id),
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['notes'] })
        qc.invalidateQueries({ queryKey: ['allNotes'] })
        qc.invalidateQueries({ queryKey: ['getNotes'] })
        },
    })
}

export function usePinNote() {
    const qc = useQueryClient()
    return useMutation<Note, Error, { id: string }>({
      mutationFn: ({ id }) => PinNoteApi(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['notes'] })
        qc.invalidateQueries({ queryKey: ['allNotes'] })
        qc.invalidateQueries({ queryKey: ['getNotes'] })
      },
    })
  }

export function useUnPinNote() {
    const qc = useQueryClient()
    return useMutation<Note, Error, { id: string }>({
        mutationFn: ({ id }) => UnpinNoteApi(id),
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['notes'] })
        qc.invalidateQueries({ queryKey: ['allNotes'] })
        qc.invalidateQueries({ queryKey: ['getNotes'] })
        },
    })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteNoteApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
      qc.invalidateQueries({queryKey: ['allNotes']})
    },
  })
}

//note list
export function useNoteList(id: string, options?: BaseOptions) {
    return useQuery<Note[], Error>({
      queryKey: ['noteList'],
      queryFn: ()=>fetchNoteList(id),
      ...options
    })
  }
