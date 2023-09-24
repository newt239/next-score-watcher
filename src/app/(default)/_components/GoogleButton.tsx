"use client";

import Image from "next/image";

import { css } from "@panda/css";

type GoogleButtonProps = JSX.IntrinsicElements["button"];

const GoogleButton: React.FC<GoogleButtonProps> = ({ ...props }) => {
  return (
    <button
      className={css({
        padding: "0.5rem 1rem",
        border: "1px solid #CBD5E0",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        borderRadius: "0.375rem",
        color: "#4A5568",
        transition: "border 0.15s, color 0.15s, box-shadow 0.15s",
        cursor: "pointer",
        _hover: {
          borderColor: "#CBD5E0",
          color: "#2D3748",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
      })}
      {...props}
    >
      <Image alt="Google" height={24} src="./google-color.svg" width={24} />
      Googleでログイン
    </button>
  );
};

export default GoogleButton;
