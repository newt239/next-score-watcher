"use client";

import { useId, useTransition } from "react";

import { Loader } from "tabler-icons-react";

import TextInput from "#/app/_components/TextInput";
import { onGameRecordUpdate } from "#/utils/actions";
import { GameDBProps } from "#/utils/types";
import { css } from "@panda/css";

type ConfigTextInputProps = {
  game_id: string;
  input_id: keyof GameDBProps;
  defaultValue: string;
  disabled?: boolean;
  label: string;
  helperText?: string;
  placeholder: string;
  type?: "url" | "text";
};

const ConfigTextInput: React.FC<ConfigTextInputProps> = ({
  game_id,
  input_id,
  defaultValue,
  disabled,
  label,
  helperText,
  placeholder,
  type = "text",
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
          <TextInput
            defaultValue={defaultValue}
            disabled={disabled}
            id={innerId}
            onChange={(e) =>
              startTransition(() =>
                onGameRecordUpdate({
                  game_id: game_id,
                  input_id,
                  new_value: e.target.value,
                })
              )
            }
            placeholder={placeholder}
            type={type}
          />
          {isPending && <Loader />}
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

export default ConfigTextInput;
