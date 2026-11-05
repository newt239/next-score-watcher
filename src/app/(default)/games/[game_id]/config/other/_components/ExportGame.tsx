"use client";

import { Box, Button, Title } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { IconFileExport } from "@tabler/icons-react";
import { cdate } from "cdate";

import computeScore from "@/utils/computeScore";
import { downloadJson } from "@/utils/download-json";

import type { GamePropsUnion } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  currentProfile: string;
};

const ExportGame: React.FC<Props> = ({ game, currentProfile }) => {
  const handleCopyGame = async () => {
    sendGAEvent("event", "export_game", { rule: game.rule });
    const { postData } = await computeScore(game.id, currentProfile);
    downloadJson(postData, `score-watcher_${game.id}_${cdate().format("YYMMDDHHmm")}.json`, "\t");
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
