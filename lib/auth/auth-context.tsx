"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User as SupabaseUser, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  points: number
  rank: string
  joinedDate: string
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const defaultContextValue: AuthContextType = {
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

function supabaseUserToUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name ?? supabaseUser.email?.split("@")[0] ?? "User",
    email: supabaseUser.email ?? "",
    phone: supabaseUser.phone,
    avatar: supabaseUser.user_metadata?.avatar_url,
    points: supabaseUser.user_metadata?.points ?? 0,
    rank: supabaseUser.user_metadata?.rank ?? "Newcomer",
    joinedDate: supabaseUser.created_at,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ? supabaseUserToUser(session.user) : null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ? supabaseUserToUser(session.user) : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (name: string, email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured")
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, rank: "Newcomer", points: 0 } },
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
