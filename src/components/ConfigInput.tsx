import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";

import db, { gameDBProps } from "utils/db";

type InputProps = {
  id: keyof gameDBProps;
  label: string;
  placehodler: string;
  required: boolean;
};

const ConfigInput: React.FC<{ props: InputProps }> = ({ props }) => {
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
        type="text"
        placeholder={props.placehodler}
        value={game[props.id] as string}
        className="input w-full max-w-xs"
        onChange={(v) =>
          db.games.update(Number(game_id), {
            [props.id]: v.target.value as string,
          })
        }
      />
    </div>
  );
};

export default ConfigInput;
