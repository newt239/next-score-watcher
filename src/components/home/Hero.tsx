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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import useDeviceWidth from "#/hooks/useDeviceWidth";

type FeatureProps = {
  title: string;
  image?: string;
  description: string;
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
      title: "オフライン対応",
      description:
        "一回ページを読み込んでおけば、アプリを利用する上でネット接続は必要ありません。プレイヤーデータや問題データがサーバーに送信されることはありません。",
    },
  ];

  return (
    <>
      <Box sx={{ textAlign: "center" }}>
        <Heading as="h1" size="2xl">
          Score Watcher
        </Heading>
        <p>競技クイズ用得点表示ソフト</p>
      </Box>
      <Box>
        <H2>主な機能</H2>
        {isDesktop ? (
          <Tabs isManual colorScheme="green" sx={{ pt: 5 }}>
            <TabList>
              {features.map((feature) => (
                <Tab key={feature.title}>{feature.title}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {features.map((feature) => (
                <TabPanel key={feature.title}>
                  <H3 pt={0}>{feature.title}</H3>
                  {feature.image ? (
                    <Flex sx={{ p: 3, gap: 3 }}>
                      <Box w="70%">
                        <Image
                          src={"images/" + feature.image}
                          alt={feature.description}
                          sx={{ borderRadius: "1rem" }}
                        />
                      </Box>
                      <Box w="30%">
                        <p>{feature.description}</p>
                      </Box>
                    </Flex>
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <p>{feature.description}</p>
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
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {feature.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {feature.image && (
                    <Image
                      src={"images/" + feature.image}
                      alt={feature.description}
                      sx={{ borderRadius: "1rem" }}
                    />
                  )}
                  <p>{feature.description}</p>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Box>
    </>
  );
};

export default Hero;
