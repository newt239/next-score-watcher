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
          buttonRecipe.raw({ color: "black", size: "sm", variant: "subtle" })
        )}
      >
        {label}
      </ArkMenu.Trigger>
      <ArkMenu.Positioner
        className={css({
          isolation: "isolate",
          left: "0px",
          minWidth: "max-content",
          position: "absolute",
          top: "0px",
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
  icon?: React.ReactNode;
} & Omit<React.ComponentProps<typeof ArkMenu.Item>, "id">;

export const MenuItem: React.FC<MenuItemProps> = ({ children, icon }) => {
  const id = useId();

  return (
    <ArkMenu.Item
      className={css({
        _hover: {
          backgroundColor: "gray.100",
          cursor: "pointer",
        },
        alignItems: "center",
        borderRadius: "md",
        display: "flex",
        gap: "8px",
        px: "8px",
        py: "8px",
      })}
      id={id}
    >
      {icon && (
        <div
          className={css({
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            width: "32px",
          })}
        >
          {icon}
        </div>
      )}
      {children}
    </ArkMenu.Item>
  );
};
