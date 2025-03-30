export const API_ENDPOINTS = {
  ENTRIES: {
    BASE: "/api/entries",
    LIST: "/api/entries",
    CREATE: "/api/entries",
    GET_BY_ID: (id: number) => `/api/entries/${id}`,
    UPDATE: (id: number) => `/api/entries/${id}`,
    DELETE: (id: number) => `/api/entries/${id}`,
  },
  VIEWS: {
    BASE: "/api/views",
    GET_BY_ENTRY: (entryId: number) => `/api/entry/${entryId}/views`,
    CREATE: "/api/views",
    GET_BY_ID: (id: number) => `/api/views/${id}`,
    UPDATE: (id: number) => `/api/views/${id}`,
    DELETE: (id: number) => `/api/views/${id}`,
  },
};
