export interface Entry {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  views: View[];
}

export interface View {
  id: string;
  title: string;
  description: string;
  entry_id: string;
  created_at: string;
  updated_at: string;
}

export interface EntriesResponse {
  results: Entry[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ViewResponse {
  id: string;
  title: string;
  description: string;
  entry_id: string;
  created_at: string;
  updated_at: string;
}
