import { Box, Flex } from "@mantine/core";

import classes from "./PlayerHeader.module.css";

type Props = {
  index: number;
  text: string;
  belong: string;
  isVerticalView: boolean;
};

const PlayerHeader: React.FC<Props> = ({
  index,
  text,
  belong,
  isVerticalView,
}) => {
  return (
    <>
      {isVerticalView ? (
        <Box className={classes.vertical_player_header}>
          {text === "" && belong === "" && (
            <Box className={classes.vertical_player_number}>No.{index + 1}</Box>
          )}
          <span>{text}</span>
          <span>{text !== "" && belong !== "" && " ・ "}</span>
          <span>{belong !== "" && belong}</span>
        </Box>
      ) : text === "" && belong === "" ? (
        <Box className={classes.horizontal_player_number}>{index + 1}</Box>
      ) : (
        <Flex className={classes.horizontal_player_header}>
          <Box>{text}</Box>
          <Box className={classes.horizontal_player_belong}>{belong}</Box>
        </Flex>
      )}
    </>
  );
};

export default PlayerHeader;
