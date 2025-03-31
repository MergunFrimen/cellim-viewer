export interface Entry {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface View {
  id: string;
  name: string;
  description: string;
  mvsj: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

