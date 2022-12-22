import router from "next/router";

import { Button, Card } from "semantic-ui-react";

import db, { GameDBProps, RuleNames } from "#/utils/db";
import { rules } from "#/utils/state";

const RuleList: React.FC = () => {
  const ruleNameList = Object.keys(rules) as (keyof typeof rules)[];

  const createGame = async (rule: RuleNames) => {
    try {
      const putData: GameDBProps = {
        name: rules[rule].name,
        count: 3,
        rule,
        correct_me: 1,
        wrong_me: -1,
        started: false,
        quizset_offset: 0,
      };
      switch (rule) {
        case "nomx":
          putData.win_point = rules[rule].win_point;
          putData.lose_point = rules[rule].lose_point;
        case "nbyn":
          putData.win_point = rules[rule].win_point;
      }
      const game_id = await db.games.put(putData);
      router.push(`/${game_id}/config`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card.Group>
      {ruleNameList.map((id) => (
        <Card key={id}>
          <Card.Content>
            <Card.Header>{rules[id].name}</Card.Header>
            <Card.Description>{rules[id].description}</Card.Description>
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
