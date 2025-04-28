import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  watch: true,
  // input: "../backend/docs/openapi.json",
  input: `http://127.0.0.1:8000/api/v1/openapi.json`,
  output: {
    path: "./src/lib/client",
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
    // {
    //   name: "@hey-api/transformers",
    //   dates: true,
    // },
    {
      name: "@hey-api/sdk",
      validator: true,
      // transformer: true,
    },
  ],
});
