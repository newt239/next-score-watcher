import { Flex, NumberInput, Switch } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import classes from "./ConfigLimit.module.css";

import db from "@/utils/db";
import { RuleNames } from "@/utils/types";

type Props = {
  rule: RuleNames;
  game_id: string;
  currentProfile: string;
};

const ConfigLimit: React.FC<Props> = ({ rule, game_id, currentProfile }) => {
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );

  if (!game) return null;

  const onGameLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    db(currentProfile).games.update(game_id, {
      limit: event.target.checked ? 10 : undefined,
    });
    if (rule !== "attacksurvival") {
      db(currentProfile).games.update(game_id, {
        win_through: event.target.checked ? 3 : undefined,
      });
    }
  };

  return (
    <Flex className={classes.config_limit}>
      <Switch
        checked={typeof game?.limit !== "undefined"}
        onChange={onGameLimitToggle}
        label="限定問題数を設定する"
        size="md"
      />
      <Flex className={classes.config_limit_inputs}>
        <NumberInput
          disabled={typeof game?.limit === "undefined"}
          label="限定問題数"
          max={100}
          min={0}
          onChange={(n) => {
            db(currentProfile).games.update(game_id, {
              limit: typeof n === "number" ? n : 0,
            });
          }}
          value={game.limit}
          size="md"
        />
        <NumberInput
          label="勝ち抜け人数"
          disabled={typeof game?.win_through === "undefined"}
          max={100}
          min={0}
          onChange={(n) => {
            db(currentProfile).games.update(game_id, {
              win_through: typeof n === "number" ? n : 0,
            });
          }}
          size="md"
          value={game.win_through}
        />
      </Flex>
    </Flex>
  );
};

export default ConfigLimit;
