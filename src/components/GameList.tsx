import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";

import db from "#/utils/db";

const GameList: React.FC = () => {
  const games = useLiveQuery(() => db.games.toArray());
  return (
    <div>
      {games?.map((game) => (
        <div key={game.id} className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{game.name}</h2>
            <p>{game.type}</p>
            <div className="card-actions justify-end">
              <Link href={`/${game.id}/config`} className="btn-primary btn">
                設定
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
