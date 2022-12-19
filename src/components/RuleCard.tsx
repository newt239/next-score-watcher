import router from "next/router";
import { Button, Card } from "semantic-ui-react";

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
    <Card>
      <Card.Content>
        <Card.Header>{rule.name}</Card.Header>
        <Card.Description>{rule.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Button floated="right" primary onClick={createGame}>
            新規作成
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default RuleCard;
