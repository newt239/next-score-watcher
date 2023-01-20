import { NextPageWithLayout } from "next";
import Head from "next/head";

import {
  Container,
  FormControl,
  FormLabel,
  Stack,
  Switch,
  useColorMode,
} from "@chakra-ui/react";

import H2 from "#/blocks/H2";
import { Layout } from "#/layouts/Layout";

const OptionPage: NextPageWithLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
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
            <FormLabel htmlFor="color-mode" mb="0">
              ダークモード
            </FormLabel>
            <Switch
              id="color-mode"
              size="lg"
              isChecked={colorMode === "dark"}
              onChange={() => toggleColorMode()}
            />
          </FormControl>
        </Stack>
      </Container>
    </>
  );
};

OptionPage.getLayout = (page) => <Layout>{page}</Layout>;

export default OptionPage;
