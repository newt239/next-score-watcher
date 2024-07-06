import { Flex } from "@mantine/core";

import classes from "./PlayerName.module.css";

import { zenkaku2Hankaku } from "@/utils/functions";

type Props = {
  player_name: string;
  isAQL?: boolean;
};

const PlayerName: React.FC<Props> = ({ player_name, isAQL = false }) => {
  return (
    <Flex className={classes.player_name} data-aql={isAQL}>
      {zenkaku2Hankaku(player_name)}
    </Flex>
  );
};

export default PlayerName;
