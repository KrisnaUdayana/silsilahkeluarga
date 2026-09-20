// Person type definitions
export interface Person {
  id: string;
  fullName: string;
  nickname?: string | null;
  gender: 'MALE' | 'FEMALE';
  birthDate?: string | null;
  deathDate?: string | null;
  birthPlace?: string | null;
  occupation?: string | null;
  biography?: string | null;
  profilePhoto?: string | null;
  fatherId?: string | null;
  motherId?: string | null;
  father?: PersonSummary | null;
  mother?: PersonSummary | null;
  children?: PersonSummary[];
  spouses?: SpouseSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonSummary {
  id: string;
  fullName: string;
  nickname?: string | null;
  gender?: 'MALE' | 'FEMALE';
  birthDate?: string | null;
  profilePhoto?: string | null;
}

export interface SpouseSummary extends PersonSummary {
  marriageDate?: string | null;
  marriageId: string;
}

// Marriage type definitions
export interface Marriage {
  id: string;
  husbandId: string;
  wifeId: string;
  husband: PersonSummary;
  wife: PersonSummary;
  marriageDate?: string | null;
  marriagePlace?: string | null;
  divorceDate?: string | null;
  orderNumber: number;
  createdAt: string;
}

// User type definitions
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'VIEWER';
  personId?: string | null;
  person?: PersonSummary | null;
  lastLogin?: string | null;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'VIEWER';
  personId?: string | null;
  person?: { fullName: string; profilePhoto?: string | null } | null;
}

// Media type definitions
export interface Media {
  id: string;
  personId: string;
  fileUrl: string;
  caption?: string | null;
  mediaType: 'PHOTO' | 'DOCUMENT';
  uploadedAt: string;
}

// Tree node for visualization
export interface TreeNode {
  id: string;
  fullName: string;
  nickname?: string | null;
  gender: 'MALE' | 'FEMALE';
  birthDate?: string | null;
  deathDate?: string | null;
  profilePhoto?: string | null;
  fatherId?: string | null;
  motherId?: string | null;
  spouseIds: string[];
}

// Stats type
export interface Stats {
  summary: {
    totalPersons: number;
    maleCount: number;
    femaleCount: number;
    totalMarriages: number;
    totalUsers: number;
    livingCount: number;
    deceasedCount: number;
    estimatedGenerations: number;
  };
  recentAdditions: Array<{
    id: string;
    fullName: string;
    createdAt: string;
  }>;
}

// API Response types
export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// Form types
export interface PersonFormData {
  fullName: string;
  nickname?: string;
  gender: 'MALE' | 'FEMALE';
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  occupation?: string;
  biography?: string;
  fatherId?: string;
  motherId?: string;
}

export interface MarriageFormData {
  husbandId: string;
  wifeId: string;
  marriageDate?: string;
  marriagePlace?: string;
  divorceDate?: string;
  orderNumber?: number;
}

export interface UserFormData {
  email: string;
  password: string;
  role?: 'ADMIN' | 'VIEWER';
  personId?: string;
}
