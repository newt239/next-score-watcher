"use client";

import { Accordion } from "@mantine/core";

import { useGameState } from "../../_hooks/useGameState";
import GameStartButton from "../GameStartButton/GameStartButton";

import Link from "@/app/_components/Link";
import { rules } from "@/utils/rules";

/**
 * ゲーム設定ページのヘッダー部分
 * ゲームタイトル、ルール説明、開始ボタンを表示するクライアントコンポーネント
 */
const ConfigHeader = () => {
  const { game } = useGameState();

  if (!game) {
    return <div>ゲーム情報を読み込み中...</div>;
  }

  const { ruleType, players, logs } = game;
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
        playerCount={players.length}
        logCount={logs.length}
      />
    </>
  );
};

export default ConfigHeader;
