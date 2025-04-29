import { User, Tenant, Subscription, UserRole } from "@prisma/client";

export interface TenantSettings {
  maxUsers: number;
  maxWorkspaces: number;
  maxStorage: number;
}

export interface TenantWithUsers extends Tenant {
  users: User[];
}

export interface UserWithTenant extends User {
  tenants: Tenant[];
  subscription?: Subscription;
  primaryTenantId: string | null;
}

export interface CreateUserResponse {
  success: boolean;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: UserRole;
  };
}

export interface GetTenantUsersResponse {
  users: {
    id: string;
    name: string | null;
    email: string | null;
    role: UserRole;
    createdAt: Date;
  }[];
}
