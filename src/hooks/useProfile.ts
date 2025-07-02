import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, updatePassword, updateUser, type User } from "../api/profile";

export function useGetUser(){
    return useQuery<User, Error>({
        queryKey: ['getUser'],
        queryFn: getUser,
        staleTime: 5 * 60_000,
        placeholderData: keepPreviousData,
    })
}

export function useUpdateUser(){
    const qc = useQueryClient();
    return useMutation<User, Error, {data:{name: string; username: string; phoneNumber:number; email: string;}}>({
        mutationFn: ({data}) => updateUser(data),
        onSuccess: ()=>{
            qc.invalidateQueries({queryKey: ['getUser']})
        }
    })
}

export function useUpdatePassword(){
    // const qc = useQueryClient();
    return useMutation<User, Error, {data:{oldPassword: string; newPassword: string}}>({
        mutationFn: ({data})=> updatePassword(data)
    })
}