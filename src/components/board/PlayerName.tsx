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
      sx={{
        flexDirection: !isVerticalView ? "column" : "row",
        alignItems: !isVerticalView && isDesktop ? "center" : "flex-start",
        justifyContent: "space-between",
        height: !isVerticalView && isDesktop ? "50vh" : undefined,
      }}
    >
      <Box
        sx={{
          writingMode:
            !isVerticalView && isDesktop ? "vertical-rl" : "horizontal-tb",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          textOverflow: "ellipsis",
          textOrientation: "upright",
          fontFamily: "BIZ UDGothic",
          fontSize:
            !isVerticalView && isDesktop
              ? `min(calc(45vh / ${player_name.length}), clamp(9vh, 2.5rem, 9vw))`
              : "2rem",
          fontWeight: 800,
          w: !isVerticalView && isDesktop ? undefined : "100%",
        }}
      >
        {player_name}
      </Box>
    </Flex>
  );
};

export default PlayerName;
