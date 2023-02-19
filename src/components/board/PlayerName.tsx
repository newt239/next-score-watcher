import { Box, Flex, useMediaQuery } from "@chakra-ui/react";

type PlayerNameProps = {
  player_name: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ player_name }) => {
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  return (
    <Flex
      sx={{
        flexDirection: isLargerThan700 ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: isLargerThan700 ? "50vh" : undefined,
      }}
    >
      <Box
        sx={{
          writingMode: isLargerThan700 ? "vertical-rl" : "horizontal-tb",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          textOverflow: "ellipsis",
          textOrientation: "upright",
          fontFamily: "BIZ UDGothic",
          fontSize: isLargerThan700
            ? `min(calc(45vh / ${player_name.length}), clamp(9vh, 2.5rem, 9vw))`
            : "1.5rem",
          fontWeight: 800,
          w: isLargerThan700 ? undefined : "max(40vw, 120px)",
        }}
      >
        {player_name}
      </Box>
    </Flex>
  );
};

export default PlayerName;
