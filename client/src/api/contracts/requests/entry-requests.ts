export interface EntryListRequest {
  search_term?: string;
  page: number;
  per_page: number;
}

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
