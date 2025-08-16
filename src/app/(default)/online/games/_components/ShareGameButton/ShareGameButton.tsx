"use client";

import { useState } from "react";

import { Button, CopyButton, Tooltip, rem } from "@mantine/core";
import { IconCheck, IconShare } from "@tabler/icons-react";

type ShareGameButtonProps = {
  gameId: string;
  isPublic: boolean;
};

/**
 * 公開ゲーム用シェアボタンコンポーネント
 * Viewer専用URLを生成してコピー機能を提供
 */
const ShareGameButton: React.FC<ShareGameButtonProps> = ({
  gameId,
  isPublic,
}) => {
  const [tooltipOpened, setTooltipOpened] = useState(false);

  if (!isPublic) {
    return null;
  }

  if (!isPublic) {
    return null;
  }
  return (
    <CopyButton
      value={`https://score-watcher.com/viewer/games/${gameId}`}
      timeout={2000}
    >
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? "コピーしました" : "Viewer URLをコピー"}
          withArrow
          position="top"
          opened={tooltipOpened || copied}
        >
          <Button
            color={copied ? "teal" : "blue"}
            variant="light"
            size="xs"
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
