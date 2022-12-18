import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";

import db, {
  gameDBProps,
  playerDBProps,
  ScoreWatcherDBTables,
} from "#/utils/db";

type NumberInputProps =
  | {
      type: "game";
      input_id: keyof gameDBProps;
      label: string;
      min: number;
      max: number;
    }
  | {
      type: "player";
      input_id: keyof playerDBProps;
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
      console.log("a");
      return game[props.input_id] as string;
    } else if (props.type === "player") {
      return players.find((player) => player.id === props.id)?.name as string;
    }
  };

  return (
    <div className="form-control">
      <label
        className="label"
        htmlFor={`${props.type}_${props.input_id}${
          props.type === "player" && "_" + props.id
        }`}
      >
        <span className="label-text">{props.label}</span>
      </label>
      <input
        id={`${props.type}_${props.input_id}${
          props.type === "player" && "_" + props.id
        }`}
        type="range"
        value={inputValue()}
        min={props.min}
        max={props.max}
        className="range"
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
      {props.type === "game"
        ? game[props.input_id]
        : (players.find((player) => player.id === props.id) as playerDBProps)[
            props.input_id
          ]}
    </div>
  );
};

export default ConfigNumberInput;
