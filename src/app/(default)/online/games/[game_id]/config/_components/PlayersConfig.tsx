"use client";

import { useEffect, useTransition } from "react";

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

import type {
  GameDBPlayerProps,
  PlayerDBProps,
  RuleNames,
} from "@/utils/types";

// import createApiClient from "@/utils/hono/client";

type Props = {
  game_id: string;
  rule: RuleNames;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
};

/**
 * オンライン版プレイヤー設定コンポーネント
 * プレイヤーの順序変更、個別設定の変更を行う
 */
const PlayersConfig: React.FC<Props> = ({
  game_id,
  rule,
  playerList,
  players,
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      players,
    },
  });

  const [debouncedPlayers] = useDebouncedValue(form.getValues().players, 500);

  // デバウンス後の値が変更されたらAPIで更新
  useEffect(() => {
    if (debouncedPlayers.length === players.length) {
      startTransition(async () => {
        try {
          // TODO: プレイヤーの一括更新APIが必要
          // const apiClient = createApiClient();
          // await apiClient.games.$patch({
          //   json: [{ id: game_id }],
          // });
        } catch (error) {
          console.error("Failed to update players:", error);
        }
      });
    }
  }, [debouncedPlayers, players.length, game_id]);

  const fields = form.getValues().players.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
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
      {players.length !== 0 && (
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
        playerList={playerList}
        players={players}
        form={form}
        disabled={isPending}
      />
    </>
  );
};

export default PlayersConfig;
