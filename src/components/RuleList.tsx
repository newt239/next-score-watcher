import router from "next/router";

import { Button, Card } from "semantic-ui-react";

import db from "#/utils/db";
import state from "#/utils/state";

const RuleList: React.FC = () => {
  const ruleList = Object.keys(state.rules) as (keyof typeof state.rules)[];
  return (
    <Card.Group>
      {ruleList.map((id) => (
        <Card key={id}>
          <Card.Content>
            <Card.Header>{state.rules[id].name}</Card.Header>
            <Card.Description>{state.rules[id].description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button
              primary
              onClick={async () => {
                try {
                  const game_id = await db.games.put({
                    name: state.rules[id].name,
                    count: state.rules[id].count,
                    rule: id,
                    correct_me: 1,
                    wrong_me: -1,
                    started: false,
                    quizset_offset: 0,
                  });
                  router.push(`/${game_id}/config`);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              新規作成
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default RuleList;
