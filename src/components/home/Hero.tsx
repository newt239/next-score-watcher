import { ReactNode } from "react";
import { Link as ReactLink } from "react-router-dom";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Image,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
            <ReactLink to="/option">
              <Link>アプリ設定</Link>
            </ReactLink>
            から、得点表示画面の表示をカスタマイズできます。
          </Text>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ textAlign: "center" }}>
        <Heading as="h1" size="2xl">
          Score Watcher
        </Heading>
        <Text>競技クイズ用得点表示ソフト</Text>
      </Box>
      <Box>
        <h2>主な機能</h2>
        {isDesktop ? (
          <Tabs isManual colorScheme="green" pt={5}>
            <TabList>
              {features.map((feature) => (
                <Tab key={feature.title}>{feature.title}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {features.map((feature) => (
                <TabPanel key={feature.title}>
                  {feature.image ? (
                    <Flex sx={{ gap: 3 }}>
                      <Box w="30%">
                        <h3>{feature.title}</h3>
                        <Text>{feature.description}</Text>
                      </Box>
                      <Box w="70%">
                        <Image
                          src={"images/" + feature.image}
                          alt={`画像: ${feature.title}`}
                          sx={{ borderRadius: "1rem" }}
                        />
                      </Box>
                    </Flex>
                  ) : (
                    <Box>
                      <Text>{feature.description}</Text>
                    </Box>
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        ) : (
          <Accordion defaultIndex={0} pt={5}>
            {features.map((feature) => (
              <AccordionItem key={feature.title}>
                <AccordionButton>
                  <Box flex={1} textAlign="left">
                    <h2 style={{ fontSize: "1rem", padding: 0 }}>
                      {feature.title}
                    </h2>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {feature.image && (
                    <Image
                      src={"images/" + feature.image}
                      alt={`画像: ${feature.title}`}
                      sx={{ borderRadius: "1rem" }}
                    />
                  )}
                  <Text pt={3}>{feature.description}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Box>
    </Box>
  );
};

export default Hero;
