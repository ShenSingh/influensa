export interface Influencer {
  _id: string;
  socialName: string;
  name: string;
  niche: string;
  followers: string;
  engagement: number;
  location: string;
  image: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateInfluencerRequest {
  socialName: string;
  name: string;
  niche: string;
  followers: string;
  engagement: number;
  location: string;
  image: string;
  verified: boolean;
}

export interface UpdateInfluencerRequest extends Partial<CreateInfluencerRequest> {}
