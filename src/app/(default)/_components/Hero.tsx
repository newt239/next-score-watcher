import Image from "next/image";
import Link from "next/link";

import { Button, Flex, Text } from "@radix-ui/themes";

import { css } from "@panda/css";

const Hero: React.FC = () => {
  return (
    <div>
      <Flex align="center" justify="center">
        <Flex>
          <div
            className={css({
              fontSize: { base: "3xl", md: "4xl", lg: "5xl" },
              fontWeight: "700",
            })}
          >
            <span className={css({ position: "relative" })}>
              競技クイズのための
            </span>
            <br />
            <span className={css({ color: "green.400" })}>得点表示アプリ</span>
          </div>
          <Text>
            Score
            Watcherは、競技クイズの得点表示に特化したWebアプリケーションです。スコアの表示だけでなく、勝ち抜け・敗退状態や問題文の表示にも対応しています。
          </Text>
          <Flex>
            <Button>
              <Link href="/rules">ゲームを作る</Link>
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex>
        <Image
          alt={"大会画像"}
          height="300"
          objectFit={"cover"}
          src="/images/hero.webp"
          width="300"
        />
      </Flex>
    </div>
  );
};

export default Hero;
