export interface Entry {
  id: number;
  name: string;
  description: string | null;
  author_email: string | null;
  thumbnail_path: string | null;
  is_public: boolean;
  sharing_uuid: string | null;
  edit_uuid: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface View {
  id: number;
  title: string;
  description: string;
  mvsj: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EntryWithViews extends Entry {
  views: View[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface EntryListResponse extends PaginatedResponse<Entry> {}

export interface EntryCreateRequest {
  name: string;
  description?: string;
  author_email?: string;
  thumbnail_path?: string;
  is_public: boolean;
}

export interface EntryUpdateRequest {
  name?: string;
  description?: string;
  author_email?: string;
  thumbnail_path?: string;
  is_public?: boolean;
}

export interface ViewCreateRequest {
  title: string;
  description: string;
  mvsj?: Record<string, any>;
  entry_id: number;
}

export interface ViewUpdateRequest {
  title?: string;
  description?: string;
  mvsj?: Record<string, any>;
}

export interface SearchParams {
  search?: string;
  page: number;
  per_page: number;
}

export interface ViewState {
  id: string;
  title: string;
  description: string;
  mvsj: any; // The MolStar view state JSON
  created_at: string | null;
  updated_at: string | null;
}
