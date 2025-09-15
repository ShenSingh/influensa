export interface Business {
}

export interface CreateBusinessRequest {
  businessName: string;
  businessType: string;
  description: string;
  targetAudience?: string;
  email: string;
  phone: string;
  AdditionalInfo: string;
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {}

export interface BusinessFilters {
  industry?: string;
  businessType?: string;
  isActive?: boolean;
  minBudget?: number;
  maxBudget?: number;
}
