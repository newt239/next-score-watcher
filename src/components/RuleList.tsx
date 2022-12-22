import router from "next/router";

import { Button, Card } from "semantic-ui-react";

import db, { Rules } from "#/utils/db";
import state from "#/utils/state";

const RuleList: React.FC = () => {
  const ruleList = Object.keys(state.rules) as (keyof typeof state.rules)[];

  const createGame = async (rule: Rules) => {
    try {
      const game_id = await db.games.put({
        name: state.rules[rule].name,
        count: 3,
        rule,
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
    <Card.Group>
      {ruleList.map((id) => (
        <Card key={id}>
          <Card.Content>
            <Card.Header>{state.rules[id].name}</Card.Header>
            <Card.Description>{state.rules[id].description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button primary onClick={() => createGame(id)}>
              新規作成
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default RuleList;
