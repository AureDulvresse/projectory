export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "ARCHIVED" | "PLANNING" | "ON_HOLD" | "COMPLETED";
  userId: string;
  teamId: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    tasks: number;
    documents: number;
  };
}
