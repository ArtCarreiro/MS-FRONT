export interface ApiError {
  status: number;
  message: string;
  url?: string;
  details?: unknown;
}
