"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  points: number
  rank: string
  joinedDate: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

// Default context value for when provider is not available
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for existing session only on client
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email,
      points: 150,
      rank: "Rate Guru",
      joinedDate: "2024-01-15",
    }

    setUser(mockUser)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("user", JSON.stringify(mockUser))
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "2",
      name,
      email,
      points: 0,
      rank: "Newcomer",
      joinedDate: new Date().toISOString(),
    }

    setUser(mockUser)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("user", JSON.stringify(mockUser))
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  const signOut = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem("user")
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
