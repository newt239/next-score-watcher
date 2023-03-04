import { Box } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import useDeviceWidth from "#/hooks/useDeviceWidth";
import { reversePlayerInfoAtom, verticalViewAtom } from "#/utils/jotai";

type PlayerHeaderProps = {
  index: number;
  text: string;
  belong: string;
};

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ index, text, belong }) => {
  const isDesktop = useDeviceWidth();
  const isVerticalView =
    (useAtomValue(verticalViewAtom) && isDesktop) || !isDesktop;
  const reversePlayerInfo = useAtomValue(reversePlayerInfoAtom);

  return (
    <>
      {!isVerticalView ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: reversePlayerInfo ? "column-reverse" : "column",
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
