"use client";

import { useEffect, useRef, useTransition } from "react";

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

import SelectPlayer from "./SelectPlayer/SelectPlayer";

import type { GamePlayerProps, PlayerProps, RuleNames } from "@/models/games";

type Props = {
  game_id: string;
  rule: RuleNames;
  players: PlayerProps[];
  gamePlayers: GamePlayerProps[];
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
}) => {
  const [isPending, startTransition] = useTransition();
  const initialPlayersRef = useRef(gamePlayers);
  const isInitialMount = useRef(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      players: gamePlayers,
    },
  });

  const [debouncedPlayers] = useDebouncedValue(form.getValues().players, 500);

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
      debouncedPlayers.length === gamePlayers.length &&
      gamePlayers.length > 0 &&
      hasRealChanges
    ) {
      startTransition(async () => {
        // TODO: ゲームプレイヤー更新APIを呼ぶ
      });
    }
  }, [debouncedPlayers, gamePlayers.length, game_id]);

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
                  key={form.key(`players.${index}.initial_correct`)}
                  {...form.getInputProps(`players.${index}.initial_correct`)}
                />
                <NumberInput
                  label="初期誤答数"
                  size="md"
                  key={form.key(`players.${index}.initial_wrong`)}
                  {...form.getInputProps(`players.${index}.initial_wrong`)}
                />
              </>
            )}
            {rule === "squarex" && (
              <>
                <NumberInput
                  label="奇数問目の正解数"
                  size="md"
                  key={form.key(`players.${index}.initial_correct`)}
                  {...form.getInputProps(`players.${index}.initial_correct`)}
                />
                <NumberInput
                  label="偶数問目の正解数"
                  size="md"
                  key={form.key(`players.${index}.initial_wrong`)}
                  {...form.getInputProps(`players.${index}.initial_wrong`)}
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
      {gamePlayers.length !== 0 && (
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
        gamePlayers={gamePlayers}
        disabled={isPending}
      />
    </>
  );
};

export default PlayersConfig;
