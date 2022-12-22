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
        case "nupdown":
          putData.win_point = rules[rule].win_point;
          putData.lose_point = rules[rule].lose_point;
        case "swedishx":
          putData.win_point = rules[rule].win_point;
        case "attacksurvival":
          putData.win_point = rules[rule].win_point;
          putData.win_through = rules[rule].win_through;
          putData.correct_me = rules[rule].correct_me;
          putData.wrong_me = rules[rule].wrong_me;
          putData.correct_other = rules[rule].correct_other;
          putData.wrong_other = rules[rule].wrong_other;
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
            <Button primary floated="right" onClick={() => createGame(id)}>
              新規作成
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default RuleList;
