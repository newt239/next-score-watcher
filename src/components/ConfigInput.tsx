import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";
import { Form, Input } from "semantic-ui-react";

import db, {
  gameDBProps,
  playerDBProps,
  ScoreWatcherDBTables,
} from "#/utils/db";

type InputProps =
  | {
      type: "game";
      input_id: keyof gameDBProps;
      label: string;
      placehodler: string;
      required: boolean;
    }
  | {
      type: "player";
      input_id: keyof playerDBProps;
      id: number;
      label: string;
      placehodler: string;
      required: boolean;
    };

const ConfigInput: React.FC<{ props: InputProps }> = ({ props }) => {
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
      return players.find((player) => player.id === props.id)?.name as string;
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
        type="text"
        placeholder={props.placehodler}
        value={inputValue()}
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

export default ConfigInput;
