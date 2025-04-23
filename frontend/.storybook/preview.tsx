import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { ThemeProvider } from "../src/contexts/ThemeProvider";
import "../src/index.css";

initialize();

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
  loaders: [mswLoader],
};

export default preview;
