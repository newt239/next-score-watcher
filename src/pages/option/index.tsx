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
  Stack,
  Switch,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";

import H2 from "#/blocks/H2";
import { Layout } from "#/layouts/Layout";
import db from "#/utils/db";

const OptionPage: NextPageWithLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const deleteAppData = () => {
    localStorage.setItem("VERSION", latestVersion!);
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
    </>
  );
};

OptionPage.getLayout = (page) => <Layout>{page}</Layout>;

export default OptionPage;
