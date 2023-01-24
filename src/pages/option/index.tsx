import { NextPageWithLayout } from "next";
import Head from "next/head";
import NextLink from "next/link";
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
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import { getConfig, setConfig } from "#/hooks/useBooleanConfig";
import { Layout } from "#/layouts/Layout";
import db from "#/utils/db";

const OptionPage: NextPageWithLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [winthroughPopup, setWinthroughPopup] = useState<boolean>(
    getConfig("scorewatcher-winthrough-popup")
  );
  const [showLogs, setShowLogs] = useState(getConfig("scorewatcher-show-logs"));
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
              onChange={() => setWinthroughPopup(winthroughPopup!)}
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
              onChange={() => setShowLogs(showLogs!)}
            />
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
      <H2>お問い合わせ</H2>
      <Box py={5}>
        <Text>
          <NextLink
            href="https://forms.gle/y6S1xxbnMhcAF5Tj7"
            passHref
            target="_blank"
          >
            <Button variant="link" rightIcon={<ExternalLink />}>
              こちらの Google フォーム
            </Button>
          </NextLink>
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
                <Td isNumeric>v{localStorage.getItem("VERSION")}</Td>
              </Tr>
              <Tr>
                <Th>開発者</Th>
                <Td isNumeric>
                  <NextLink
                    href="https://twitter.com/newt239"
                    passHref
                    target="_blank"
                  >
                    <Button variant="link" rightIcon={<ExternalLink />}>
                      newt239
                    </Button>
                  </NextLink>
                </Td>
              </Tr>
              <Tr>
                <Th>リポジトリ</Th>
                <Td isNumeric>
                  <NextLink
                    href="https://github.com/newt239/next-score-watcher"
                    passHref
                    target="_blank"
                  >
                    <Button variant="link" rightIcon={<ExternalLink />}>
                      newt239/next-score-watcher
                    </Button>
                  </NextLink>
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
