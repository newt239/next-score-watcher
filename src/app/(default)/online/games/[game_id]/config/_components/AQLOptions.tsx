"use client";

import ConfigInput from "./ConfigInput";

import type { GetGameSettingsResponseType } from "@/models/games";
import type { RuleNames } from "@/utils/types";

type AQLOptionsProps = {
  gameId: string;
  ruleType: RuleNames;
  settings: GetGameSettingsResponseType;
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
        value={settings.leftTeam}
        fieldName="leftTeam"
      />
      <ConfigInput
        gameId={gameId}
        label="右チーム名"
        placeholder="チーム名を入力"
        value={settings.rightTeam}
        fieldName="rightTeam"
      />
    </>
  );
};

export default AQLOptions;
