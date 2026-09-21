// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Departments Module Types
// =============================================================================

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string | null;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  description?: string | null;
}

export interface DepartmentFilterParams {
  search?: string;
  page?: number;
  limit?: number;
}
