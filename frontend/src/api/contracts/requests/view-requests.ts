export interface ViewCreateRequest {
  name: string;
  description: string;
  mvsj?: Record<string, any>;
  entry_id: number;
}

export interface ViewUpdateRequest {
  name?: string;
  description?: string;
  mvsj?: Record<string, any>;
}
