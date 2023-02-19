import { Box, useMediaQuery } from "@chakra-ui/react";

import { getConfig } from "#/hooks/useBooleanConfig";

type PlayerHeaderProps = {
  index: number;
  text: string;
  belong: string;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ index, text, belong }) => {
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  return (
    <>
      {isLargerThan700 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: getConfig("scorewatcher-reverse-player-info", false)
              ? "column-reverse"
              : "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            whiteSpace: "nowrap",
            maxWidth: 100,
          }}
        >
          {text === "" ? (
            <Box sx={{ opacity: 0.3 }}>{index + 1}</Box>
          ) : (
            <Box>{text}</Box>
          )}
          <Box>{belong === "" ? "―――――" : belong}</Box>
        </Box>
      ) : (
        <Box
          sx={{
            fontSize: "0.8rem",
            lineHeight: "0.8rem",
            fontWeight: 800,
            pt: 1,
            whiteSpace: "nowrap",
            overflowX: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 100,
          }}
        >
          {text === "" && belong === "" && (
            <Box sx={{ opacity: 0.3 }}>Player{index + 1}</Box>
          )}
          <span>{text !== "" && text}</span>
          <span>{text !== "" && belong !== "" && " ・ "}</span>
          <span>{belong !== "" && belong}</span>
        </Box>
      )}
    </>
  );
};

export default PlayerHeader;
