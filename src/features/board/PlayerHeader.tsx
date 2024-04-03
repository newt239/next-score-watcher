import { Box, Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import { reversePlayerInfoAtom } from "~/utils/jotai";

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
      ) : text === "" && belong === "" ? (
        <Box sx={{ my: "0.5rem", opacity: 0.3, h: "3rem" }}>{index + 1}</Box>
      ) : (
        <Flex
          sx={{
            flexDirection: reversePlayerInfo ? "column-reverse" : "column",
            alignItems: "center",
            justifyContent: "center",
            w: "100%",
            fontWeight: 800,
            whiteSpace: "nowrap",
            lineHeight: "1.5rem",
            h: "3rem",
          }}
        >
          <Box>{text}</Box>
          <Box
            sx={{
              w: "100%",
              overflowX: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            }}
          >
            {belong}
          </Box>
        </Flex>
      )}
    </>
  );
};

export default PlayerHeader;
