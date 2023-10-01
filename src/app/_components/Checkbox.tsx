import { Checkbox as ArkCheckbox } from "@ark-ui/react";
import { Square, SquareMinus } from "tabler-icons-react";

import { css } from "@panda/css";

export type CheckboxProps = {
  children?: React.ReactNode;
  checked: boolean;
  indeterminate?: boolean;
} & Omit<React.ComponentProps<typeof ArkCheckbox.Root>, "checked">;

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  checked,
  indeterminate,
  onChange,
}) => {
  return (
    <ArkCheckbox.Root
      checked={indeterminate === true ? "indeterminate" : checked}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      })}
      onChange={onChange}
    >
      {(api) => (
        <>
          {children && <ArkCheckbox.Label>{children}</ArkCheckbox.Label>}
          <ArkCheckbox.Control
            className={css({
              color: !api.isChecked ? "black" : "emerald.500",
              cursor: "pointer",
            })}
          >
            {api.isChecked ? (
              <svg
                className="icon icon-tabler icon-tabler-square-check-filled"
                fill="none"
                height={24}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width={24}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                <path
                  d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                  fill="currentColor"
                  strokeWidth={0}
                ></path>
              </svg>
            ) : (
              <Square />
            )}
            {api.isIndeterminate && <SquareMinus />}
          </ArkCheckbox.Control>
        </>
      )}
    </ArkCheckbox.Root>
  );
};

export default Checkbox;
