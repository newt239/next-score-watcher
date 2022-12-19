import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";
import { Form, Input } from "semantic-ui-react";

import db, { GameDBProps, PlayerDBProps } from "#/utils/db";

type NumberInputProps =
  | {
      type: "game";
      input_id: keyof GameDBProps;
      label: string;
      min: number;
      max: number;
    }
  | {
      type: "player";
      input_id: keyof PlayerDBProps;
      id: number;
      label: string;
      min: number;
      max: number;
    };

const ConfigNumberInput: React.FC<{ props: NumberInputProps }> = ({
  props,
}) => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  if (!game || !players) {
    return null;
  }
  const inputValue = () => {
    if (props.type === "game") {
      return game[props.input_id] as string;
    } else if (props.type === "player") {
      return (
        players.find((player) => player.id === props.id) as PlayerDBProps
      )[props.input_id] as string;
    }
  };

  return (
    <Form.Field>
      <label
        htmlFor={`${props.type}_${props.input_id}${
          props.type === "player" && "_" + props.id
        }`}
      >
        {props.label}
      </label>
      <Input
        id={`${props.type}_${props.input_id}${
          props.type === "player" && "_" + props.id
        }`}
        type="number"
        value={inputValue()}
        min={props.min}
        max={props.max}
        onChange={(v) => {
          if (props.type === "game") {
            db.games.update(Number(game_id), {
              [props.input_id]: v.target.value as string,
            });
          } else if (props.type === "player") {
            db.players.update(Number(props.id), {
              [props.input_id]: v.target.value as string,
            });
          }
        }}
      />
    </Form.Field>
  );
};

export default ConfigNumberInput;
