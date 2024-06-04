import { Box, Button, Image } from "@mantine/core";
import Link from "next/link";

export default function Hero() {
  return (
    <Box w="100%" pos="relative">
      <Image
        alt="大会画像"
        h="80vh"
        w="100%"
        radius="xl"
        fit="cover"
        src="/images/hero.webp"
      />
      <Box
        style={{
          backdropFilter: "blur(3px)",
          color: "white",
          left: "50%",
          borderRadius: "3xl",
          margin: "16px",
          padding: "16px",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
        }}
      >
        <Box
          fz={{ base: "3xl", lg: "5xl", md: "4xl" }}
          style={{
            lineHeight: "initial",
            textShadow: "black 1px 0 10px",
          }}
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
        <Box
          style={{
            my: "16px",
          }}
        >
          <p>
            Score
            Watcherは、競技クイズの得点表示に特化したWebアプリケーションです。
          </p>
          <p>
            スコアの表示だけでなく、勝ち抜け・敗退状態や問題文の表示にも対応しています。
          </p>
        </Box>
        <Button component={Link} href="/rules" size="lg">
          ゲームを作る
        </Button>
      </Box>
    </Box>
  );
}
