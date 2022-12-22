import Link from "next/link";

import { useLiveQuery } from "dexie-react-hooks";
import { Button, Card } from "semantic-ui-react";

import db from "#/utils/db";

const GameList: React.FC = () => {
  const games = useLiveQuery(() => db.games.toArray());
  if (!games || games.length === 0) return null;
  return (
    <>
      <h2>作成したゲーム一覧</h2>
      <Card.Group>
        {games.map((game) => (
          <Card key={game.id}>
            <Card.Content>
              <Card.Header>{game.name}</Card.Header>
              <Card.Description>{game.rule}</Card.Description>
              <div style={{ marginTop: "1rem" }}>
                <Link href={`/${game.id}/config`}>
                  <Button primary floated="right">
                    設定
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
};

export default GameList;
