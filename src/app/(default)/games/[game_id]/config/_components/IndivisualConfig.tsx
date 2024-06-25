"use client";

import { useParams } from "next/navigation";

import { Button, NumberInput, Popover, Title } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";

type Props = {
  index: number;
  correct: boolean;
  wrong: boolean;
  disabled?: boolean;
  currentProfile: string;
};

const IndividualConfig: React.FC<Props> = ({
  index,
  correct,
  wrong,
  disabled,
  currentProfile,
}) => {
  const { game_id } = useParams();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );

  if ((!correct && !wrong) || !game || game.players.length <= index)
    return null;

  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button disabled={disabled}>初期値の変更</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Title order={4}>個人設定: {game.players[index].name}</Title>
        {correct && (
          <NumberInput
            label={
              game.rule === "variables"
                ? "初期ポイント"
                : game.rule === "attacksurvival"
                ? "共通初期値との差"
                : "初期正答数"
            }
            defaultValue={game.players[index]?.initial_correct || 0}
            min={game.rule !== "attacksurvival" ? 0 : undefined}
            onChange={async (n) => {
              if (typeof n === "number") {
                const newPlayers = game.players.map((gamePlayer, pi) => {
                  if (pi === index) {
                    return {
                      ...gamePlayer,
                      initial_correct: n,
                    };
                  } else {
                    return gamePlayer;
                  }
                });
                await db(currentProfile).games.update(game_id as string, {
                  players: newPlayers,
                });
              }
            }}
          />
        )}
        {wrong && (
          <NumberInput
            label="初期誤答数"
            defaultValue={game.players[index]?.initial_wrong || 0}
            max={game.rule === "backstream" ? 4 : undefined}
            min={0}
            onChange={async (n) => {
              if (game && typeof n === "number") {
                await db(currentProfile).games.update(game_id as string, {
                  players: game.players.map((gamePlayer, pi) =>
                    pi === index
                      ? {
                          ...gamePlayer,
                          initial_wrong: n,
                        }
                      : gamePlayer
                  ),
                });
              }
            }}
          />
        )}
        {game.rule === "variables" && (
          <NumberInput
            label="N"
            defaultValue={game.players[index]?.base_correct_point || 0}
            min={3}
            onChange={async (n) => {
              if (game && typeof n === "number") {
                await db(currentProfile).games.update(game_id as string, {
                  players: game.players.map((gamePlayer, pi) =>
                    pi === index
                      ? {
                          ...gamePlayer,
                          base_correct_point: n,
                          base_wrong_point: Math.min(-n * (n - 2), -3),
                        }
                      : gamePlayer
                  ),
                });
              }
            }}
          />
        )}
      </Popover.Dropdown>
    </Popover>
  );
};

export default IndividualConfig;
