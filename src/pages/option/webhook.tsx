import { useEffect } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  Box,
  Button,
  Code,
  Container,
  Icon,
  Link,
  Text,
} from "@chakra-ui/react";
import { ArrowBackUp, ExternalLink } from "tabler-icons-react";

const WebhookPage = () => {
  useEffect(() => {
    document.title = "Webhookについて | Score Watcher";
  }, []);

  return (
    <Container>
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
      <h3>Response Example</h3>
      <Link
        href="https://gist.github.com/newt239/e03f8ed7fbc00852999bced29d80e8af"
        isExternal
        color="blue.500"
      >
        Webhookで提供されるjsonの例｜Score Watcher
        <Icon>
          <ExternalLink />
        </Icon>
      </Link>
    </Container>
  );
};

export default WebhookPage;
