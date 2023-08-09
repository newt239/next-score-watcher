import { Grid } from "@chakra-ui/react";

import ConfigInput from "#/components/config/ConfigInput";
import ConfigLimit from "#/components/config/ConfigLimit";
import ConfigNumberInput from "#/components/config/ConfigNumberInput";
import { GameDBProps } from "#/utils/types";

type RuleSettingsProps = {
  game: GameDBProps;
  disabled: boolean;
};

const RuleSettings: React.FC<RuleSettingsProps> = ({ game, disabled }) => {
  return (
    <>
      <ConfigInput input_id="name" label="ゲーム名" placehodler="〇〇大会" />
      {game.rule !== "normal" && (
        <ConfigLimit
          game_id={game.id}
          limit={game.limit}
          win_through={game.win_through}
        />
      )}
      <Grid
        sx={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {["nomx", "nomx-ad", "nomr"].includes(game.rule) && (
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
        {["nomx", "nomx-ad", "nbyn", "nupdown", "nomr"].includes(game.rule) && (
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
              label="初期値"
              max={30}
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
      </Grid>
    </>
  );
};
export default RuleSettings;
