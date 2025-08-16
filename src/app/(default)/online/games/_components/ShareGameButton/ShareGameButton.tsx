"use client";

import { useState } from "react";

import { Button, CopyButton, Tooltip, rem } from "@mantine/core";
import { IconCheck, IconShare } from "@tabler/icons-react";

type ShareGameButtonProps = {
  gameId: string;
  isPublic: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "filled" | "light" | "outline" | "subtle" | "default";
};

/**
 * 公開ゲーム用シェアボタンコンポーネント
 * Viewer専用URLを生成してコピー機能を提供
 */
const ShareGameButton: React.FC<ShareGameButtonProps> = ({
  gameId,
  isPublic,
  size = "sm",
  variant = "light",
}) => {
  const [tooltipOpened, setTooltipOpened] = useState(false);

  if (!isPublic) {
    return null;
  }

  const viewerUrl = `${window.location.origin}/viewer/games/${gameId}`;
  const [viewerUrl, setViewerUrl] = useState("");

  // Set viewerUrl on client after mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setViewerUrl(`${window.location.origin}/viewer/games/${gameId}`);
    }
  }, [gameId]);

  if (!isPublic) {
    return null;
  }
  return (
    <CopyButton value={viewerUrl} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? "コピーしました" : "Viewer URLをコピー"}
          withArrow
          position="top"
          opened={tooltipOpened || copied}
        >
          <Button
            color={copied ? "teal" : "blue"}
            variant={variant}
            size={size}
            onClick={() => {
              copy();
              setTooltipOpened(false);
            }}
            leftSection={
              copied ? (
                <IconCheck style={{ width: rem(16) }} />
              ) : (
                <IconShare style={{ width: rem(16) }} />
              )
            }
          >
            {copied ? "コピー完了" : "シェア"}
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default ShareGameButton;
