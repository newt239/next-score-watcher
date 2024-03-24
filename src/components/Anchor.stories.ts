import { withRouter } from "storybook-addon-remix-react-router";

import Anchor from "./Anchor";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/Anchor",
  component: Anchor,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Anchor",
  },
  argTypes: {
    children: {
      control: "text",
      description: "The content of the anchor",
    },
  },
  tags: ["autodocs"],
  decorators: [withRouter],
} satisfies Meta<typeof Anchor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inner: Story = {
  args: {
    href: "/",
  },
};

export const External: Story = {
  args: {
    href: "https://example.com",
  },
};
