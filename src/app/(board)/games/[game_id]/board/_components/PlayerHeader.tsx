import { Box, Flex } from "@mantine/core";

type Props = {
  index: number;
  text: string;
  belong: string;
  isVerticalView: boolean;
};

const PlayerHeader: React.FC<Props> = ({
  index,
  text,
  belong,
  isVerticalView,
}) => {
  return (
    <>
      {isVerticalView ? (
        <Box className="w-full truncate pt-1 text-xs font-bold leading-3">
          {text === "" && belong === "" && (
            <Box className="opacity-30">プレイヤー{index + 1}</Box>
          )}
          <span>{text}</span>
          <span>{text !== "" && belong !== "" && " ・ "}</span>
          <span>{belong !== "" && belong}</span>
        </Box>
      ) : text === "" && belong === "" ? (
        <Box className="my-2 h-12 opacity-30">{index + 1}</Box>
      ) : (
        <Flex className="h-12 w-full flex-col items-center justify-center truncate pt-1 text-xs font-bold leading-3">
          <Box>{text}</Box>
          <Box
            style={{
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
