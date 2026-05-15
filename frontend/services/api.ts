export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
