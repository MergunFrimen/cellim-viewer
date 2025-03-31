import { API_BASE_URL } from "@/config/dev-config";

export const API_ENDPOINTS = {
  ENTRIES: {
    BASE: `${API_BASE_URL}/entries`,
    LIST: `${API_BASE_URL}/entries`,
    CREATE: `${API_BASE_URL}/entries`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/entries/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/entries/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/entries/${id}`,
  },
  VIEWS: {
    BASE: "${API_BASE_URL}/views",
    GET_BY_ENTRY: (entryId: number) => `${API_BASE_URL}/entry/${entryId}/views`,
    CREATE: "${API_BASE_URL}/views",
    GET_BY_ID: (id: number) => `${API_BASE_URL}/views/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/views/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/views/${id}`,
  },
};
