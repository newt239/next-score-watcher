import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import router, { useRouter } from "next/router";

import db from "#/utils/db";
import state from "#/utils/state";

const BoardHeader: React.FC = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  if (!game || !players || !logs) {
    return null;
  }
  return (
    <div>
      <div
        className="navbar rounded-box bg-base-100 shadow-xl"
        style={{ gap: "3vw" }}
      >
        <div
          className="flex-none"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h2 style={{ fontSize: "2rem" }}>{game.name}</h2>
          <p color="white">{state[game.type]}</p>
        </div>
        <div
          className="flex-1"
          style={{ display: "flex", flexGrow: 1, alignItems: "center" }}
        >
          <div style={{ padding: 2, minWidth: 50 }}>Q {logs.length + 1}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
              borderColor: "green.500",
              borderLeftWidth: 2,
            }}
          >
            <div>問題文</div>
            <div color="red">答え</div>
          </div>
        </div>
        <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn m-1">
              設定
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <button
                className="btn"
                disabled={logs.length === 0}
                onClick={async () => {
                  try {
                    await db.logs.delete(Number(logs[logs.length - 1].id));
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                一つ戻す
              </button>
              <Link href={`/${game.id}/config`} className="btn">
                設定に戻る
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;
