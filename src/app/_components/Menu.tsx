import { useId } from "react";

import { Menu as ArkMenu } from "@ark-ui/react";

import { buttonRecipe } from "./Button";

import { css } from "@panda/css";

export type MenuProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  closeOnSelect?: boolean;
} & React.ComponentProps<typeof ArkMenu.Root>;

const Menu: React.FC<MenuProps> = ({ label, children, closeOnSelect }) => {
  return (
    <ArkMenu.Root closeOnSelect={closeOnSelect} unmountOnExit>
      <ArkMenu.Trigger
        className={css(
          buttonRecipe.raw({ variant: "subtle", size: "sm", color: "black" })
        )}
      >
        {label}
      </ArkMenu.Trigger>
      <ArkMenu.Positioner
        className={css({
          position: "absolute",
          isolation: "isolate",
          minWidth: "max-content",
          top: "0px",
          left: "0px",
        })}
      >
        <ArkMenu.Content
          className={css({
            backgroundColor: "white",
            borderRadius: "md",
            boxShadow: "md",
            display: "flex",
            flexDirection: "column",
            width: "calc(100% + 2rem)",
          })}
        >
          {children}
        </ArkMenu.Content>
      </ArkMenu.Positioner>
    </ArkMenu.Root>
  );
};

export default Menu;

export type MenuItemProps = {
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof ArkMenu.Item>, "id">;

export const MenuItem: React.FC<MenuItemProps> = ({ children }) => {
  const id = useId();

  return (
    <ArkMenu.Item
      className={css({
        alignItems: "center",
        display: "flex",
        borderRadius: "md",
        px: "8px",
        py: "4px",
        _hover: {
          backgroundColor: "gray.100",
          cursor: "pointer",
        },
      })}
      id={id}
    >
      {children}
    </ArkMenu.Item>
  );
};
