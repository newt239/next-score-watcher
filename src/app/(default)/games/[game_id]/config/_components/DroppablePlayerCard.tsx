import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "tabler-icons-react";

import { css } from "@panda/css";

type DroppablePlayerCardType = {
  id: string;
  title: string;
};

const DroppablePlayerCard: React.FC<DroppablePlayerCardType> = ({
  id,
  title,
}) => {
  const {
    isDragging,
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: "white",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        className={css({
          display: "flex",
          gap: "8px",
        })}
      >
        <div
          className={css({
            position: "relative",
            cursor: isDragging ? "grabbing" : "grab",
          })}
          {...attributes}
          {...listeners}
          ref={setActivatorNodeRef}
        >
          <GripVertical />
        </div>
        <div id={id}>
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default DroppablePlayerCard;
