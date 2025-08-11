"use client";

import React from "react";

import { UnstyledButton, useComputedColorScheme } from "@mantine/core";

import classes from "./PlayerScoreButton.module.css";

import type { LogDBProps } from "@/models/games";

type PlayerScoreButtonProps = {
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
  playerId: string;
  isPending: boolean;
  onAddLog: (playerId: string, actionType: LogDBProps["variant"]) => void;
  disabled?: boolean;
  children: string;
};

const PlayerScoreButton: React.FC<PlayerScoreButtonProps> = ({
  color,
  children,
  filled = false,
  compact = false,
  playerId,
  isPending,
  onAddLog,
  disabled,
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

  const handleClick = () => {
    if (color !== "green" && !disabled && !isPending) {
      onAddLog(playerId, color === "red" ? "correct" : "wrong");
    }
  };

  return (
    <UnstyledButton
      onClick={handleClick}
      className={classes.player_score_button}
      data-signed={numberSign !== "none"}
      data-compact={compact}
      data-disabled={disabled || isPending}
      style={{
        cursor:
          disabled && color !== "green"
            ? "not-allowed"
            : disabled || color === "green" || isPending
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
  );
};

export default PlayerScoreButton;
