import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { Button, Card } from "semantic-ui-react";

import db from "#/utils/db";

const GameList: React.FC = () => {
  const games = useLiveQuery(() => db.games.toArray());
  return (
    <Card.Group>
      {games?.map((game) => (
        <Card key={game.id}>
          <Card.Content>
            <Card.Header>{game.name}</Card.Header>
            <Card.Description>{game.type}</Card.Description>
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
  );
};

export default GameList;
