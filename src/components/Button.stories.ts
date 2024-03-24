import Button from "./Button";

import type { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "ScoreWatcher/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  args: {
    children: "Button",
    size: "md",
    variant: "solid",
  },
  argTypes: {
    children: {
      control: "text",
      description: "The content of the button",
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "subtle"],
      description: "The style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "The size of the button",
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Solid: Story = {
  args: {
    variant: "solid",
  },
};
export const XL: Story = {
  args: {
    size: "xl",
  },
};
