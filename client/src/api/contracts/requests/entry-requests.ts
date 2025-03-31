export interface EntryCreateRequest {
  name: string;
  description?: string;
  is_public: boolean;
}

export interface EntryUpdateRequest {
  name?: string;
  description?: string;
  is_public?: boolean;
}
