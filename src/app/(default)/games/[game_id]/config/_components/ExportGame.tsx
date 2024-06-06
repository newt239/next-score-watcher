"use client";

import { Button } from "@mantine/core";
import { cdate } from "cdate";
import { FileExport } from "tabler-icons-react";

import computeScore from "@/utils/computeScore";
import { GamePropsUnion } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
};

const ExportGame: React.FC<Props> = ({ game }) => {
  const handleCopyGame = async () => {
    const { postData } = await computeScore(game.id);
    const blob = new Blob([JSON.stringify(postData, null, "\t")], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    a.download = `score-watcher_${game.id}_${cdate().format(
      "YYMMDDHHmm"
    )}.json`;
    a.click();
  };

  return (
    <Button onClick={handleCopyGame} rightSection={<FileExport />}>
      ゲームをエクスポート
    </Button>
  );
};

export default ExportGame;
