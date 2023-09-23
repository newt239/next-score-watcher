"use client";

import Link from "next/link";

import {
  Link as ChakraLink,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { ExternalLink } from "tabler-icons-react";

import Button from "#/app/_components/Button";
import Preferences from "#/components/block/Preferences";
import { webhookUrlAtom } from "#/utils/jotai";

export default function AppConfigPage() {
  const [WebhookUrl, setWebhookUrl] = useAtom(webhookUrlAtom);

  return (
    <>
      <div>
        <h2>アプリ設定</h2>
        <Preferences />
        <div>
          <FormControl>
            <FormLabel sx={{ flexGrow: 1 }}>Webhook</FormLabel>
            <FormHelperText>
              イベント発生時設定されたURLへPOSTリクエストを送信します。詳しくは
              <ChakraLink as={Link} color="blue.500" href="/option/webhook">
                webhookについて
              </ChakraLink>
              を御覧ください。
            </FormHelperText>
            <Input
              mt={3}
              onChange={(v) => setWebhookUrl(v.target.value)}
              placeholder="https://score-watcher.newt239.dev/api"
              type="url"
              value={WebhookUrl}
              w="100%"
            />
          </FormControl>
          <FormControl>
            <Flex
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <FormLabel sx={{ flexGrow: 1 }}>アプリの初期化</FormLabel>
                <FormHelperText>
                  アプリが上手く動作しない場合にお試しください。
                </FormHelperText>
              </div>
              <Button>初期化する</Button>
            </Flex>
          </FormControl>
        </div>
      </div>
      <div>
        <h2>アプリ情報</h2>
        <Text>
          アップデート情報は
          <ChakraLink
            color="blue.500"
            href="https://github.com/newt239/next-score-watcher/releases"
            isExternal
          >
            リリースノート
            <Icon>
              <ExternalLink />
            </Icon>
          </ChakraLink>
          をご確認ください。
        </Text>
        <TableContainer>
          <Table>
            <Tbody>
              <Tr>
                <Th>バージョン</Th>
                <Td isNumeric>
                  v{localStorage.getItem("scorewatcher-version")}
                </Td>
              </Tr>
              <Tr>
                <Th>開発者</Th>
                <Td isNumeric>
                  <ChakraLink
                    color="blue.500"
                    href="https://twitter.com/newt239"
                    isExternal
                  >
                    newt239
                    <Icon>
                      <ExternalLink />
                    </Icon>
                  </ChakraLink>
                </Td>
              </Tr>
              <Tr>
                <Th>リポジトリ</Th>
                <Td isNumeric>
                  <ChakraLink
                    color="blue.500"
                    href="https://github.com/newt239/next-score-watcher"
                    isExternal
                  >
                    newt239/next-score-watcher
                    <Icon>
                      <ExternalLink />
                    </Icon>
                  </ChakraLink>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
