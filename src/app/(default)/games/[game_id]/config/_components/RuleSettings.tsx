import { GamePropsUnion } from "@/utils/types";
import { Box, Flex } from "@mantine/core";
import ConfigBooleanInput from "./ConfigBooleanInput";
import ConfigInput from "./ConfigInput";
import ConfigLimit from "./ConfigLimit";
import ConfigNumberInput from "./ConfigNumberInput";

type RuleSettingsProps = {
  game: GamePropsUnion;
  disabled: boolean;
};

const RuleSettings: React.FC<RuleSettingsProps> = ({ game, disabled }) => {
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
      name: "X",
      max: 100,
      min: undefined,
    },
    freezex: {
      name: "X",
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
      <ConfigInput input_id="name" label="ゲーム名" placeholder="〇〇大会" />
      {game.rule !== "normal" && (
        <ConfigLimit game_id={game.id} rule={game.rule} />
      )}
      <Box
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
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
            disabled={disabled}
            input_id="win_point"
            label={
              winPointPaires[game.rule as keyof typeof winPointPaires].name
            }
            max={winPointPaires[game.rule as keyof typeof winPointPaires].max}
            min={winPointPaires[game.rule as keyof typeof winPointPaires].min}
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
            disabled={disabled}
            input_id="lose_point"
            label={game.rule === "nomr" ? "休み(M)" : "失格誤答数"}
            max={100}
          />
        )}
        {["attacksurvival"].includes(game.rule) && (
          <>
            <ConfigNumberInput
              disabled={disabled}
              input_id="win_point"
              label="共通初期値"
              max={30}
              min={1}
            />
            <ConfigNumberInput
              disabled={disabled}
              input_id="win_through"
              label="勝ち抜け人数"
              max={game.players.length}
            />
            <ConfigNumberInput
              disabled={disabled}
              input_id="correct_me"
              label="自分が正答"
              min={-10}
            />
            <ConfigNumberInput
              disabled={disabled}
              input_id="wrong_me"
              label="自分が誤答"
              min={-10}
            />
            <ConfigNumberInput
              disabled={disabled}
              input_id="correct_other"
              label="他人が正答"
              min={-10}
            />
            <ConfigNumberInput
              disabled={disabled}
              input_id="wrong_other"
              label="他人が誤答"
              min={-10}
            />
          </>
        )}
        {game.rule === "endless-chance" && (
          <ConfigBooleanInput
            input_id="use_r"
            rule={game.rule}
            helperText="オンにすると、誤答のたびに指定された回数だけ休みとなります。"
            label="NOM休を利用する"
          />
        )}
      </Box>
      <Flex py={4}>
        {game.rule === "nomx-ad" && (
          <ConfigBooleanInput
            disabled={disabled}
            helperText="abcの新ルールを使いたい場合はこちらを無効にしてください。"
            input_id="streak_over3"
            label="3連答以上によるアドバンテージを有効にする"
            rule={game.rule}
          />
        )}
      </Flex>
    </>
  );
};
export default RuleSettings;
