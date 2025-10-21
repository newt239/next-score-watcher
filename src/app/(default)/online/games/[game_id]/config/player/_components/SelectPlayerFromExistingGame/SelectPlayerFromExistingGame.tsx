import { parseResponse } from "hono/client";

import SelectPlayerFromExistingGameClient from "./SelectPlayerFromExistingGameClient";

import { createApiClientOnServer } from "@/utils/hono/server";

type SelectPlayerFromExistingGameProps = {
  game_id: string;
};

/**
 * 既存のゲームと同じプレイヤーを選択する
 */
const SelectPlayerFromExistingGame: React.FC<
  SelectPlayerFromExistingGameProps
> = async ({ game_id }) => {
  const apiClient = await createApiClientOnServer();

  const data = await parseResponse(
    apiClient.games.$get({
      query: { limit: "100" },
    })
  );

  if ("error" in data) {
    return null;
  }

  return (
    <SelectPlayerFromExistingGameClient game_id={game_id} games={data.games} />
  );
};

export default SelectPlayerFromExistingGame;
