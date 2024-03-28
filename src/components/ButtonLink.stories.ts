import { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-remix-react-router";

import ButtonLink from "./ButtonLink";

const meta = {
  title: "Components/ButtonLink",
  component: ButtonLink,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button Link",
  },
  argTypes: {
    children: {
      control: "text",
      description: "The content of the Button Link",
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "subtle"],
      description: "The style of the Button Link",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "The size of the Button Link",
    },
  },
  tags: ["autodocs"],
  decorators: [withRouter],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/",
  },
};

export const Disabled: Story = {
  args: {
    href: "/",
  },
};
