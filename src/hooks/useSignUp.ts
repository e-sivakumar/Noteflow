// src/hooks/useSignUp.ts
import { useMutation } from '@tanstack/react-query'
import { signUpApi, type SignUpPayload, type SignUpResponse } from '../api/auth'
// import { useNavigate } from 'react-router-dom'

export function useSignUp() {
//   const navigate = useNavigate()

  return useMutation<SignUpResponse, Error, SignUpPayload>({
    // ← move your API call here
    mutationFn: payload => signUpApi(payload),

    onSuccess: () => {
      // e.g. show a toast “Registered! Please log in”
    //   navigate('/login')
    return "ok"
    },

    onError: err => {
      console.error('Signup failed:', err.message)
    },
  })
}
