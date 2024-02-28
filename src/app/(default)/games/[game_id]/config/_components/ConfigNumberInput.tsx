"use client";

import { useId, useTransition } from "react";

import { Loader } from "tabler-icons-react";

import NumberInput from "#/app/_components/NumberInput";
import { onGameRecordUpdate } from "#/utils/actions";
import { GameDBProps } from "#/utils/types";
import { css } from "@panda/css";

type ConfigNumberInputProps = {
  game_id: string;
  input_id: keyof GameDBProps;
  defaultValue: number;
  disabled?: boolean;
  label: string;
  helperText?: string;
  min?: number;
  max?: number;
};

const ConfigNumberInput: React.FC<ConfigNumberInputProps> = ({
  game_id,
  input_id,
  defaultValue,
  disabled,
  label,
  helperText,
  min = 0,
  max = 100,
}) => {
  const innerId = useId();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={css({
        pt: "8px",
      })}
      role="group"
    >
      <label
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        })}
        htmlFor={innerId}
      >
        <div
          className={css({
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          })}
        >
          <div
            className={css({
              fontWeight: "800",
            })}
          >
            {label}
          </div>
          {isPending && <Loader />}
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
          })}
        >
          <NumberInput
            defaultValue={defaultValue.toString()}
            disabled={disabled}
            id={innerId}
            max={max}
            min={min}
            onChange={(e) =>
              startTransition(() =>
                onGameRecordUpdate({
                  game_id: game_id,
                  input_id,
                  new_value: e.target.value,
                })
              )
            }
          />
        </div>
      </label>
      {helperText && (
        <div
          className={css({
            color: "gray.500",
            fontSize: "12px",
          })}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default ConfigNumberInput;
