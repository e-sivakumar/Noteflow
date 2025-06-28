import { api } from './axios'

export interface SignUpPayload {
    username: string
    password: string
    confirmPassword: string
    phoneNumber: string
    email: string
    name: string
}

export interface SignUpResponse {
    message: string
}

export interface SignInPayload {
    usernameoremail: string
    password: string
}
export interface SignInResponse {
    token: string
}

// POST /auth/signup
export async function signUpApi(payload: SignUpPayload): Promise<SignUpResponse> {
    return api.post('/auth/sign-up', payload).then(res => res.data)
  }
  
  // POST /auth/signin
  export async function signInApi(payload: SignInPayload): Promise<SignInResponse> {
    return api.post('/auth/sign-in', payload).then(res => res.data)
  }