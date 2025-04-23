import type { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "../src/contexts/ThemeProvider";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
