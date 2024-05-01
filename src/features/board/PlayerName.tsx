import { Flex } from "@chakra-ui/react";

import useDeviceWidth from "~/hooks/useDeviceWidth";
import { zenkaku2Hankaku } from "~/utils/functions";

type PlayerNameProps = {
  player_name: string;
  isVerticalView: boolean;
  rows: number;
};

const PlayerName: React.FC<PlayerNameProps> = ({
  player_name,
  isVerticalView,
  rows,
}) => {
  const isDesktop = useDeviceWidth();

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
            ? `clamp(2rem, (70vh - ${rows * 4}rem) / ${
                player_name.length + 1
              }, 4rem)`
            : "2rem",
        fontWeight: 800,
        w: "100%",
        pt: !isVerticalView && isDesktop ? 3 : undefined,
        overflowX: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {zenkaku2Hankaku(player_name)}
    </Flex>
  );
};

export default PlayerName;
