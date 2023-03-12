import { NextPageWithLayout } from "next";
import Head from "next/head";
import router from "next/router";
import { useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { ExternalLink } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import AppOptionSwitch from "#/components/AppOptionSwitch";
import { Layout } from "#/layouts/Layout";
import db from "#/utils/db";
import {
  reversePlayerInfoAtom,
  showLogsAtom,
  showSignStringAtom,
  showWinthroughPopupAtom,
  verticalViewAtom,
  webhookUrlAtom,
} from "#/utils/jotai";

const OptionPage: NextPageWithLayout = () => {
  const [showWinthroughPopup, showSetWinthroughPopup] = useAtom(
    showWinthroughPopupAtom
  );
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [showSignString, setShowSignString] = useAtom(showSignStringAtom);
  const [reversePlayerInfo, setReversePlayerInfo] = useAtom(
    reversePlayerInfoAtom
  );
  const [verticalView, setVerticalView] = useAtom(verticalViewAtom);
  const [WebhookUrl, setWebhookUrl] = useAtom(webhookUrlAtom);
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const deleteAppData = () => {
    localStorage.setItem("scorewatcher-version", latestVersion!);
    db.delete().then(() => {
      router.reload();
    });
  };

  return (
    <>
      <Head>
        <title>アプリ設定 - Score Watcher</title>
      </Head>
      <H2>アプリ設定</H2>
      <Container py={5}>
        <Stack sx={{ gap: 5 }}>
          <AppOptionSwitch
            title="ダークモード"
            isChecked={colorMode === "dark"}
            onChange={() => toggleColorMode()}
          />
          <AppOptionSwitch
            title="勝ち抜け時にポップアップを表示"
            isChecked={showWinthroughPopup}
            onChange={() => showSetWinthroughPopup((v) => !v)}
          />
          <AppOptionSwitch
            title="スコアに「○」「✕」「pt」の文字列を付与する"
            label="視聴者が数字の意味を理解しやすくなります。"
            isChecked={showSignString}
            onChange={() => setShowSignString((v) => !v)}
          />
          <AppOptionSwitch
            title="得点表示画面下にログを表示"
            isChecked={showLogs}
            onChange={() => setShowLogs((v) => !v)}
          />
          <AppOptionSwitch
            title="スコアを名前の前に表示"
            isChecked={reversePlayerInfo}
            onChange={() => setReversePlayerInfo((v) => !v)}
          />
          <AppOptionSwitch
            title="プレイヤーを垂直に並べる"
            isChecked={verticalView}
            onChange={() => setVerticalView((v) => !v)}
          />
          <FormControl>
            <Flex
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <FormLabel sx={{ flexGrow: 1 }}>Webhook</FormLabel>
                <FormHelperText>
                  [β版]イベント発生時設定されたURLへPOSTリクエストを送信します。
                </FormHelperText>
              </Box>
              <Input
                value={WebhookUrl}
                onChange={(v) => setWebhookUrl(v.target.value)}
                placeholder="https://score-watcher.newt239.dev/api"
                w="50%"
              />
            </Flex>
          </FormControl>
          <FormControl>
            <Flex
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <FormLabel sx={{ flexGrow: 1 }}>アプリの初期化</FormLabel>
                <FormHelperText>
                  アプリが上手く動作しない場合にお試しください。
                </FormHelperText>
              </Box>
              <Button colorScheme="red" onClick={onOpen}>
                初期化する
              </Button>
            </Flex>
          </FormControl>
        </Stack>
      </Container>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              アプリを初期化します
            </AlertDialogHeader>
            <AlertDialogBody>
              この操作は取り消せません。本当に初期化してよろしいですか？
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                やめる
              </Button>
              <Button colorScheme="red" onClick={deleteAppData} ml={3}>
                初期化する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <H2>アプリ情報</H2>
      <Container py={5}>
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
                  <Link
                    href="https://twitter.com/newt239"
                    isExternal
                    color="blue.500"
                  >
                    newt239
                    <Icon>
                      <ExternalLink />
                    </Icon>
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Th>リポジトリ</Th>
                <Td isNumeric>
                  <Link
                    href="https://github.com/newt239/next-score-watcher"
                    isExternal
                    color="blue.500"
                  >
                    newt239/next-score-watcher
                    <Icon>
                      <ExternalLink />
                    </Icon>
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

OptionPage.getLayout = (page) => <Layout>{page}</Layout>;

export default OptionPage;
