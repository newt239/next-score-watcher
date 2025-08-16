"use client";

import ConfigInput from "../../_components/ConfigInput";

import type { RuleNames } from "@/models/game";
import type { AqlOption } from "@/utils/drizzle/types";

type AQLOptionsProps = {
  gameId: string;
  ruleType: RuleNames;
  settings: AqlOption;
};

/**
 * AQLゲーム設定オプション
 */
const AQLOptions: React.FC<AQLOptionsProps> = ({
  gameId,
  ruleType,
  settings,
}) => {
  if (ruleType !== "aql") return null;

  return (
    <>
      <ConfigInput
        gameId={gameId}
        label="左チーム名"
        placeholder="チーム名を入力"
        value={settings.left_team}
        fieldName="left_team"
      />
      <ConfigInput
        gameId={gameId}
        label="右チーム名"
        placeholder="チーム名を入力"
        value={settings.right_team}
        fieldName="right_team"
      />
    </>
  );
};

export default AQLOptions;
