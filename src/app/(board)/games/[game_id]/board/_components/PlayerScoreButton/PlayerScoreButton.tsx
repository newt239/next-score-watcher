"use client";

import React from "react";

import {
  TextInput,
  UnstyledButton,
  useComputedColorScheme,
} from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import classes from "./PlayerScoreButton.module.css";

import db from "@/utils/db";

type Props = {
  color:
    | "red"
    | "blue"
    | "green"
    | "gray"
    | "black"
    | "win"
    | "lose"
    | "playing";
  filled?: boolean;
  compact?: boolean;
  game_id: string;
  player_id: string;
  currentProfile: string;
  editable: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: string;
};

const PlayerScoreButton: React.FC<Props> = ({
  color,
  children,
  filled = false,
  compact = false,
  game_id,
  player_id,
  currentProfile,
  editable,
  disabled,
  onClick,
}) => {
  const numberSign = children.endsWith("pt")
    ? "pt"
    : children.endsWith("○")
      ? "correct"
      : children.endsWith("✕")
        ? "wrong"
        : "none";
  const computedColorScheme = useComputedColorScheme("light");

  const defaultColor = computedColorScheme === "light" ? "white" : "gray.8";
  const variantColor =
    color === "gray"
      ? "gray.3"
      : color === "black"
        ? "gray.9"
        : ["red", "win"].includes(color)
          ? computedColorScheme === "light"
            ? "red.9"
            : "red.3"
          : ["blue", "lose"].includes(color)
            ? computedColorScheme === "light"
              ? "blue.9"
              : "blue.3"
            : computedColorScheme === "light"
              ? "green.9"
              : "yellow.3";

  const handleClick = async () => {
    if (color !== "green" && !disabled) {
      try {
        await db(currentProfile).logs.put({
          id: nanoid(),
          game_id,
          player_id,
          variant: color === "red" ? "correct" : "wrong",
          system: 0,
          timestamp: cdate().text(),
          available: 1,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {editable ? (
        <TextInput
          variant="unstyled"
          classNames={{ input: classes.player_score_button }}
          data-compact={compact}
          styles={{
            input: {
              cursor: "text",
              color: `var(--mantine-color-${(filled
                ? defaultColor
                : variantColor
              ).replace(".", "-")})`,
              backgroundColor: filled ? variantColor : "transparent",
            },
          }}
          defaultValue={children}
        />
      ) : (
        <UnstyledButton
          onClick={() => {
            if (onClick) {
              onClick();
            } else {
              handleClick();
            }
            sendGAEvent({
              event: "click_score_button",
              value: color,
            });
          }}
          className={classes.player_score_button}
          data-signed={numberSign !== "none"}
          data-compact={compact}
          data-disabled={disabled}
          style={{
            cursor:
              disabled && color !== "green"
                ? "not-allowed"
                : disabled || color === "green" || editable
                  ? "default"
                  : "pointer",
          }}
          c={filled ? defaultColor : variantColor}
          bg={filled ? variantColor : "transparent"}
        >
          {numberSign === "none" ? (
            <span>{children}</span>
          ) : (
            <>
              <span>{children.split(/((?:○)|(?:✕)|(?:pt))/)[0]}</span>
              <span style={{ fontSize: "50%" }}>
                {children.split(/((?:○)|(?:✕)|(?:pt))/)[1]}
              </span>
            </>
          )}
        </UnstyledButton>
      )}
    </>
  );
};

export default PlayerScoreButton;
