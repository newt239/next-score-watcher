import { Flex, NumberInput, Switch } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";
import { RuleNames } from "@/utils/types";

type Props = {
  rule: RuleNames;
  game_id: string;
};

const ConfigLimit: React.FC<Props> = ({ rule, game_id }) => {
  const game = useLiveQuery(() => db().games.get(game_id as string));

  if (!game) return null;

  const onGameLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    db().games.update(game_id, {
      limit: event.target.checked ? 10 : undefined,
    });
    if (rule !== "attacksurvival") {
      db().games.update(game_id, {
        win_through: event.target.checked ? 3 : undefined,
      });
    }
  };

  return (
    <Flex direction="column" pt={5}>
      <Switch
        checked={typeof game?.limit !== "undefined"}
        onChange={onGameLimitToggle}
        label="限定問題数を設定する"
        size="md"
      />
      <Flex gap={3} p={3}>
        <NumberInput
          disabled={typeof game?.limit === "undefined"}
          label="限定問題数"
          max={100}
          min={0}
          onChange={(n) => {
            db().games.update(game_id, {
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
            db().games.update(game_id, {
              win_through: typeof n === "number" ? n : 0,
            });
          }}
          value={game.win_through}
        />
      </Flex>
    </Flex>
  );
};

export default ConfigLimit;
