import { NextPageWithLayout } from "next";
import Head from "next/head";
import router from "next/router";
import { useEffect, useRef, useState } from "react";

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
  Link,
  ListItem,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  UnorderedList,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { ExternalLink } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import AppOptionSwitch from "#/components/AppOptionSwitch";
import { getConfig, setConfig } from "#/hooks/useLocalStorage";
import { Layout } from "#/layouts/Layout";
import db from "#/utils/db";
import { verticalViewAtom } from "#/utils/jotai";

const OptionPage: NextPageWithLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [winthroughPopup, setWinthroughPopup] = useState<boolean>(
    getConfig("scorewatcher-winthrough-popup")
  );
  const [showLogs, setShowLogs] = useState(getConfig("scorewatcher-show-logs"));
  const [showSignString, setShowSignString] = useState(
    getConfig("scorewatcher-show-sign-string")
  );
  const [reversePlayerInfo, setReversePlayerInfo] = useState(
    getConfig("scorewatcher-reverse-player-info", false)
  );
  const [verticalView, setVerticalView] = useAtom(verticalViewAtom);
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const deleteAppData = () => {
    localStorage.setItem("scorewatcher-version", latestVersion!);
    db.delete().then(() => {
      router.reload();
    });
  };

  useEffect(() => {
    setConfig("scorewatcher-winthrough-popup", winthroughPopup);
  }, [winthroughPopup]);

  useEffect(() => {
    setConfig("scorewatcher-show-logs", showLogs);
  }, [showLogs]);

  useEffect(() => {
    setConfig("scorewatcher-show-sign-string", showSignString);
  }, [showSignString]);

  useEffect(() => {
    setConfig("scorewatcher-reverse-player-info", reversePlayerInfo);
  }, [reversePlayerInfo]);

  return (
    <>
      <Head>
        <title>アプリ設定 - Score Watcher</title>
      </Head>
      <H2>アプリ設定</H2>
      <Container py={5}>
        <Stack sx={{ gap: 5 }}>
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormLabel htmlFor="color-mode" sx={{ flexGrow: 1 }}>
              ダークモード
            </FormLabel>
            <Switch
              id="color-mode"
              size="lg"
              isChecked={colorMode === "dark"}
              onChange={() => toggleColorMode()}
            />
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormLabel htmlFor="winthrough-popup" sx={{ flexGrow: 1 }}>
              勝ち抜け時にポップアップを表示
            </FormLabel>
            <Switch
              id="winthrough-popup"
              size="lg"
              isChecked={winthroughPopup}
              onChange={() => setWinthroughPopup((v) => !v)}
            />
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <FormLabel htmlFor="show-sign-string" sx={{ flexGrow: 1 }}>
                スコアに「○」「✕」「pt」の文字列を付与する
              </FormLabel>
              <FormHelperText>
                視聴者が数字の意味を理解しやすくなります。
              </FormHelperText>
            </Box>
            <Switch
              id="show-pt-string"
              size="lg"
              isChecked={localStorage.getItem("scorewatcher-") === "yes"}
              onChange={() => setShowSignString((v) => !v)}
            />
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormLabel htmlFor="show-logs" sx={{ flexGrow: 1 }}>
              得点表示画面下にログを表示
            </FormLabel>
            <Switch
              id="show-logs"
              size="lg"
              isChecked={showLogs}
              onChange={() => setShowLogs((v) => !v)}
            />
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormLabel htmlFor="reverse-player-info" sx={{ flexGrow: 1 }}>
              スコアを名前の前に表示
            </FormLabel>
            <Switch
              id="reverse-player-info"
              size="lg"
              isChecked={reversePlayerInfo}
              onChange={() => setReversePlayerInfo((v) => !v)}
            />
          </FormControl>
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
      <H2>お問い合わせ</H2>
      <Box py={5}>
        <Text>
          <Link
            href="https://forms.gle/y6S1xxbnMhcAF5Tj7"
            isExternal
            color="blue.500"
          >
            こちらの Google フォーム
            <Icon>
              <ExternalLink />
            </Icon>
          </Link>
          からお願いします。
        </Text>
      </Box>
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
