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
        flexGrow: 1,
        alignItems: isVerticalView ? "center" : "flex-start",
        justifyContent: isVerticalView ? "flex-start" : "center",
        textOrientation: "upright",
        writingMode:
          !isVerticalView && isDesktop ? "vertical-rl" : "horizontal-tb",
        whiteSpace: "nowrap",
        fontFamily: "BIZ UDGothic",
        fontSize:
          !isVerticalView && isDesktop
            ? `min(calc(50vh / ${player_name.length}), clamp(9vh, 2.5rem, 9vw))`
            : "2rem",
        fontWeight: 800,
        w: "100%",
        pt: !isVerticalView && isDesktop ? 3 : undefined,
        overflowX: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {player_name}
    </Flex>
  );
};

export default PlayerName;
