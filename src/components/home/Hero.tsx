import { Link as ReactLink } from "react-router-dom";

import { Button, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import db from "~/utils/db";

const Hero: React.FC = () => {
  const games = useLiveQuery(
    () => db.games.orderBy("last_open").reverse().toArray(),
    []
  );

  return (
    <Stack direction={{ base: "column", md: "row" }} minH={"100vh"}>
      <Flex align={"center"} flex={1} justify={"center"} p={8}>
        <Stack maxW={"lg"} spacing={6} w={"full"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text as={"span"} position={"relative"}>
              競技クイズのための
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              得点表示アプリ
            </Text>
          </Heading>
          <Text color={"gray.500"} fontSize={{ base: "md", lg: "lg" }}>
            Score
            Watcherは、競技クイズの得点表示に特化したWebアプリケーションです。スコアの表示だけでなく、勝ち抜け・敗退状態や問題文の表示にも対応しています。
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              _hover={{
                bg: "green.500",
              }}
              as={ReactLink}
              colorScheme="green"
              rounded={"full"}
              to="/rule"
            >
              ゲームを作る
            </Button>
            <Button
              onClick={() =>
                window.scrollBy(0, document.documentElement.clientHeight)
              }
              rounded={"full"}
            >
              作成したゲームを見る
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image alt={"大会画像"} objectFit={"cover"} src="images/hero.webp" />
      </Flex>
    </Stack>
  );
};

export default Hero;
