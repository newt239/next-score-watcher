import { ReactNode } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

import useDeviceWidth from "#/hooks/useDeviceWidth";

type FeatureProps = {
  title: string;
  image?: string;
  description: ReactNode;
};

const Hero: React.FC = () => {
  const isDesktop = useDeviceWidth();

  const features: FeatureProps[] = [
    {
      title: "基本機能",
      image: "score-watcher_feature_basic.webp",
      description:
        "得点表示に不可欠なスコアの表示・勝ち抜け or 敗退の表示に加え、問題文の表示にも対応しています。得点表示画面はスマートフォンなどでも表示が可能です。",
    },
    {
      title: "一つ戻す",
      image: "score-watcher_feature_undo.gif",
      description: "操作を間違えても、変更を取り消すことが出来ます。",
    },
    {
      title: "勝ち抜けを表示",
      image: "score-watcher_feature_winthrough.webp",
      description: "プレイヤーが勝ち抜けると、画面中央で大きく表示されます。",
    },
    {
      title: "スコアの手動更新",
      image: "score-watcher_feature_editable.gif",
      description:
        "プログラムが想定外の挙動をしたときも大丈夫。プレイヤーのスコアや背景の色を自由に変更できるモードを搭載しています。限定問題数に達したときの判定勝ち抜けなどにも使えます。",
    },
    {
      title: "カラーモード",
      image: "score-watcher_feature_colormode.webp",
      description: "暗い会場でも見やすいダークモードでの表示に対応しています。",
    },
    {
      title: "その他",
      description: (
        <>
          <h3>オフライン対応</h3>
          <Text>
            一回ページを読み込んでおけば、アプリを利用する上でネット接続は必要ありません。プレイヤーデータや問題データがサーバーに送信されることはありません。
          </Text>
          <h3>ショートカットキー</h3>
          <Text>得点表示画面ではショートカットコマンドが利用できます。</Text>
          <h3>表示はカスタマイズ可能</h3>
          <Text>
            <Link as={ReactLink} color="blue.500" to="/option">
              アプリ設定
            </Link>
            から、得点表示画面の表示をカスタマイズできます。
          </Text>
        </>
      ),
    },
  ];

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
              主要な機能を見る
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
