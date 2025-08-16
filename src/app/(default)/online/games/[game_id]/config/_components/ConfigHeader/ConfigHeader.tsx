"use client";

import { Accordion } from "@mantine/core";

import GameStartButton from "../GameStartButton/GameStartButton";

import type { RuleNames } from "@/models/games";

import Link from "@/app/_components/Link";
import { rules } from "@/utils/rules";

type ConfigHeaderProps = {
  ruleType: RuleNames;
  playerCount: number;
  logCount: number;
};

/**
 * ゲーム設定ページのヘッダー部分
 * ゲームタイトル、ルール説明、開始ボタンを表示するサーバーコンポーネント
 */
const ConfigHeader = ({
  ruleType,
  playerCount,
  logCount,
}: ConfigHeaderProps) => {
  return (
    <>
      <h2>{rules[ruleType]?.name || "不明な形式"}</h2>
      <Accordion variant="separated">
        <Accordion.Item value="rule_description">
          <Accordion.Control>
            {rules[ruleType].short_description}
          </Accordion.Control>
          <Accordion.Panel pb={4}>
            <p>{rules[ruleType].description}</p>
            <p>
              より詳細な説明は
              <Link href={`https://docs.score-watcher.com/rules/${ruleType}`}>
                ヘルプサイト
              </Link>
              をご覧ください。
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <GameStartButton
        ruleType={ruleType}
        playerCount={playerCount}
        logCount={logCount}
      />
    </>
  );
};

export default ConfigHeader;
