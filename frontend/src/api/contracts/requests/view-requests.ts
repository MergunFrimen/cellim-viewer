export interface ViewCreateRequest {
  name: string;
  description: string;
  mvsj?: Record<string, any>;
  entry_id: string;
}

export interface ViewUpdateRequest {
  name?: string;
  description?: string;
  mvsj?: Record<string, any>;
}
