export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  tenantName: string;
  tenantSlug: string;
  plan: 'free' | 'pro' | 'enterprise';
  paymentMethod?: {
    type: 'card' | 'paypal' | 'bank' | 'other';
    provider?: string;
    last4?: string;
    email?: string;
    accountName?: string;
    method?: string;
  } | null;
};