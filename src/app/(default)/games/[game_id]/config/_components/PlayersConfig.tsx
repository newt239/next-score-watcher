"use client";

import { useEffect } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Center,
  Group,
  NumberInput,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GripVertical } from "tabler-icons-react";

import SelectPlayerDrawer from "./SelectPlayerDrawer";

import db from "@/utils/db";
import { GameDBPlayerProps, PlayerDBProps, RuleNames } from "@/utils/types";

type Props = {
  game_id: string;
  rule_name: RuleNames;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  disabled?: boolean;
};

const PlayersConfig: React.FC<Props> = ({
  game_id,
  rule_name,
  playerList,
  players,
  disabled,
}) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      players,
    },
    onValuesChange: async (values) => {
      if (values.players.length === players.length) {
        for (let i = 0; i < players.length; i++) {
          // 並び替えまたは個人設定の変更が行われたときのみ1回だけ処理する
          await db().games.update(game_id, {
            players: values.players,
          });
          break;
        }
      }
    },
  });

  useEffect(() => {
    if (players.length !== form.values.players.length) {
      form.setFieldValue("players", players);
    }
  }, [players]);

  const fields = form.getValues().players.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided) => (
        <ScrollArea
          offsetScrollbars
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Group w={500} className="flex-nowrap">
            <Center {...provided.dragHandleProps}>
              <GripVertical size="1.2rem" />
            </Center>
            <TextInput
              label="プレイヤー名"
              placeholder="John Doe"
              size="md"
              key={form.key(`players.${index}.name`)}
              {...form.getInputProps(`players.${index}.name`)}
            />
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
          </Group>
        </ScrollArea>
      )}
    </Draggable>
  ));

  return (
    <>
      <SelectPlayerDrawer
        disabled={disabled}
        game_id={game_id}
        playerList={playerList}
        players={players}
      />
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
          <p>
            ※個人設定が行える形式では、個人の初期値を変更した場合、1問目の時点での勝ち抜けリーチや失格リーチが正しく表示されないことがあります。
          </p>
        </> // 上記はgetInitialPlayersStateでstateとreach_stateを共通でplayingにしていることによるもの
      )}
    </>
  );
};

export default PlayersConfig;
