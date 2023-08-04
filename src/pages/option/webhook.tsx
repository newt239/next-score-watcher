import { useEffect } from "react";
import { Link as ReactLink, useSearchParams } from "react-router-dom";

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
  const [params] = useSearchParams();
  const from = params.get("from");

  useEffect(() => {
    document.title = "Webhookについて | Score Watcher";
  }, []);

  return (
    <Container pt={5}>
      <Box>
        {from ? (
          <Button
            as={ReactLink}
            colorScheme="green"
            leftIcon={<ArrowBackUp />}
            to={`/${from}/config`}
            variant="ghost"
          >
            ゲーム設定に戻る
          </Button>
        ) : (
          <Button
            as={ReactLink}
            colorScheme="green"
            leftIcon={<ArrowBackUp />}
            to="/option"
            variant="ghost"
          >
            アプリ設定に戻る
          </Button>
        )}
      </Box>
      <h2>Discord Webhookについて</h2>
      <Text>プレイヤーの勝ち抜け時にDiscordへメッセージを送信します。</Text>
      <Text>
        まずメッセージを受け取りたいチャンネルの設定を開いてください。
      </Text>
      <Text>
        「連携サービス」タブ内に「ウェブフック」という項目があるので、「ウェブフックを作成」をクリックし、「ウェブフックURLをコピー」してください。
      </Text>
      <Text>
        コピーしたURLを設定内に貼り付けることで、通知が行われるようになります。
      </Text>
      <h2>Webhookについて</h2>
      <Text color="red.500">※こちらは開発者向けの高度な機能となります。</Text>
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
        color="blue.500"
        href="https://gist.github.com/newt239/e03f8ed7fbc00852999bced29d80e8af"
        isExternal
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
