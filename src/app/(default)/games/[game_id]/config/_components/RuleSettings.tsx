import ConfigLimit from "./ConfigLimit";
import ConfigNumberInput from "./ConfigNumberInput";
import ConfigTextInput from "./ConfigTextInput";

import { GamePlayersDB, GamesDB, RuleNames } from "#/utils/types";
import { css } from "@panda/css";

type RuleSettingsProps = {
  game: GamesDB["Row"];
  game_players: GamePlayersDB["Insert"][];
  disabled: boolean;
};

const RuleSettings: React.FC<RuleSettingsProps> = ({
  game,
  game_players,
  disabled,
}) => {
  return (
    <>
      <ConfigTextInput
        defaultValue={game.name}
        game_id={game.id}
        input_id="name"
        label="ゲーム名"
        placeholder="〇〇大会"
      />
      {game.rule !== "normal" && (
        <ConfigLimit
          game_id={game.id}
          limit={game.limit}
          rule={game.rule as RuleNames}
          win_through={game.win_through}
        />
      )}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          pt: "16px",
        })}
      >
        {["nomx", "nomx-ad", "nomr"].includes(game.rule as RuleNames) && (
          <ConfigNumberInput
            defaultValue={game.win_point || 0}
            disabled={disabled}
            game_id={game.id}
            input_id="win_point"
            label="勝ち抜け正解数"
            max={1000}
          />
        )}
        {["ny", "variables"].includes(game.rule as RuleNames) && (
          <ConfigNumberInput
            defaultValue={game.win_point || 0}
            disabled={disabled}
            game_id={game.id}
            input_id="win_point"
            label="勝ち抜けポイント"
            max={1000}
            min={3}
          />
        )}
        {["nbyn", "nupdown"].includes(game.rule as RuleNames) && (
          <ConfigNumberInput
            defaultValue={game.win_point || 0}
            disabled={disabled}
            game_id={game.id}
            input_id="win_point"
            label="N"
            max={10}
          />
        )}
        {["squarex", "freezex"].includes(game.rule as RuleNames) && (
          <ConfigNumberInput
            defaultValue={game.win_point || 0}
            disabled={disabled}
            game_id={game.id}
            input_id="win_point"
            label="X"
            max={100}
          />
        )}
        {["nomx", "nomx-ad", "nbyn", "nupdown", "nomr"].includes(
          game.rule as RuleNames
        ) && (
          <ConfigNumberInput
            defaultValue={game.lose_point || 0}
            disabled={disabled}
            game_id={game.id}
            input_id="lose_point"
            label={game.rule === "nomr" ? "休み(M)" : "失格誤答数"}
            max={100}
          />
        )}
        {["attacksurvival"].includes(game.rule as RuleNames) && (
          <>
            <ConfigNumberInput
              defaultValue={game.win_point || 0}
              disabled={disabled}
              game_id={game.id}
              input_id="win_point"
              label="共通初期値"
              max={30}
              min={1}
            />
            <ConfigNumberInput
              defaultValue={game.win_through || 0}
              disabled={disabled}
              game_id={game.id}
              input_id="win_through"
              label="勝ち抜け人数"
              max={game_players.length}
            />
            <ConfigNumberInput
              defaultValue={game.lose_point || 0}
              disabled={disabled}
              game_id={game.id}
              input_id="correct_me"
              label="自分が正答"
              min={-10}
            />
            <ConfigNumberInput
              defaultValue={game.wrong_me || 0}
              disabled={disabled}
              game_id={game.id}
              input_id="wrong_me"
              label="自分が誤答"
              min={-10}
            />
            <ConfigNumberInput
              defaultValue={game.correct_other || 0}
              disabled={disabled}
              game_id={game.id}
              input_id="correct_other"
              label="他人が正答"
              min={-10}
            />
            <ConfigNumberInput
              defaultValue={game.wrong_other || 0}
              disabled={disabled}
              game_id={game.id}
              input_id="wrong_other"
              label="他人が誤答"
              min={-10}
            />
          </>
        )}
      </div>
    </>
  );
};
export default RuleSettings;
