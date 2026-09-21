// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Companies Module Types
// =============================================================================

export interface CreateCompanyDto {
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  industry: string;
  description?: string | null;
}

export interface UpdateCompanyDto {
  name?: string;
  website?: string | null;
  logoUrl?: string | null;
  industry?: string;
  description?: string | null;
}

export interface CompanyFilterParams {
  search?: string;
  industry?: string;
  page?: number;
  limit?: number;
}
