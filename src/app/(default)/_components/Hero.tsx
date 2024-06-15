import Link from "next/link";

import { Box, Button, Image } from "@mantine/core";
import { ArrowRight } from "tabler-icons-react";

export default function Hero() {
  return (
    <Box w="100%" pos="relative">
      <Image
        alt="大会画像"
        radius="xl"
        src="/images/hero.webp"
        className="h-[80vh] w-full object-cover"
      />
      <Box className="absolute left-1/2 top-1/2 m-4 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-xl p-4 text-white backdrop-blur-sm ">
        <Box
          style={{
            textShadow: "black 1px 0 10px",
          }}
          className="text-4xl font-bold leading-6 md:text-6xl"
        >
          <Box>競技クイズのための</Box>
          <Box>
            <Box
              style={{
                display: "inline",
                textShadow: "green 1px 0 10px",
              }}
            >
              得点表示
            </Box>
            アプリ
          </Box>
        </Box>
        <Box className="my-4">
          <p>
            Score
            Watcherは、競技クイズの得点表示に特化したWebアプリケーションです。
          </p>
          <p>
            スコアの表示だけでなく、勝ち抜け・敗退状態や問題文の表示にも対応しています。
          </p>
        </Box>
        <Button
          component={Link}
          href="/rules"
          size="md"
          rightSection={<ArrowRight />}
        >
          ゲームを作る
        </Button>
      </Box>
    </Box>
  );
}
