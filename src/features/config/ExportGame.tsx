import { Button } from "@chakra-ui/react";
import { cdate } from "cdate";
import { FileExport } from "tabler-icons-react";
import computeScore from "~/utils/computeScore";

import { recordEvent } from "~/utils/ga4";
import { GamePropsUnion } from "~/utils/types";

type CopyGamePropsUnion = {
  game: GamePropsUnion;
};

const ExportGame: React.FC<CopyGamePropsUnion> = ({ game }) => {
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

    recordEvent({
      action: "export_game",
      category: "engagement",
      label: game.rule,
    });
  };

  return (
    <Button
      onClick={handleCopyGame}
      rightIcon={<FileExport />}
      colorScheme="blue"
    >
      ゲームをエクスポート
    </Button>
  );
};

export default ExportGame;
