import { API_BASE_URL } from "@/config/dev-config";
import { View } from "@/types";
import { ViewCreateRequest, ViewUpdateRequest } from "../contracts/requests";
import { handleResponse } from "./common";

export const viewsApi = {
  // List views for an entry
  listByEntry: async (entryId: string): Promise<View[]> => {
    const response = await fetch(`${API_BASE_URL}/views/entry/${entryId}`);
    return handleResponse<View[]>(response);
  },

  // Get view by ID
  getById: async (id: string): Promise<View> => {
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
  update: async (id: string, data: ViewUpdateRequest): Promise<View> => {
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
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/views/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  },
};
