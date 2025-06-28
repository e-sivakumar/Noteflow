// src/hooks/folders.ts
import { useQuery, useInfiniteQuery, keepPreviousData, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import {
  fetchFolders,
  fetchFilterOptions,
  searchFolders,
  createFolderApi,
  updateFolderApi,
  deleteFolderApi,
  type Folder,
  type FilterOption,
  type FetchFoldersResponse,
  fetchFolderList,
} from '../api/folders'

// 1) LIST FOLDERS (with filter & sort)
export function useFolders(
    category: string, 
    sort: string,
    limit: number
) {
  return useInfiniteQuery<FetchFoldersResponse, Error>({
    queryKey: ['folders', { category, sort }],
    queryFn: ({pageParam = 1}) => fetchFolders({ category, sort, page: pageParam as number, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = Math.ceil(lastPage.totalFolders / limit)
      const nextPage = allPages.length + 1
      return nextPage <= maxPages ? nextPage : undefined
    },
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  })
}

// 2) FETCH FILTER OPTIONS
export function useFolderFilters() {
  return useQuery<string[], Error>({
    queryKey: ['folderFilters'],
    queryFn: fetchFilterOptions,
    staleTime: 10 * 60_000,
  })
}

// 3) SEARCH SUGGESTIONS (only when q.length ≥ 2)
export function useSearchFolders(q: string) {
  return useQuery<{ label: string; value: string }[], Error>({
    queryKey: ['searchFolders', q],
    queryFn: () => searchFolders(q),
    enabled: q.length >= 2,
  })
}

// 4) CREATE
export function useCreateFolder() {
  const qc = useQueryClient()
  return useMutation<Folder, Error, { name: string; category: string }>({
    mutationFn: createFolderApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['folders'] })
      qc.invalidateQueries({queryKey: ['folderFilters']})
    },
  })
}

// 5) UPDATE
export function useUpdateFolder() {
  const qc = useQueryClient()
  return useMutation<Folder, Error, { id: string; data: { name: string; category: string } }>({
    mutationFn: ({ id, data }) => updateFolderApi(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

// 6) DELETE
export function useDeleteFolder() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteFolderApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['folders'] })
      qc.invalidateQueries({queryKey: ['folderFilters']})
    },
  })
}

//folder list
export function useFolderList() {
    return useQuery<Folder[], Error>({
      queryKey: ['folderList'],
      queryFn: fetchFolderList,
      staleTime: 10 * 60_000,
    })
  }