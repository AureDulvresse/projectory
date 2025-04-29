import {
  User,
  Tenant,
  Subscription,
  Workspace,
  Project,
  Task,
  Team,
  Document,
  File,
  Activity,
  Notification,
  Comment,
  Invitation,
  Tag,
} from "@prisma/client";

// Types pour les relations étendues
export interface UserWithRelations extends User {
  tenants: Tenant[];
  subscription?: Subscription;
  ownedWorkspaces: Workspace[];
  memberWorkspaces: WorkspaceMember[];
  teams: TeamMember[];
  createdTeams: Team[];
  projects: Project[];
  tasks: Task[];
  subtasks: Subtask[];
  activities: Activity[];
  notifications: Notification[];
  comments: Comment[];
  uploadedFiles: File[];
}

export interface TenantWithRelations extends Tenant {
  users: User[];
  workspaces: Workspace[];
}

export interface WorkspaceWithRelations extends Workspace {
  owner: User;
  tenant?: Tenant;
  members: WorkspaceMember[];
  projects: Project[];
  invitations: Invitation[];
}

export interface ProjectWithRelations extends Project {
  user: User;
  team?: Team;
  workspace: Workspace;
  documents: Document[];
  tasks: Task[];
  activities: Activity[];
  tags: ProjectTag[];
}

export interface TaskWithRelations extends Task {
  project: Project;
  parentTask?: Task;
  subTasks: Task[];
  assignee?: User;
  activities: Activity[];
  comments: Comment[];
  files: File[];
  tags: TaskTag[];
  subtasks: Subtask[];
}

export interface TeamWithRelations extends Team {
  creator: User;
  members: TeamMember[];
  projects: Project[];
  activities: Activity[];
}

export interface DocumentWithRelations extends Document {
  project: Project;
  activities: Activity[];
  files: File[];
  comments: Comment[];
  documentVersions: DocumentVersion[];
}

// Types pour les relations de jointure
export interface WorkspaceMember {
  id: string;
  role: WorkspaceRole;
  status: InviteStatus;
  userId: string;
  user: User;
  workspaceId: string;
  workspace: Workspace;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  role: TeamRole;
  userId: string;
  user: User;
  teamId: string;
  team: Team;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectTag {
  projectId: string;
  project: Project;
  tagId: string;
  tag: Tag;
  assignedAt: Date;
}

export interface TaskTag {
  taskId: string;
  task: Task;
  tagId: string;
  tag: Tag;
  assignedAt: Date;
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  documentId: string;
  document: Document;
  userId: string;
  createdAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  order: number;
  taskId: string;
  task: Task;
  assigneeId?: string;
  assignee?: User;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les enums
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type BillingInterval = "MONTHLY" | "YEARLY";
export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "ARCHIVED";
export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DONE"
  | "CANCELLED";
export type Priority = "LOWEST" | "LOW" | "MEDIUM" | "HIGH" | "HIGHEST";
export type TeamRole = "ADMIN" | "MEMBER" | "GUEST";
export type WorkspaceRole = "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER";
export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
export type ActivityType =
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_ARCHIVED"
  | "PROJECT_DELETED"
  | "PROJECT_RESTORED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_STATUS_CHANGED"
  | "TASK_ASSIGNED"
  | "TASK_COMPLETED"
  | "TASK_DELETED"
  | "TASK_RESTORED"
  | "DOCUMENT_CREATED"
  | "DOCUMENT_UPDATED"
  | "DOCUMENT_DELETED"
  | "DOCUMENT_RESTORED"
  | "TEAM_CREATED"
  | "TEAM_UPDATED"
  | "TEAM_DELETED"
  | "MEMBER_JOINED"
  | "MEMBER_LEFT"
  | "MEMBER_ROLE_UPDATED"
  | "WORKSPACE_CREATED"
  | "WORKSPACE_UPDATED"
  | "WORKSPACE_DELETED"
  | "COMMENT_ADDED"
  | "COMMENT_UPDATED"
  | "COMMENT_DELETED"
  | "FILE_UPLOADED"
  | "FILE_DELETED"
  | "INVITATION_SENT"
  | "INVITATION_ACCEPTED"
  | "INVITATION_DECLINED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_UPDATED"
  | "SUBSCRIPTION_CANCELLED";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_COMPLETED"
  | "TASK_COMMENTED"
  | "DOCUMENT_COMMENTED"
  | "DOCUMENT_UPDATED"
  | "MENTION"
  | "WORKSPACE_INVITATION"
  | "TEAM_INVITATION"
  | "SUBSCRIPTION_EXPIRING"
  | "PAYMENT_FAILED"
  | "SYSTEM_NOTIFICATION";
