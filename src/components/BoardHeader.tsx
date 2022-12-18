import { useLiveQuery } from "dexie-react-hooks";
import router, { useRouter } from "next/router";

import db from "#/utils/db";

const BoardHeader: React.FC = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  if (!game) {
    return null;
  }
  return (
    <div>
      <div className="navbar bg-base-100" style={{ gap: "3vw" }}>
        <div
          className="flex-none"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h2 style={{ fontSize: "2rem" }}>{game.name}</h2>
          <p color="white">{game.type}</p>
        </div>
        <div
          className="flex-1"
          style={{ display: "flex", flexGrow: 1, alignItems: "center" }}
        >
          <div style={{ padding: 2, minWidth: 50 }}>Q {1 + 1}</div>
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
          <button className="btn-ghost btn-square btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;
