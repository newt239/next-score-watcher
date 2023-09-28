import { Box, Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import { reversePlayerInfoAtom } from "#/utils/jotai";

type PlayerHeaderProps = {
  index: number;
  text: string;
  belong: string;
  isVerticalView: boolean;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  index,
  text,
  belong,
  isVerticalView,
}) => {
  const reversePlayerInfo = useAtomValue(reversePlayerInfoAtom);

  return (
    <>
      {isVerticalView ? (
        <Box
          sx={{
            w: "100%",
            fontSize: "0.8rem",
            lineHeight: "0.8rem",
            fontWeight: 800,
            pt: 1,
            whiteSpace: "nowrap",
            overflowX: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text === "" && belong === "" && (
            <Box sx={{ opacity: 0.3 }}>プレイヤー{index + 1}</Box>
          )}
          <span>{text}</span>
          <span>{text !== "" && belong !== "" && " ・ "}</span>
          <span>{belong !== "" && belong}</span>
        </Box>
      ) : (
        <Flex
          sx={{
            flexDirection: reversePlayerInfo ? "column-reverse" : "column",
            alignItems: "center",
            justifyContent: "center",
            w: "100%",
            fontWeight: 800,
            whiteSpace: "nowrap",
            lineHeight: "1rem",
          }}
        >
          {text === "" && belong === "" ? (
            <Box sx={{ h: "1rem", my: "0.5rem", opacity: 0.3 }}>
              {index + 1}
            </Box>
          ) : (
            <>
              <Box sx={{ h: "1rem" }}>{text}</Box>
              <Box
                sx={{
                  w: "100%",
                  h: "1rem",
                  overflowX: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {belong}
              </Box>
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default PlayerHeader;
