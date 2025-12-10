"use client";

import { Box, Button, Title } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { IconFileExport } from "@tabler/icons-react";
import { cdate } from "cdate";

import type { GamePropsUnion } from "@/utils/types";

import computeScore from "@/utils/computeScore";

type Props = {
  game: GamePropsUnion;
  currentProfile: string;
};

const ExportGame: React.FC<Props> = ({ game, currentProfile }) => {
  const handleCopyGame = async () => {
    sendGAEvent({
      event: "export_game",
      value: game.rule,
    });
    const { postData } = await computeScore(game.id, currentProfile);
    const blob = new Blob([JSON.stringify(postData, null, "\t")], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    a.download = `score-watcher_${game.id}_${cdate().format("YYMMDDHHmm")}.json`;
    a.click();
  };

  return (
    <Box mt="sm">
      <Title order={4}>エクスポート</Title>
      <Button onClick={handleCopyGame} leftSection={<IconFileExport />} mt="sm">
        ゲームをエクスポート
      </Button>
    </Box>
  );
};

export default ExportGame;
