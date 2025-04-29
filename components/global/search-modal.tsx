"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SearchModalProps {
   open: boolean
   onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
   const [searchQuery, setSearchQuery] = useState("")

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[600px] p-0">
            <div className="flex items-center border-b px-4 py-3">
               <Search className="h-4 w-4 text-muted-foreground" />
               <Input
                  placeholder="Rechercher des projets, tâches, équipes..."
                  className="border-0 shadow-none focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
               <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4" />
               </Button>
            </div>
            <ScrollArea className="h-[400px] p-4">
               {/* Résultats de recherche */}
               <div className="space-y-4">
                  {searchQuery && (
                     <div className="text-sm text-muted-foreground">
                        Résultats pour "{searchQuery}"
                     </div>
                  )}
                  {/* Ici, nous ajouterons les résultats de recherche */}
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   )
} 