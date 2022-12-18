import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";

import db from "utils/db";

type InputProps = {
  id: string;
  label: string;
  placehodler: string;
  required: boolean;
};
const Input: React.FC<{ props: InputProps }> = ({ props }) => {
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
        value={game.name}
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

export default Input;
