import { Select as ArkSelect, Portal } from "@ark-ui/react";
import { Check, Selector } from "tabler-icons-react";

import { css } from "@panda/css";

export type SelectProps = {
  items: { value: string; label: string }[];
  label?: string;
} & React.ComponentProps<typeof ArkSelect.Root>;

const Select: React.FC<SelectProps> = ({ items, label, value, onChange }) => {
  return (
    <ArkSelect.Root
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      })}
      closeOnSelect
      items={items}
      onChange={onChange}
      positioning={{ sameWidth: true }}
      unmountOnExit
      value={value}
    >
      {label && <ArkSelect.Label>{label}</ArkSelect.Label>}
      <ArkSelect.Control>
        <ArkSelect.Trigger
          className={css({
            alignItems: "center",
            backgroundColor: "gray.100",
            borderColor: "gray.300",
            borderRadius: "md",
            borderStyle: "solid",
            borderWidth: "1px",
            cursor: "pointer",
            display: "inline-flex",
            gap: "8px",
            justifyContent: "space-between",
            p: "8px",
            position: "relative",
            width: "100%",
          })}
        >
          <ArkSelect.ValueText />
          <Selector />
        </ArkSelect.Trigger>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content
            className={css({
              backgroundColor: "gray.200",
              borderRadius: "md",
              boxShadow: "md",
              display: "flex",
              flexDirection: "column",
            })}
          >
            {items.map((item) => (
              <ArkSelect.Item
                className={css({
                  _hover: {
                    backgroundColor: "gray.300",
                  },
                  alignItems: "center",
                  borderRadius: "md",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  p: "8px",
                })}
                item={item}
                key={item.value}
              >
                <ArkSelect.ItemText>{item.label}</ArkSelect.ItemText>
                <ArkSelect.ItemIndicator>
                  <Check />
                </ArkSelect.ItemIndicator>
              </ArkSelect.Item>
            ))}
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
    </ArkSelect.Root>
  );
};

export default Select;
