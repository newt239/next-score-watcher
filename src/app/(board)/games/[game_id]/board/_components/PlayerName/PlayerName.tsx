import { Flex } from "@mantine/core";

import classes from "./PlayerName.module.css";

import { zenkaku2Hankaku } from "@/utils/functions";

type Props = {
  player_name: string;
  rows: number;
  isAQL?: boolean;
};

const PlayerName: React.FC<Props> = ({ player_name, rows, isAQL = false }) => {
  return (
    <Flex className={classes.player_name} data-aql={isAQL} data-rows={rows}>
      {zenkaku2Hankaku(player_name)}
    </Flex>
  );
};

export default PlayerName;
