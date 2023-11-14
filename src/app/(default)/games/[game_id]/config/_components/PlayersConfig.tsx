"use client";

import { Upload } from "tabler-icons-react";

import CompactPlayerTable from "./CompactPlayerTable";
import PlayersColumn from "./PlayersColumn";

import ButtonLink from "#/app/_components/ButtonLink";
import {
  GamePlayerPropsOnSupabase,
  PlayerPropsOnSupabase,
  RuleNames,
} from "#/utils/types";
import { css } from "@panda/css";

type SelectPlayerProps = {
  game_id: string;
  rule_name: RuleNames;
  players: PlayerPropsOnSupabase[];
  game_players: GamePlayerPropsOnSupabase[];
  game_player_ids: string[];
  disabled?: boolean;
};

const PlayersConfig: React.FC<SelectPlayerProps> = ({
  game_id,
  rule_name,
  players,
  game_players,
  game_player_ids,
  disabled,
}) => {
  const parsedGamePlayers = game_player_ids.map((game_player_id) => {
    const player = game_players.find(
      (game_player) => `${game_id}_${game_player_id}` === game_player.id
    );
    return {
      id: game_player_id,
      name: player?.name as string,
    };
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "16px",
        lg: {
          flexDirection: "row-reverse",
        },
      })}
    >
      <div
        className={css({
          lg: {
            width: "60%",
          },
        })}
      >
        <h3>プレイヤー選択</h3>
        {players.length === 0 ? (
          <ButtonLink href={`/players?from=${game_id}`} leftIcon={<Upload />}>
            プレイヤーデータを読み込む
          </ButtonLink>
        ) : (
          <>
            <CompactPlayerTable
              game_id={game_id}
              game_player_ids={game_player_ids}
              players={players}
            />
          </>
        )}
      </div>
      <div
        className={css({
          lg: {
            width: "30%",
          },
        })}
      >
        <h3>並び替え</h3>
        {parsedGamePlayers.length !== 0 ? (
          <>
            <div
              className={css({
                mt: 3,
                p: 3,
                bgColor: "gray.300",
                _dark: {
                  bgColor: "gray.600",
                },
              })}
            >
              <PlayersColumn
                game_id={game_id}
                game_players={parsedGamePlayers}
              />
            </div>
          </>
        ) : (
          <div>ここに選択されたプレイヤーが表示されます</div>
        )}
      </div>
    </div>
  );
};

export default PlayersConfig;
