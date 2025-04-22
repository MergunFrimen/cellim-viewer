import { defineConfig } from "@hey-api/openapi-ts";
import { API_BASE_URL } from "./src/config/dev-config";

export default defineConfig({
  // watch: true,
  // input: "../backend/docs/openapi.json",
  input: `${API_BASE_URL}/openapi.json`,
  output: {
    path: "./src/client",
    format: "prettier",
    lint: "eslint",
  },
  plugins: [
    {
      name: "@hey-api/client-fetch",
    },
    {
      name: "@hey-api/typescript",
    },
    {
      name: "@tanstack/react-query",
    },
    {
      name: "zod",
      exportFromIndex: true,
    },
    {
      name: "@hey-api/schemas",
      type: "form",
    },
    {
      name: "@hey-api/transformers",
      dates: true,
    },
    {
      name: "@hey-api/sdk",
      validator: true,
      transformer: true,
    },
  ],
});
