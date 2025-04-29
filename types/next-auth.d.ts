import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    subscription?: {
      plan: string;
      status: string;
    };
    tenant: {
      id: string;
      name: string;
      slug: string;
    };
  }

  interface Session {
    user: User;
  }
}
