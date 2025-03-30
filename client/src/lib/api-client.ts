import { API_ENDPOINTS } from "@/lib/api-schema";
import {
  Entry,
  EntryCreateRequest,
  EntryListResponse,
  EntryUpdateRequest,
  SearchParams,
  View,
  ViewCreateRequest,
  ViewUpdateRequest,
} from "@/types";

// Base API URL
const API_BASE_URL = "http://0.0.0.0:8000/api";

// Helper function for HTTP errors
function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// Entries API
export const entriesApi = {
  // Search entries with pagination
  list: async ({
    search,
    page = 1,
    per_page = 10,
  }: SearchParams): Promise<EntryListResponse> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("per_page", per_page.toString());

    const response = await fetch(
      `${API_ENDPOINTS.ENTRIES.LIST}?${params.toString()}`,
    );
    return handleResponse<EntryListResponse>(response);
  },

  // Get entry by ID
  getById: async (id: number): Promise<Entry> => {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`);
    return handleResponse<Entry>(response);
  },

  // Get entry by sharing UUID
  getBySharing: async (uuid: string): Promise<Entry> => {
    const response = await fetch(
      `${API_BASE_URL}/entries/by-sharing-uuid/${uuid}`,
    );
    return handleResponse<Entry>(response);
  },

  // Get entry by edit UUID
  getByEdit: async (uuid: string): Promise<Entry> => {
    const response = await fetch(
      `${API_BASE_URL}/entries/by-edit-uuid/${uuid}`,
    );
    return handleResponse<Entry>(response);
  },

  // Create new entry
  create: async (data: EntryCreateRequest): Promise<Entry> => {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Entry>(response);
  },

  // Update entry
  update: async (id: number, data: EntryUpdateRequest): Promise<Entry> => {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Entry>(response);
  },

  // Delete entry
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  },
};

// Views API
export const viewsApi = {
  // List views for an entry
  listByEntry: async (entryId: number): Promise<View[]> => {
    const response = await fetch(`${API_BASE_URL}/views/entry/${entryId}`);
    return handleResponse<View[]>(response);
  },

  // Get view by ID
  getById: async (id: number): Promise<View> => {
    const response = await fetch(`${API_BASE_URL}/views/${id}`);
    return handleResponse<View>(response);
  },

  // Create new view
  create: async (data: ViewCreateRequest): Promise<View> => {
    const response = await fetch(`${API_BASE_URL}/views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<View>(response);
  },

  // Update view
  update: async (id: number, data: ViewUpdateRequest): Promise<View> => {
    const response = await fetch(`${API_BASE_URL}/views/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<View>(response);
  },

  // Delete view
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/views/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  },
};
