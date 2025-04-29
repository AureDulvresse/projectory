import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function getCurrentTenant() {
  const session = await auth();
  return session?.user.tenant;
}

export async function getCurrentUserRole() {
  const session = await auth();
  return session?.user.role;
}

export async function getCurrentUserSubscription() {
  const session = await auth();
  return session?.user.subscription;
}





