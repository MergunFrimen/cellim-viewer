import { API_BASE_URL } from "@/config/dev-config";
import { Entry } from "@/types";
import { API_ENDPOINTS } from "../api-schema";
import {
  EntryListRequest,
  EntryCreateRequest,
  EntryUpdateRequest,
} from "../contracts/requests";
import { PaginatedResponse } from "../contracts/responses";
import { handleResponse } from "./common";

export const entriesApi = {
  // Search entries with pagination
  list: async ({
    search_term: search,
    page = 1,
    per_page = 10,
  }: EntryListRequest): Promise<PaginatedResponse<Entry>> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("per_page", per_page.toString());

    const response = await fetch(
      `${API_ENDPOINTS.ENTRIES.LIST}?${params.toString()}`,
    );
    return handleResponse<PaginatedResponse<Entry>>(response);
  },

  // Get entry by ID
  getById: async (id: string): Promise<Entry> => {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`);
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
  update: async (id: string, data: EntryUpdateRequest): Promise<Entry> => {
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
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  },
};
