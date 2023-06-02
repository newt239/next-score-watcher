import { HStack, Kbd, Stack } from "@chakra-ui/react";

const ShortcutGuide: React.FC = () => {
  return (
    <Stack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>1</Kbd>
        </span>
        <span>左から1番目のプレイヤーの正答</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>2</Kbd>
        </span>
        <span>左から2番目のプレイヤーの正答</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>0</Kbd>
        </span>
        <span>左から10番目のプレイヤーの正答</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>-</Kbd>
        </span>
        <span>左から11番目のプレイヤーの正答</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>^</Kbd>
        </span>
        <span>左から12番目のプレイヤーの正答</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>\</Kbd>
        </span>
        <span>左から13番目のプレイヤーの正答</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>shift</Kbd> + <Kbd>1</Kbd>
        </span>
        <span>左から1番目のプレイヤーの誤答</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>{"<"}</Kbd>
        </span>
        <span>一つ戻す</span>
      </HStack>
      <HStack sx={{ justifyContent: "space-between" }}>
        <span>
          <Kbd>{">"}</Kbd>
        </span>
        <span>スルー</span>
      </HStack>
    </Stack>
  );
};

export default ShortcutGuide;
