import { EntryCard } from "@/components/EntryPreviewCard";
import type { Meta, StoryObj } from "@storybook/react";

// Define the component metadata for Storybook
const meta: Meta<typeof EntryCard> = {
  title: "Components/EntryCard",
  component: EntryCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    is_public: { control: "boolean" },
    thumbnail_url: { control: "text" },
    link: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof EntryCard>;

// Default story with sample data
export const Default: Story = {
  args: {
    id: "4ad03b4a-07a4-4b64-bef7-4707a0bf6a82",
    created_at: "2025-04-22T22:46:23.668400Z",
    updated_at: "2025-04-22T22:46:23.668410Z",
    name: "Entry Name",
    description: "Markdown description.",
    thumbnail_url: null,
    is_public: false,
    link: {
      id: "50b130be-085d-41f3-8375-5ca881815acc",
      is_editable: false,
      is_active: false,
    },
  },
};

export const LongName: Story = {
  args: {
    ...Default.args,
    name: "Fluorescence Microscopy study of Phalloidin in Primary Culture	",
  },
};

export const PublicEntry: Story = {
  args: {
    ...Default.args,
    is_public: true,
  },
};

export const LongDescription: Story = {
  args: {
    ...Default.args,
    description: `
    Time-series data of Alexa Fluor-labeled Peroxisome in T-Cell cells.

Primary Culture were cultured under Acidic pH conditions for 24 hours before imaging.

The images reveal distinct localization patterns of TOMM20 in response to Bafilomycin.

The imaging data provides new insights into Chloroplast dynamics in HEK293 cells.
    `,
  },
};
