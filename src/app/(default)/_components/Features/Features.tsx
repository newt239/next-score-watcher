import { Box, Flex, Image } from "@mantine/core";

import classes from "./Features.module.css";

type FeatureProps = {
  title: string;
  image?: string;
  description: string;
};

const EachFeature: React.FC<FeatureProps> = ({ title, image, description }) => {
  return (
    <Flex className={classes.each_feature}>
      <Box pos="relative">
        <Box className={classes.feature_decoration}></Box>
      </Box>
      <Box className={classes.feature_title}>{title}</Box>
      <Image
        src={`images/${image}`}
        alt={description}
        className={classes.feature_image}
      />
    </Flex>
  );
};

const Features: React.FC = () => {
  const features: FeatureProps[] = [
    {
      title: "得点表示にかかる手間を最小限に",
      image: "score-watcher_feature_basic.webp",
      description:
        "得点表示に不可欠なスコアの表示・勝ち抜け or 敗退の表示に加え、問題文の表示にも対応しています。得点表示画面はスマートフォンなどでも表示が可能です。",
    },
    {
      title: "操作を間違えてもすぐに戻せる",
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
  ];

  return (
    <Box className={classes.features}>
      {features.map((feature) => (
        <EachFeature key={feature.title} {...feature} />
      ))}
    </Box>
  );
};

export default Features;
