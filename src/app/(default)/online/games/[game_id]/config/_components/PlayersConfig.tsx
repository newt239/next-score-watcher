"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Center,
  Group,
  NumberInput,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconGripVertical } from "@tabler/icons-react";
import { parseResponse } from "hono/client";

import SelectPlayer from "./SelectPlayer/SelectPlayer";

import type { GamePlayerProps, PlayerProps, RuleNames } from "@/models/games";

import createApiClient from "@/utils/hono/browser";

type Props = {
  game_id: string;
  rule: RuleNames;
  players: PlayerProps[];
  gamePlayers: GamePlayerProps[];
  onPlayerCountChange?: (playerCount: number) => void;
};

/**
 * オンライン版プレイヤー設定コンポーネント
 * プレイヤーの順序変更、個別設定の変更を行う
 */
const PlayersConfig: React.FC<Props> = ({
  game_id,
  rule,
  players,
  gamePlayers,
  onPlayerCountChange,
}) => {
  const [isPending, startTransition] = useTransition();
  const [currentGamePlayers, setCurrentGamePlayers] = useState(gamePlayers);
  const initialPlayersRef = useRef(gamePlayers);
  const isInitialMount = useRef(true);
  const apiClient = createApiClient();

  // propsが変更された時に内部状態も更新
  useEffect(() => {
    setCurrentGamePlayers(gamePlayers);
  }, [gamePlayers]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      players: currentGamePlayers,
    },
  });

  // 内部状態が変更されたらフォームも更新
  useEffect(() => {
    form.setValues({ players: currentGamePlayers });
  }, [currentGamePlayers]);

  const [debouncedPlayers] = useDebouncedValue(form.getValues().players, 500);

  // プレイヤーの変更を処理
  const handlePlayersChange = async (newGamePlayerIds: string[]) => {
    // newGamePlayerIdsを基に新しいGamePlayerPropsの配列を作成
    const newGamePlayers: GamePlayerProps[] = newGamePlayerIds.map(
      (playerId, index) => {
        // 既存のゲームプレイヤーから探す
        const existingGamePlayer = currentGamePlayers.find(
          (gp) => gp.id === playerId
        );
        if (existingGamePlayer) {
          return {
            ...existingGamePlayer,
            displayOrder: index,
          };
        }

        // 新しいプレイヤーの場合、playersから情報を取得
        const player = players.find((p) => p.id === playerId);
        return {
          id: playerId,
          name: player?.name || "不明なプレイヤー",
          description: player?.description || "",
          affiliation: player?.affiliation || "",
          displayOrder: index,
          initialScore: 0,
          initialCorrectCount: 0,
          initialWrongCount: 0,
        } as GamePlayerProps;
      }
    );

    setCurrentGamePlayers(newGamePlayers);

    // 親コンポーネントにプレイヤー数の変更を通知
    if (onPlayerCountChange) {
      onPlayerCountChange(newGamePlayers.length);
    }
  };

  // デバウンス後の値が変更されたらAPIで更新
  useEffect(() => {
    // 初期マウント時はAPIを呼ばない
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // プレイヤーデータに実質的な変更があるかチェック
    const hasRealChanges = debouncedPlayers.some((player, index) => {
      const initialPlayer = initialPlayersRef.current[index];
      if (!initialPlayer) return true;
      return (
        player.name !== initialPlayer.name ||
        player.initialCorrectCount !== initialPlayer.initialCorrectCount ||
        player.initialWrongCount !== initialPlayer.initialWrongCount
      );
    });

    if (
      debouncedPlayers.length === currentGamePlayers.length &&
      currentGamePlayers.length > 0 &&
      hasRealChanges
    ) {
      startTransition(async () => {
        try {
          const updateData = debouncedPlayers.map((player, index) => ({
            id: player.id,
            name: player.name,
            displayOrder: index,
            initialScore: player.initialScore || 0,
            initialCorrectCount: player.initialCorrectCount || 0,
            initialWrongCount: player.initialWrongCount || 0,
          }));

          const result = await parseResponse(
            apiClient.games[":gameId"].players.$patch({
              param: { gameId: game_id },
              json: { players: updateData },
            })
          );

          if ("error" in result) {
            console.error("Failed to update players");
          } else {
            // 成功した場合は初期値を更新
            initialPlayersRef.current = [...debouncedPlayers];
          }
        } catch (error) {
          console.error("Failed to update players:", error);
        }
      });
    }
  }, [debouncedPlayers, currentGamePlayers.length, game_id]);

  const fields = form.getValues().players.map((item, index) => (
    <Draggable
      key={`player-${index}-${item.id}`}
      index={index}
      draggableId={`player-${index}-${item.id}`}
    >
      {(provided) => (
        <ScrollArea
          offsetScrollbars
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Group w={500} wrap="nowrap">
            <Center {...provided.dragHandleProps}>
              <IconGripVertical size="1.2rem" />
            </Center>
            <TextInput
              label="プレイヤー名"
              placeholder="John Doe"
              size="md"
              key={form.key(`players.${index}.name`)}
              {...form.getInputProps(`players.${index}.name`)}
            />
            {rule !== "squarex" && (
              <>
                <NumberInput
                  label="初期正答数"
                  size="md"
                  key={form.key(`players.${index}.initialCorrectCount`)}
                  {...form.getInputProps(
                    `players.${index}.initialCorrectCount`
                  )}
                />
                <NumberInput
                  label="初期誤答数"
                  size="md"
                  key={form.key(`players.${index}.initialWrongCount`)}
                  {...form.getInputProps(`players.${index}.initialWrongCount`)}
                />
              </>
            )}
            {rule === "squarex" && (
              <>
                <NumberInput
                  label="奇数問目の正解数"
                  size="md"
                  key={form.key(`players.${index}.initialCorrectCount`)}
                  {...form.getInputProps(
                    `players.${index}.initialCorrectCount`
                  )}
                />
                <NumberInput
                  label="偶数問目の正解数"
                  size="md"
                  key={form.key(`players.${index}.initialWrongCount`)}
                  {...form.getInputProps(`players.${index}.initialWrongCount`)}
                />
              </>
            )}
          </Group>
        </ScrollArea>
      )}
    </Draggable>
  ));

  return (
    <>
      {currentGamePlayers.length !== 0 && (
        <>
          <DragDropContext
            onDragEnd={({ destination, source }) =>
              destination?.index !== undefined &&
              form.reorderListItem("players", {
                from: source.index,
                to: destination.index,
              })
            }
          >
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fields}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
      <SelectPlayer
        game_id={game_id}
        players={players}
        gamePlayers={currentGamePlayers}
        disabled={isPending}
        onPlayersChange={handlePlayersChange}
      />
    </>
  );
};

export default PlayersConfig;
