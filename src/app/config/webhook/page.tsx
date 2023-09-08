import Link from "next/link";

import {
  Box,
  Button,
  Link as ChakraLink,
  Code,
  Container,
  Icon,
  Text,
} from "@chakra-ui/react";
import { ArrowBackUp, ExternalLink } from "tabler-icons-react";

export const metadata = {
  title: "Webhookについて | Score Watcher",
};

export default function WebhookPage({
  searchParams,
}: {
  searchParams: { from: string };
}) {
  return (
    <Container pt={5}>
      <Box pt={5}>
        {searchParams.from ? (
          <Button
            as={Link}
            colorScheme="green"
            href={`/${searchParams.from}/config`}
            leftIcon={<ArrowBackUp />}
            size="sm"
            variant="ghost"
          >
            ゲーム設定に戻る
          </Button>
        ) : (
          <Button
            as={Link}
            colorScheme="green"
            href="/option"
            leftIcon={<ArrowBackUp />}
            size="sm"
            variant="ghost"
          >
            アプリ設定に戻る
          </Button>
        )}
        <Box>
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
        </Box>
        <Box pt={5}>
          <h2>Webhookについて</h2>
          <Text color="red.500">
            ※こちらは開発者向けの高度な機能となります。
          </Text>
          <Text>
            ゲームが進行するたびに、設定されたURLへPOSTリクエストを行います。
          </Text>
          <Text>
            POSTされるデータは<Code>info</Code>, <Code>logs</Code>,{" "}
            <Code>scores</Code>で構成されています。
          </Text>
          <Text>詳細は実際にご利用の上お確かめください。</Text>
          <h3>Response Example</h3>
          <ChakraLink
            color="blue.500"
            href="https://gist.github.com/newt239/e03f8ed7fbc00852999bced29d80e8af"
            isExternal
          >
            Webhookで提供されるjsonの例｜Score Watcher
            <Icon>
              <ExternalLink />
            </Icon>
          </ChakraLink>
        </Box>
      </Box>
    </Container>
  );
}
