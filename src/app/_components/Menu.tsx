import { Menu as ArkMenu } from "@ark-ui/react";

import { css } from "@panda/css";

export type MenuProps = {
  label: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof ArkMenu.Root>;

const Menu: React.FC<MenuProps> = ({ label, children }) => {
  return (
    <ArkMenu.Root>
      <ArkMenu.Trigger
        className={css({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: "1px",
          borderColor: "transparent",
          width: "fit-content",
          cursor: "pointer",
          transition: "all 0.2s ease",
          _disabled: {
            backgroundColor: "gray.300",
            color: "white",
            cursor: "not-allowed",
            _hover: {
              backgroundColor: "gray.300",
            },
          },
        })}
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
            gap: "8px",
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
  id: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof ArkMenu.Item>;

export const MenuItem: React.FC<MenuItemProps> = ({ id, children }) => (
  <ArkMenu.Item
    className={css({
      alignItems: "center",
      display: "flex",
    })}
    id={id}
  >
    {children}
  </ArkMenu.Item>
);
