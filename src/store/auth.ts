import { create } from 'zustand'
import type { User } from '@/types'

function getStoredAuth(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem('lyrics_mate_token')
    const userStr = localStorage.getItem('lyrics_mate_user')
    const user = userStr ? JSON.parse(userStr) : null
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

function storeAuth(token: string, user: User) {
  localStorage.setItem('lyrics_mate_token', token)
  localStorage.setItem('lyrics_mate_user', JSON.stringify(user))
}

function clearAuth() {
  localStorage.removeItem('lyrics_mate_token')
  localStorage.removeItem('lyrics_mate_user')
}

interface AuthStore {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

const stored = getStoredAuth()

export const useAuthStore = create<AuthStore>((set) => ({
  token: stored.token,
  user: stored.user,
  setAuth: (token, user) => {
    storeAuth(token, user)
    set({ token, user })
  },
  logout: () => {
    clearAuth()
    set({ token: null, user: null })
  },
}))

export function getToken(): string | null {
  return useAuthStore.getState().token
}
