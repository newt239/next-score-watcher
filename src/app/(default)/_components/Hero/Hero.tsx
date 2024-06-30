import Link from "next/link";

import { Box, Button, Image } from "@mantine/core";
import { ArrowRight } from "tabler-icons-react";

import classes from "./Hero.module.css";

export default function Hero() {
  return (
    <Box className={classes.hero}>
      <Image
        alt="大会画像"
        radius="xl"
        src="/images/hero.webp"
        className={classes.hero_image}
      />
      <Box className={classes.hero_text_area}>
        <Box className={classes.hero_text}>
          <Box>競技クイズのための</Box>
          <Box>
            <Box className={classes.marked_text}>得点表示</Box>
            アプリ
          </Box>
        </Box>
        <Box my="lg">
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
          size="lg"
          rightSection={<ArrowRight />}
        >
          ゲームを作る
        </Button>
      </Box>
    </Box>
  );
}
