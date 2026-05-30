"use client";

import { useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ActionIcon, Card, Center, Menu, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconChevronDown,
  IconDotsVertical,
  IconGripVertical,
  IconPencil,
} from "@tabler/icons-react";

import db from "@/utils/db";

import EditPlayerModal from "./EditPlayerModal/EditPlayerModal";
import classes from "./PlayersConfig.module.css";
import SelectPlayer from "./SelectPlayer/SelectPlayer";

import type { GameDBPlayerProps, PlayerDBProps, RuleNames } from "@/utils/types";

type Props = {
  game_id: string;
  rule: RuleNames;
  playerList: PlayerDBProps[];
  players: GameDBPlayerProps[];
  currentProfile: string;
};

const PlayersConfig: React.FC<Props> = ({ game_id, rule, playerList, players, currentProfile }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // SPでは名前以外のフィールドを折り畳む。開いているプレイヤーをidで保持する
  const [openDetailIds, setOpenDetailIds] = useState<string[]>([]);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      players,
    },
    onValuesChange: async (values) => {
      // 並び替えまたは個人設定の変更が行われたときのみ1回だけ処理する
      if (values.players.length === players.length) {
        await db(currentProfile).games.update(game_id, {
          players: values.players,
        });
      }
    },
  });

  const fields = form.getValues().players.map((item, index) => {
    const detailOpen = openDetailIds.includes(item.id);
    return (
      <Draggable key={item.id} index={index} draggableId={item.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={classes.card_wrapper}
            {...provided.draggableProps}
          >
            <Card
              withBorder
              radius="md"
              shadow={snapshot.isDragging ? "xl" : "sm"}
              p="md"
              className={snapshot.isDragging ? classes.card_dragging : undefined}
            >
              <div className={classes.card_header}>
                <Center {...provided.dragHandleProps} className={classes.drag_handle}>
                  <IconGripVertical size="1.2rem" />
                </Center>
                <span className={classes.index}>プレイヤー {index + 1}</span>
                <div className={classes.spacer} />
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" aria-label="プレイヤー操作">
                      <IconDotsVertical size="1.2rem" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconPencil size="1rem" />}
                      onClick={() => setEditingIndex(index)}
                    >
                      元データを編集
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
              <div className={classes.fields}>
                <div className={classes.name_row}>
                  <TextInput
                    className={classes.name_field}
                    label="プレイヤー名"
                    placeholder="John Doe"
                    size="md"
                    key={form.key(`players.${index}.name`)}
                    {...form.getInputProps(`players.${index}.name`)}
                  />
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    className={classes.detail_toggle}
                    aria-label="詳細設定の開閉"
                    aria-expanded={detailOpen}
                    onClick={() =>
                      setOpenDetailIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      )
                    }
                  >
                    <IconChevronDown
                      size="1.2rem"
                      className={detailOpen ? classes.chevron_open : classes.chevron}
                    />
                  </ActionIcon>
                </div>
                <div
                  className={`${classes.detail_fields} ${
                    detailOpen ? classes.detail_fields_expanded : ""
                  }`}
                >
                  {rule !== "squarex" && (
                    <>
                      <NumberInput
                        className={classes.number_field}
                        label="初期正答数"
                        size="md"
                        key={form.key(`players.${index}.initial_correct`)}
                        {...form.getInputProps(`players.${index}.initial_correct`)}
                      />
                      <NumberInput
                        className={classes.number_field}
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
                        className={classes.number_field}
                        label="奇数問目の正解数"
                        size="md"
                        key={form.key(`players.${index}.initial_correct`)}
                        {...form.getInputProps(`players.${index}.initial_correct`)}
                      />
                      <NumberInput
                        className={classes.number_field}
                        label="偶数問目の正解数"
                        size="md"
                        key={form.key(`players.${index}.initial_wrong`)}
                        {...form.getInputProps(`players.${index}.initial_wrong`)}
                      />
                    </>
                  )}
                  {rule === "variables" && (
                    <NumberInput
                      className={classes.number_field}
                      label="N"
                      size="md"
                      key={form.key(`players.${index}.base_correct_point`)}
                      {...form.getInputProps(`players.${index}.base_correct_point`)}
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </Draggable>
    );
  });

  const editingGamePlayerId =
    editingIndex !== null ? form.getValues().players[editingIndex]?.id : undefined;
  const editingPlayer = playerList.find((player) => player.id === editingGamePlayerId);

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
        currentProfile={currentProfile}
        game_id={game_id}
        playerList={playerList}
        players={players}
        form={form}
      />
      {editingIndex !== null && editingPlayer && (
        <EditPlayerModal
          key={editingPlayer.id}
          opened
          onClose={() => setEditingIndex(null)}
          player={editingPlayer}
          currentProfile={currentProfile}
          onNameChange={(name) => form.setFieldValue(`players.${editingIndex}.name`, name)}
        />
      )}
    </>
  );
};

export default PlayersConfig;
