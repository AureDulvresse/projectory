import { AppShell } from "@/components/global/shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTeamPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Informations de l'équipe</CardTitle>
            <CardDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle
              équipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'équipe</Label>
              <Input id="name" placeholder="Ex: Équipe Développement" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le rôle et les responsabilités de l'équipe"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de l'équipe</Label>
              <Input id="email" type="email" placeholder="equipe@example.com" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Annuler</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
              Créer l'équipe
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
