import { NextPageWithLayout } from "next";
import Head from "next/head";

import {
  FormControl,
  FormLabel,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  theme,
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
      <Tabs orientation="vertical" sx={{ p: 5 }}>
        <TabList
          sx={{
            whiteSpace: "nowrap",
            borderInlineStartWidth: 0,
            borderInlineEndWidth: 2,
            borderInlineEndStyle: "solid",
          }}
        >
          <Tab
            sx={{ justifyContent: "flex-start" }}
            _selected={{
              backgroundColor: theme.colors.transparent,
              color: theme.colors.blue[500],
              borderInlineEnd: `2px solid ${theme.colors.blue[500]}`,
            }}
          >
            一般
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

OptionPage.getLayout = (page) => <Layout>{page}</Layout>;

export default OptionPage;
