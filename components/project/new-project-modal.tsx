"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

// Components UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Plus,
  CalendarIcon,
  Users2,
  TagIcon,
  AlertCircle,
  Loader2
} from "lucide-react";

// Utils
import { cn } from "@/lib/utils";
import { createProject } from "@/lib/actions/project";

// Types
interface TeamMember {
  id: string;
  name: string;
  role?: string;
  image?: string;
}

interface NewProjectModalProps {
  workspaceId: string;
  trigger?: React.ReactNode;
  onProjectCreated?: (projectId: string) => void;
  teamMembers?: TeamMember[];
}

interface FormState {
  name: string;
  description: string;
  dueDate?: Date;
  priority: string;
  tags: string[];
  selectedMembers: string[];
}

interface FormErrors {
  name?: string;
  description?: string;
  general?: string;
}

export function NewProjectModal({
  workspaceId,
  trigger,
  onProjectCreated,
  teamMembers = [],
}: NewProjectModalProps) {
  // Dialog state
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    dueDate: undefined,
    priority: "normal",
    tags: [],
    selectedMembers: [],
  });

  // UI state
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [newTag, setNewTag] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus sur le champ nom quand le modal s'ouvre
  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  /**
   * Valide le formulaire avant soumission
   */
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validation du nom
    if (!formState.name.trim()) {
      errors.name = "Le nom du projet est requis";
    } else if (formState.name.trim().length < 3) {
      errors.name = "Le nom doit contenir au moins 3 caractères";
    }

    // Validation de la description (optionnelle)
    if (formState.description.trim().length > 1000) {
      errors.description = "La description ne doit pas dépasser 1000 caractères";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Gère l'ajout d'un tag
   */
  const handleAddTag = () => {
    if (newTag.trim() && !formState.tags.includes(newTag.trim())) {
      setFormState(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  /**
   * Supprime un tag spécifique
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setFormState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Ajoute ou retire un membre de l'équipe
   */
  const toggleTeamMember = (memberId: string) => {
    setFormState(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }));
  };

  /**
   * Met à jour les valeurs du formulaire
   */
  const updateFormField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Réinitialise tous les champs du formulaire
   */
  const resetForm = () => {
    setFormState({
      name: "",
      description: "",
      dueDate: undefined,
      priority: "normal",
      tags: [],
      selectedMembers: [],
    });
    setNewTag("");
    setFormErrors({});
  };

  /**
   * Gère la soumission du formulaire
   */
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const projectData = {
        name: formState.name,
        description: formState.description,
        workspaceId: workspaceId,
        dueDate: formState.dueDate,
        priority: formState.priority,
        tags: formState.tags,
        teamMembers: formState.selectedMembers,
      };

      const project = await createProject(projectData);

      if (onProjectCreated) {
        onProjectCreated(project.id);
      }

      setOpen(false);
      router.refresh();
      resetForm();
      toast.success("Projet créé avec succès");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création du projet"
      );
      setFormErrors(prev => ({
        ...prev,
        general: "Échec de la création du projet. Veuillez réessayer."
      }));
      console.error("Erreur lors de la création du projet:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Interface utilisateur du modal de création de projet
   */
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-none shadow-xl">
        <form onSubmit={onSubmit}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Créer un nouveau projet
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Définissez les détails de votre projet pour commencer à travailler
              efficacement.
            </DialogDescription>
          </DialogHeader>

          {/* Affichage d'erreur générale */}
          {formErrors.general && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center mt-4 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {formErrors.general}
            </div>
          )}

          <div className="grid gap-6 py-4">
            {/* Nom du projet */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium">
                Nom <span className="text-destructive">*</span>
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="name"
                  name="name"
                  ref={nameInputRef}
                  value={formState.name}
                  onChange={(e) => updateFormField("name", e.target.value)}
                  placeholder="Nom du projet"
                  className={cn(
                    "transition-all duration-200",
                    formErrors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {formErrors.name && (
                  <div className="flex items-center text-xs text-destructive animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    {formErrors.name}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2 font-medium">
                Description
              </Label>
              <div className="col-span-3 space-y-1">
                <Textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={(e) => updateFormField("description", e.target.value)}
                  placeholder="Description détaillée du projet"
                  className={cn(
                    "min-h-24 resize-none transition-all duration-200",
                    formErrors.description && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {formErrors.description && (
                  <div className="flex items-center text-xs text-destructive animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    {formErrors.description}
                  </div>
                )}
                <div className="text-xs text-muted-foreground text-right">
                  {formState.description.length}/1000
                </div>
              </div>
            </div>

            {/* Date d'échéance et priorité */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Échéance</Label>
              <div className="col-span-3 flex flex-wrap gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal transition-all duration-200 hover:bg-accent/50",
                        !formState.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formState.dueDate
                        ? format(formState.dueDate, "PPP", { locale: fr })
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formState.dueDate}
                      onSelect={(date) => updateFormField("dueDate", date)}
                      initialFocus
                      fromDate={new Date()}
                      className="rounded-md border shadow-lg"
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  value={formState.priority}
                  onValueChange={(value) => updateFormField("priority", value)}
                >
                  <SelectTrigger className="w-[180px] transition-all duration-200">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="transition-all duration-200 hover:bg-accent/50">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        Faible
                      </div>
                    </SelectItem>
                    <SelectItem value="normal" className="transition-all duration-200 hover:bg-accent/50">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        Normale
                      </div>
                    </SelectItem>
                    <SelectItem value="high" className="transition-all duration-200 hover:bg-accent/50">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        Haute
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent" className="transition-all duration-200 hover:bg-accent/50">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                        Urgente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2 font-medium">
                Tags
              </Label>
              <div className="col-span-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    className="flex-1 transition-all duration-200"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formState.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formState.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 transition-all duration-200 hover:bg-accent/50"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive rounded-full h-4 w-4 flex items-center justify-center transition-all duration-200"
                          onClick={() => handleRemoveTag(tag)}
                          aria-label={`Supprimer le tag ${tag}`}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Membres d'équipe */}
            {teamMembers.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2 font-medium">
                  Équipe
                </Label>
                <div className="col-span-3">
                  <ScrollArea className="h-32 border rounded-md p-2">
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className={cn(
                            "flex items-center p-2 rounded-md cursor-pointer transition-all duration-200",
                            formState.selectedMembers.includes(member.id)
                              ? "bg-primary/10 dark:bg-primary/20"
                              : "hover:bg-accent/50"
                          )}
                          onClick={() => toggleTeamMember(member.id)}
                        >
                          <div className="flex items-center flex-1 gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden transition-all duration-200">
                              {member.image ? (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <Users2 className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {member.name}
                              </p>
                              {member.role && (
                                <p className="text-xs text-muted-foreground">
                                  {member.role}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="h-4 w-4 rounded border flex items-center justify-center transition-all duration-200">
                            {formState.selectedMembers.includes(member.id) && (
                              <div className="h-2 w-2 rounded-sm bg-primary"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="transition-all duration-200 hover:scale-105"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer le projet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}