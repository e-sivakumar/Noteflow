// src/hooks/useSignIn.ts
import { useMutation } from '@tanstack/react-query'
import { signInApi, type SignInPayload, type SignInResponse } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export function useSignIn() {
  const { login } = useAuth()

  return useMutation<SignInResponse, Error, SignInPayload>({
    mutationFn: creds => signInApi(creds),

    onSuccess: data => {
      login(data.token)
    },

    onError: err => {
      console.error('Login failed:', err.message)
    },
  })
}
