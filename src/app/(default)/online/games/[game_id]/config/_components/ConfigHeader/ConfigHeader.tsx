import { Accordion, AccordionControl, AccordionItem, AccordionPanel } from "@mantine/core";

import GameStartButton from "../GameStartButton/GameStartButton";

import type { RuleNames } from "@/models/game";

import Link from "@/components/Link";
import { rules } from "@/utils/rules";

type ConfigHeaderProps = {
  gameId: string;
  ruleType: RuleNames;
  playerCount: number;
  logCount: number;
};

/**
 * ゲーム設定ページのヘッダー部分
 */
const ConfigHeader: React.FC<ConfigHeaderProps> = ({ gameId, ruleType, playerCount, logCount }) => {
  return (
    <>
      <h2>{rules[ruleType]?.name || "不明な形式"}</h2>
      <Accordion variant="separated">
        <AccordionItem value="rule_description">
          <AccordionControl>{rules[ruleType].short_description}</AccordionControl>
          <AccordionPanel pb={4}>
            <p>{rules[ruleType].description}</p>
            <p>
              より詳細な説明は
              <Link href={`https://docs.score-watcher.com/rules/${ruleType}`}>ヘルプサイト</Link>
              をご覧ください。
            </p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <GameStartButton
        ruleType={ruleType}
        playerCount={playerCount}
        logCount={logCount}
        gameId={gameId}
      />
    </>
  );
};

export default ConfigHeader;
