import { Box, Kbd } from "@chakra-ui/react";

const ShortcutGuide: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>1</Kbd>
        </span>
        <span>左から1番目のプレイヤーの正答</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>2</Kbd>
        </span>
        <span>左から2番目のプレイヤーの正答</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>0</Kbd>
        </span>
        <span>左から10番目のプレイヤーの正答</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>-</Kbd>
        </span>
        <span>左から11番目のプレイヤーの正答</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>^</Kbd>
        </span>
        <span>左から12番目のプレイヤーの正答</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>\</Kbd>
        </span>
        <span>左から13番目のプレイヤーの正答</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>shift</Kbd> + <Kbd>1</Kbd>
        </span>
        <span>左から1番目のプレイヤーの誤答</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>{"<"}</Kbd>
        </span>
        <span>一つ戻す</span>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          <Kbd>{">"}</Kbd>
        </span>
        <span>スルー</span>
      </Box>
    </Box>
  );
};

export default ShortcutGuide;
