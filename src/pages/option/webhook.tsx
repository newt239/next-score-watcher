import { Link as ReactLink } from "react-router-dom";

import { Box, Button, Code, Container, Text } from "@chakra-ui/react";
import { ArrowBackUp } from "tabler-icons-react";

const WebhookPage = () => {
  return (
    <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
      <Box>
        <ReactLink to="/option">
          <Button
            colorScheme="green"
            variant="ghost"
            leftIcon={<ArrowBackUp />}
          >
            アプリ設定に戻る
          </Button>
        </ReactLink>
      </Box>
      <h2>Webhookについて</h2>
      <Text>
        ゲームが進行するたびに、設定されたURLへPOSTリクエストを行います。
      </Text>
      <Text>
        POSTされるデータは<Code>info</Code>, <Code>logs</Code>,{" "}
        <Code>scores</Code>で構成されています。
      </Text>
      <Text>詳細は実際にご利用の上お確かめください。</Text>
    </Container>
  );
};

export default WebhookPage;
