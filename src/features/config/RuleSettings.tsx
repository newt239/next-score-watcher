import { Grid, VStack } from "@chakra-ui/react";

import ConfigBooleanInput from "~/features/config/ConfigBooleanInput";
import ConfigInput from "~/features/config/ConfigInput";
import ConfigLimit from "~/features/config/ConfigLimit";
import ConfigNumberInput from "~/features/config/ConfigNumberInput";
import { GamePropsUnion } from "~/utils/types";

type RuleSettingsProps = {
  game: GamePropsUnion;
  disabled: boolean;
};

const RuleSettings: React.FC<RuleSettingsProps> = ({ game, disabled }) => {
  return (
    <>
      <ConfigInput input_id="name" label="ゲーム名" placeholder="〇〇大会" />
      {game.rule !== "normal" && (
        <ConfigLimit game_id={game.id} rule={game.rule} />
      )}
      <Grid
        sx={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {["nomx", "nomx-ad", "nomr", "endless-chance"].includes(game.rule) && (
          <ConfigNumberInput
            disabled={disabled}
            input_id="win_point"
            label="勝ち抜け正解数"
            max={1000}
          />
        )}
        {["ny", "variables"].includes(game.rule) && (
          <ConfigNumberInput
            disabled={disabled}
            input_id="win_point"
            label="勝ち抜けポイント"
            max={1000}
            min={3}
          />
        )}
        {["nbyn", "nupdown"].includes(game.rule) && (
          <ConfigNumberInput
            disabled={disabled}
            input_id="win_point"
            label="N"
            max={10}
          />
        )}
        {["squarex", "freezex"].includes(game.rule) && (
          <ConfigNumberInput
            disabled={disabled}
            input_id="win_point"
            label="X"
            max={100}
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
      </Grid>
      <VStack py={4}>
        {game.rule === "nomx-ad" && (
          <ConfigBooleanInput
            disabled={disabled}
            helperText="abcの新ルールを使いたい場合はこちらを無効にしてください。"
            input_id="streak_over3"
            label="3連答以上によるアドバンテージを有効にする"
            rule={game.rule}
          />
        )}
      </VStack>
    </>
  );
};
export default RuleSettings;
