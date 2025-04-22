import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  // input: "../backend/docs/openapi.json",
  input: "http://127.0.0.1:8000/api/v1/openapi.json",
  watch: true,
  output: {
    path: "./src/client",
    format: "prettier",
    lint: "eslint",
  },
  plugins: [
    "@hey-api/client-fetch",
    "@hey-api/schemas",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
    },
    "@tanstack/react-query",
  ],
});
