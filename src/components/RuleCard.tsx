import router from "next/router";
import { Button, Card } from "semantic-ui-react";

import db, { Rules } from "#/utils/db";
import state from "#/utils/state";

export type RuleCardProps = {
  id: Rules;
  name: string;
  description: string;
};

const RuleCard: React.FC<RuleCardProps> = (rule) => {
  const createGame = async () => {
    try {
      const game_id = await db.games.put({
        name: state.rules[rule.id].name,
        count: state.rules[rule.id].count,
        rule: rule.id,
        correct_me: 1,
        wrong_me: -1,
        started: false,
        quizset_offset: 0,
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
        <Button floated="right" primary onClick={createGame}>
          新規作成
        </Button>
      </Card.Content>
    </Card>
  );
};

export default RuleCard;
