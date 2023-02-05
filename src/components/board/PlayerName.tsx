import { Box, useMediaQuery } from "@chakra-ui/react";

type PlayerNameProps = {
  playerName: string;
};

const PlayerName: React.FC<PlayerNameProps> = ({ playerName }) => {
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isLargerThan700 ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: isLargerThan700 ? "50vh" : undefined,
      }}
    >
      <Box
        style={{
          writingMode: isLargerThan700 ? "vertical-rl" : "horizontal-tb",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          textOverflow: "ellipsis",
          textOrientation: "upright",
          fontSize: isLargerThan700
            ? `min(calc(45vh / ${playerName.length}), clamp(9vh, 2.5rem, 9vw))`
            : "1.5rem",
          fontWeight: 800,
          width: isLargerThan700 ? undefined : "max(40vw, 120px)",
        }}
      >
        {playerName}
      </Box>
    </div>
  );
};

export default PlayerName;
