"use client";

import { useEffect } from "react";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useAtom } from "jotai";

import DroppablePlayerCard from "./DroppablePlayerCard";

import { onGamePlayersUpdate } from "#/utils/actions";
import { globalGamePlayersAtom } from "#/utils/jotai";
import { css } from "@panda/css";

type PlayersColumnProps = {
  game_id: string;
  game_players: {
    id: string;
    name: string;
  }[];
};

const PlayersColumn: React.FC<PlayersColumnProps> = ({
  game_id,
  game_players,
}) => {
  const [globalGamePlayers, setGlobalGamePlayers] = useAtom(
    globalGamePlayersAtom
  );

  useEffect(() => {
    setGlobalGamePlayers(
      game_players.map((game_player) => {
        return {
          id: game_player.id,
          name: game_player.name,
        };
      })
    );
  }, [game_players]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setGlobalGamePlayers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        onGamePlayersUpdate({
          game_id,
          players: globalGamePlayers,
        });

        return newItems;
      });
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={globalGamePlayers}>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "8px",
          })}
        >
          {globalGamePlayers.map((card) => (
            <DroppablePlayerCard id={card.id} key={card.id} title={card.name} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PlayersColumn;
