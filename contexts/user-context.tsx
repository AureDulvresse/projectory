"use client"

import { createContext, useContext, ReactNode } from "react"
import { Session } from "next-auth"

interface UserContextType {
   session: Session | null
   isAuthenticated: boolean
   isLoading: boolean
   user: Session["user"] | null
   hasRole: (role: string) => boolean
   hasSubscription: () => boolean
}

const UserContext = createContext<UserContextType>({
   session: null,
   isAuthenticated: false,
   isLoading: true,
   user: null,
   hasRole: () => false,
   hasSubscription: () => false,
})

export function useUser() {
   const context = useContext(UserContext)
   if (!context) {
      throw new Error("useUser doit être utilisé à l'intérieur d'un UserProvider")
   }
   return context
}

interface UserProviderProps {
   children: ReactNode
   session: Session | null
   isLoading?: boolean
}

export function UserProvider({
   children,
   session,
   isLoading = false
}: UserProviderProps) {
   const user = session?.user ?? null

   const hasRole = (role: string): boolean => {
      if (!user) return false
      return user.role === role
   }

   const hasSubscription = (): boolean => {
      if (!user) return false
      return user.subscription?.status === "active"
   }

   const value = {
      session,
      isAuthenticated: !!session?.user,
      isLoading,
      user,
      hasRole,
      hasSubscription,
   }

   return (
      <UserContext.Provider value={value}>
         {children}
      </UserContext.Provider>
   )
} 