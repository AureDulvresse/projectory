"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Building2, Mail } from "lucide-react"
import Link from "next/link"

// Types pour les données d'équipe
interface TeamMember {
   id: string
   name: string
   role: string
   avatar?: string
   email: string
}

interface Team {
   id: string
   name: string
   description: string
   members: TeamMember[]
   projectCount: number
}

// Données de démonstration
const demoTeams: Team[] = [
   {
      id: "1",
      name: "Équipe Développement",
      description: "Équipe principale de développement",
      projectCount: 5,
      members: [
         {
            id: "1",
            name: "Jean Dupont",
            role: "Lead Developer",
            email: "jean.dupont@example.com",
            avatar: "/avatars/jean.jpg"
         },
         {
            id: "2",
            name: "Marie Martin",
            role: "Frontend Developer",
            email: "marie.martin@example.com",
            avatar: "/avatars/marie.jpg"
         },
         {
            id: "3",
            name: "Pierre Durand",
            role: "Backend Developer",
            email: "pierre.durand@example.com",
            avatar: "/avatars/pierre.jpg"
         }
      ]
   },
   {
      id: "2",
      name: "Équipe Design",
      description: "Équipe de design et UX",
      projectCount: 3,
      members: [
         {
            id: "4",
            name: "Sophie Bernard",
            role: "UI/UX Designer",
            email: "sophie.bernard@example.com",
            avatar: "/avatars/sophie.jpg"
         },
         {
            id: "5",
            name: "Lucas Petit",
            role: "Graphic Designer",
            email: "lucas.petit@example.com",
            avatar: "/avatars/lucas.jpg"
         }
      ]
   }
]

export function TeamList() {
   return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {demoTeams.map((team) => (
            <Card key={team.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md transition-all duration-200">
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{team.name}</CardTitle>
                     </div>
                     <span className="text-sm text-muted-foreground">{team.projectCount} projets</span>
                  </div>
                  <CardDescription>{team.description}</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="flex -space-x-2">
                        {team.members.map((member) => (
                           <Avatar key={member.id} className="border-2 border-background">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                           </Avatar>
                        ))}
                     </div>
                     <div className="space-y-2">
                        {team.members.map((member) => (
                           <div key={member.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                 <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                 </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                 <Mail className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                     <Users className="mr-2 h-4 w-4" />
                     Gérer l'équipe
                  </Button>
                  <Button variant="outline" size="sm">
                     Voir les projets
                  </Button>
               </CardFooter>
            </Card>
         ))}

         <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md transition-all duration-200 border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px]">
               <Button variant="ghost" size="lg" className="h-20 w-20 rounded-full">
                  <Plus className="h-8 w-8" />
               </Button>
               <p className="mt-4 text-lg font-medium">Créer une nouvelle équipe</p>
               <p className="text-sm text-muted-foreground text-center">
                  Ajoutez une nouvelle équipe pour collaborer sur vos projets
               </p>
            </CardContent>
         </Card>
      </div>
   )
} 