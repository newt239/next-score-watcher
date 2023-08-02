import { Flex } from "@chakra-ui/react";
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
      direction={isVerticalView ? "row" : "column"}
      sx={{
        alignItems: isVerticalView ? "center" : "flex-start",
        justifyContent: isVerticalView ? "flex-start" : "center",
        flexGrow: 1,
        textOrientation: "upright",
        writingMode:
          !isVerticalView && isDesktop ? "vertical-rl" : "horizontal-tb",
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
    </Flex>
  );
};

export default PlayerName;
