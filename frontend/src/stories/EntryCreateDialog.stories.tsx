import { EntryCreateDialog } from "@/components/entries/EntryCreateDialog";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rest } from "msw";
import { BrowserRouter } from "react-router-dom";

// Create a new QueryClient for each story
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Wrap your component with necessary providers
const StoryWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

const meta: Meta<typeof EntryCreateDialog> = {
  title: "Forms/EntryCreateDialog",
  component: EntryCreateDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dialog form for creating a new entry with name, description, and privacy settings.",
      },
    },
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls whether the dialog is open or closed",
    },
    onOpenChange: {
      description: "Function called when the open state changes",
      action: "onOpenChange",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EntryCreateDialog>;

// Default story showing the dialog open
export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
  },
};

// Story with success response mock
export const SuccessfulSubmission: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        rest.post("/api/entries", (req, res, ctx) => {
          return res(
            ctx.json({
              id: "123",
              name: "Sample Entry",
              description: "This is a sample entry created via Storybook",
              is_public: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }),
            ctx.delay(1000),
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    // Add interaction tests here if needed
  },
};

// Story with error response mock
export const ErrorSubmission: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        rest.post("/api/entries", (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              message: "Server error occurred",
            }),
            ctx.delay(1000),
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    // Add interaction tests here if needed
  },
};

// Story with the dialog closed
export const Closed: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
  },
};

// Story with pre-filled form values
export const PrefilledForm: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
  },
  decorators: [
    (Story) => {
      // This is where you would typically modify form values
      // However, this component doesn't accept initial values as props
      // so this is just a placeholder for demonstration purposes
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Example of how the dialog would look with pre-filled values (Note: would require component modification to accept initial values)",
      },
    },
  },
};
