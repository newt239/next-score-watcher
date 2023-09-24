import FormControl from "#/app/_components/FormControl";
import NumberInput from "#/app/_components/NumberInput";
import Switch from "#/app/_components/Switch";
import db from "#/utils/db";
import { str2num } from "#/utils/functions";
import { RuleNames } from "#/utils/types";
import { css } from "@panda/css";

type ConfigLimitProps = {
  rule: RuleNames;
  game_id: string;
  limit: number | null;
  win_through: number | null;
};

const ConfigLimit: React.FC<ConfigLimitProps> = ({
  rule,
  game_id,
  limit,
  win_through,
}) => {
  const onGameLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    db.games.update(game_id, {
      limit: event.target.checked ? 10 : undefined,
    });
    if (rule !== "attacksurvival") {
      db.games.update(game_id, {
        win_through: event.target.checked ? 3 : undefined,
      });
    }
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        pt: "16px",
      })}
    >
      <FormControl label="限定問題数を設定する">
        <Switch id="game-limit-toggle" onChange={onGameLimitToggle}>
          限定問題数を設定する
        </Switch>
      </FormControl>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          p: "16px",
        })}
      >
        <FormControl label="限定問題数">
          <NumberInput
            disabled={!limit}
            id="limit-input"
            max={100}
            min={0}
            onChange={(s) => {
              db.games.update(game_id, {
                limit: str2num(s),
              });
            }}
            value={typeof limit === "number" ? limit : undefined}
          />
        </FormControl>
        <FormControl label="勝ち抜け人数">
          <NumberInput
            disabled={!win_through}
            id="win_through-input"
            max={100}
            min={0}
            onChange={(s) => {
              db.games.update(game_id, {
                win_through: str2num(s),
              });
            }}
            value={typeof win_through === "number" ? win_through : undefined}
          />
        </FormControl>
      </div>
    </div>
  );
};

export default ConfigLimit;
