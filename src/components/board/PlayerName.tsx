import { Box, Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import useDeviceWidth from "#/hooks/useDeviceWidth";
import { verticalViewAtom } from "#/utils/jotai";

type PlayerNameProps = {
  player_name: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ player_name }) => {
  const isDesktop = useDeviceWidth();
  const isVerticalView = useAtomValue(verticalViewAtom);

  return (
    <Flex
      align={isVerticalView ? "center" : "flex-start"}
      direction={isVerticalView ? "row" : "column"}
      h={isDesktop && !isVerticalView ? "50vh" : undefined}
      justify="space-between"
      sx={{
        textOrientation: "upright",
        writingMode:
          !isVerticalView && isDesktop ? "vertical-rl" : "horizontal-tb",
      }}
    >
      <Box
        sx={{
          whiteSpace: "nowrap",
          overflowX: "hidden",
          textOverflow: "ellipsis",
          fontFamily: "BIZ UDGothic",
          fontSize:
            !isVerticalView && isDesktop
              ? `min(calc(45vh / ${player_name.length}), clamp(9vh, 2.5rem, 9vw))`
              : "2rem",
          fontWeight: 800,
          w: "100%",
          pt: !isVerticalView && isDesktop ? 3 : undefined,
        }}
      >
        {player_name}
      </Box>
    </Flex>
  );
};

export default PlayerName;
