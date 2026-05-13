export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  object: T;
}
