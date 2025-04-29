import { z } from "zod";

export const inviteSchema = z.object({
    email: z.string().email("Email invalide"),
    role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

export const createWorkspaceSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    description: z.string().optional(),
});