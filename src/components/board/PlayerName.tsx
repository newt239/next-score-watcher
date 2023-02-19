import { Box, Flex } from "@chakra-ui/react";

import useDeviceWidth from "#/hooks/useDeviceWidth";

type PlayerNameProps = {
  player_name: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ player_name }) => {
  const isDesktop = useDeviceWidth();

  return (
    <Flex
      sx={{
        flexDirection: isDesktop ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: isDesktop ? "50vh" : undefined,
      }}
    >
      <Box
        sx={{
          writingMode: isDesktop ? "vertical-rl" : "horizontal-tb",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          textOverflow: "ellipsis",
          textOrientation: "upright",
          fontFamily: "BIZ UDGothic",
          fontSize: isDesktop
            ? `min(calc(45vh / ${player_name.length}), clamp(9vh, 2.5rem, 9vw))`
            : "1.5rem",
          fontWeight: 800,
          w: isDesktop ? undefined : "max(40vw, 120px)",
        }}
      >
        {player_name}
      </Box>
    </Flex>
  );
};

export default PlayerName;
