import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";

import db, { gameDBProps } from "utils/db";

type NumberInputProps = {
  id: keyof gameDBProps;
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
  if (!game) {
    return null;
  }
  return (
    <div className="form-control">
      <label className="label" htmlFor={props.id}>
        <span className="label-text">{props.label}</span>
      </label>
      <input
        id={props.id}
        type="range"
        value={game[props.id]}
        min={props.min}
        max={props.max}
        className="range"
        onChange={(v) =>
          db.games.update(Number(game_id), {
            [props.id]: v.target.value as string,
          })
        }
      />
      {game.count}
    </div>
  );
};

export default ConfigNumberInput;
