import router from "next/router";

import db, { gameDBProps, Rule } from "#/utils/db";
import state from "#/utils/state";

export type RuleCardProps = {
  id: Rule;
  name: string;
  description: string;
};

const RuleCard: React.FC<RuleCardProps> = (rule) => {
  const createGame = async () => {
    try {
      const game_id = await db.games.put({
        name: state.rules[rule.id].name,
        count: 1,
        type: rule.id,
        correct_me: 1,
        wrong_me: -1,
        correct_other: 0,
        wrong_other: 0,
        started: false,
      });
      router.push(`/${game_id}/config`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{rule.name}</h2>
        <p>{rule.description}</p>
        <div className="card-actions justify-end">
          <button onClick={createGame} className="btn-primary btn">
            新規作成
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuleCard;
