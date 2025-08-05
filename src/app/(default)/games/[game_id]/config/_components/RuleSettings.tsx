"use client";

import { Flex } from "@mantine/core";

import AQLOptions from "./AQLOptions";
import ConfigBooleanInput from "./ConfigBooleanInput";
import ConfigInput from "./ConfigInput";
import ConfigLimit from "./ConfigLimit/ConfigLimit";
import ConfigNumberInput from "./ConfigNumberInput";

import type { GamePropsUnion } from "@/utils/types";

type RuleSettingsProps = {
  game: GamePropsUnion;
  currentProfile: string;
};

const RuleSettings: React.FC<RuleSettingsProps> = ({
  game,
  currentProfile,
}) => {
  const winPointPaires = {
    nomx: {
      name: "勝ち抜けポイント",
      max: 1000,
      min: undefined,
    },
    "nomx-ad": {
      name: "勝ち抜けポイント",
      max: 1000,
      min: undefined,
    },
    nomr: {
      name: "休み(M)",
      max: 100,
      min: undefined,
    },
    "endless-chance": {
      name: "失格誤答数",
      max: 100,
      min: undefined,
    },
    ny: {
      name: "勝ち抜けポイント",
      max: 1000,
      min: 3,
    },
    variables: {
      name: "勝ち抜けポイント",
      max: 1000,
      min: 3,
    },
    nbyn: {
      name: "N",
      max: 10,
      min: undefined,
    },
    nupdown: {
      name: "N",
      max: 10,
      min: undefined,
    },
    squarex: {
      name: "IconX",
      max: 100,
      min: undefined,
    },
    freezex: {
      name: "IconX",
      max: 100,
      min: undefined,
    },
    attacksurvival: {
      name: "勝ち抜け人数",
      max: 1000,
      min: undefined,
    },
  };

  return (
    <>
      <Flex direction="column" gap="lg">
        <ConfigInput
          input_id="name"
          label="ゲーム名"
          placeholder="〇〇大会"
          currentProfile={currentProfile}
        />
        {[
          "nomx",
          "nomx-ad",
          "nomr",
          "endless-chance",
          "ny",
          "variables",
          "nbyn",
          "nupdown",
          "squarex",
          "freezex",
          "attacksurvival",
        ].includes(game.rule) && (
          <ConfigNumberInput
            input_id="win_point"
            label={
              winPointPaires[game.rule as keyof typeof winPointPaires].name
            }
            max={winPointPaires[game.rule as keyof typeof winPointPaires].max}
            min={winPointPaires[game.rule as keyof typeof winPointPaires].min}
            currentProfile={currentProfile}
          />
        )}
        {[
          "nomx",
          "nomx-ad",
          "nbyn",
          "nupdown",
          "nomr",
          "endless-chance",
        ].includes(game.rule) && (
          <ConfigNumberInput
            input_id="lose_point"
            label={game.rule === "nomr" ? "休み(M)" : "失格誤答数"}
            max={100}
            currentProfile={currentProfile}
          />
        )}
        {["attacksurvival"].includes(game.rule) && (
          <>
            <ConfigNumberInput
              input_id="win_point"
              label="共通初期値"
              max={30}
              min={1}
              currentProfile={currentProfile}
            />
            <ConfigNumberInput
              input_id="win_through"
              label="勝ち抜け人数"
              max={game.players.length}
              currentProfile={currentProfile}
            />
            <ConfigNumberInput
              input_id="correct_me"
              label="自分が正答"
              min={-10}
              currentProfile={currentProfile}
            />
            <ConfigNumberInput
              input_id="wrong_me"
              label="自分が誤答"
              min={-10}
              currentProfile={currentProfile}
            />
            <ConfigNumberInput
              input_id="correct_other"
              label="他人が正答"
              min={-10}
              currentProfile={currentProfile}
            />
            <ConfigNumberInput
              input_id="wrong_other"
              label="他人が誤答"
              min={-10}
              currentProfile={currentProfile}
            />
          </>
        )}
        {game.rule === "endless-chance" && (
          <ConfigBooleanInput
            input_id="use_r"
            rule={game.rule}
            helperText="オンにすると、誤答のたびに指定された回数だけ休みとなります。"
            label="NOM休を利用する"
            currentProfile={currentProfile}
          />
        )}
        {game.rule === "nomx-ad" && (
          <ConfigBooleanInput
            helperText="abcの新ルールを使いたい場合はこちらを無効にしてください。"
            input_id="streak_over3"
            label="3連答以上によるアドバンテージを有効にする"
            rule={game.rule}
            currentProfile={currentProfile}
          />
        )}
        {game.rule === "aql" && (
          <AQLOptions game={game} currentProfile={currentProfile} />
        )}
        {game.rule !== "normal" && (
          <ConfigLimit
            game_id={game.id}
            rule={game.rule}
            currentProfile={currentProfile}
          />
        )}
      </Flex>
    </>
  );
};
export default RuleSettings;
