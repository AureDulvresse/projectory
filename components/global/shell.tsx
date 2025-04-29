"use client"

import { Sidebar } from "@/components/global/sidebar"
import { Topbar } from "@/components/global/topbar"

interface AppShellProps {
   children: React.ReactNode
   currentWorkspace?: {
      id: string
      name: string
   }
}

export const AppShell = ({ children, currentWorkspace }: AppShellProps) => {
   return (
      <div className="flex min-h-screen">
         <Sidebar currentWorkspace={currentWorkspace} />
         <div className="flex-1">
            <Topbar workspaceId={currentWorkspace?.id} />
            <main className="flex-1 p-6">
               {children}
            </main>
         </div>
      </div>
   )
} 