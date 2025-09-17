export interface Business {
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  targetAudience: string;
  additionalInfo: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateBusinessRequest {
  userId?: string;
  businessName: string;
  businessType: string;
  description: string;
  targetAudience?: string;
  additionalInfo: string;
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {}

export interface BusinessFilters {
  industry?: string;
  businessType?: string;
  isActive?: boolean;
  minBudget?: number;
  maxBudget?: number;
}
