import { Flex, Loader, Text } from "@mantine/core";

const PlayerLoading = () => {
  return (
    <Flex align="center" gap="md" w="full" h="50vh" justify="center">
      <Loader size="sm" />
      <Text>プレイヤー設定を読み込み中...</Text>
    </Flex>
  );
};

export default PlayerLoading;
