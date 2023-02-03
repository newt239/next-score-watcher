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
        width: isLargerThan700 ? undefined : "40vw",
        margin: "auto",
      }}
    >
      <Box
        style={{
          writingMode: isLargerThan700 ? "vertical-rl" : "horizontal-tb",
          whiteSpace: "nowrap",
          textOrientation: "upright",
          fontSize: `min(calc(${isLargerThan700 ? "45vh" : "30vw"} / ${
            playerName.length
          }), clamp(9vh, 2.5rem, 9vw))`,
          fontWeight: 800,
        }}
      >
        {playerName}
      </Box>
    </div>
  );
};

export default PlayerName;
