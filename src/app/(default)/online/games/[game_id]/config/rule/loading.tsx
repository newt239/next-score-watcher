import { Flex, Loader, Text } from "@mantine/core";

const RuleLoading = () => {
  return (
    <Flex align="center" gap="md" w="full" h="50vh" justify="center">
      <Loader size="sm" />
      <Text>形式設定を読み込み中...</Text>
    </Flex>
  );
};

export default RuleLoading;
