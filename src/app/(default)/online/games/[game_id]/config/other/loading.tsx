import { Flex, Loader, Text } from "@mantine/core";

const OtherLoading = () => {
  return (
    <Flex align="center" gap="md" w="full" h="50vh" justify="center">
      <Loader size="sm" />
      <Text>その他の設定を読み込み中...</Text>
    </Flex>
  );
};

export default OtherLoading;
