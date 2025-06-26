"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase-auth"
import { getUserProfile, createUserProfile, updateUserProfile, type UserProfile } from "@/lib/firebase-service"

interface AuthContextType {
  user: UserProfile | null
  firebaseUser: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUserData: (data: Partial<UserProfile>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)
        // Get user profile from Firestore
        try {
          let userProfile = await getUserProfile(firebaseUser.uid)

          // If no profile exists, create one
          if (!userProfile) {
            userProfile = await createUserProfile(firebaseUser.uid, firebaseUser.email || "", {})
          }

          setUser(userProfile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setFirebaseUser(null)
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // User profile will be created in the onAuthStateChanged listener
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateUserData = async (data: Partial<UserProfile>) => {
    if (!firebaseUser || !user) return

    try {
      await updateUserProfile(firebaseUser.uid, data)
      setUser({ ...user, ...data })
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!firebaseUser,
        login,
        register,
        logout,
        updateUserData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
