import { Box, Flex, Image } from "@mantine/core";

type FeatureProps = {
  title: string;
  image?: string;
  description: string;
  side: "left" | "right";
};

const EachFeature: React.FC<FeatureProps> = ({
  title,
  image,
  description,
  side,
}) => {
  return (
    <Flex
      className="flex-col gap-2 p-2 text-2xl md:gap-4 md:p-8 md:text-3xl"
      style={{
        alignItems: side === "left" ? "flex-start" : "flex-end",
      }}
    >
      <Box className="relative">
        <Box
          className="
          absolute inset-x-[-5px] top-[-5px] z-0 size-[90px] rounded-full bg-teal-300 opacity-50 blur-[5px]
          md:inset-x-[-30px] md:top-[-30px] md:size-[120px]"
          style={{
            [side === "right" ? "left" : "right"]: undefined,
          }}
        ></Box>
      </Box>
      <Box
        className="z-10 text-balance font-bold"
        style={{
          textAlign: side === "left" ? "start" : "end",
        }}
      >
        {title}
      </Box>
      <Image
        className="w-3/4 drop-shadow-md"
        src={`images/${image}`}
        alt={description}
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
      side: "left",
    },
    {
      title: "操作を間違えてもすぐに戻せる",
      image: "score-watcher_feature_undo.gif",
      description: "操作を間違えても、変更を取り消すことが出来ます。",
      side: "right",
    },
    {
      title: "勝ち抜けを表示",
      image: "score-watcher_feature_winthrough.webp",
      description: "プレイヤーが勝ち抜けると、画面中央で大きく表示されます。",
      side: "left",
    },
    {
      title: "スコアの手動更新",
      image: "score-watcher_feature_editable.gif",
      description:
        "プログラムが想定外の挙動をしたときも大丈夫。プレイヤーのスコアや背景の色を自由に変更できるモードを搭載しています。限定問題数に達したときの判定勝ち抜けなどにも使えます。",
      side: "right",
    },
  ];

  return (
    <Box
      className="z-0 p-5 pb-0"
      style={{
        backgroundImage:
          "linear-gradient(0deg, transparent calc(100% - 1px), #f0f0f0 calc(100% - 1px)),linear-gradient(90deg, transparent calc(100% - 1px), #f0f0f0 calc(100% - 1px))",
        backgroundSize: "20px 20px",
        backgroundPosition: "center center",
        backgroundRepeat: "repeat",
        _dark: {
          backgroundImage:
            "linear-gradient(0deg, transparent calc(100% - 1px), #2d3748 calc(100% - 1px)),linear-gradient(90deg, transparent calc(100% - 1px), #2d3748 calc(100% - 1px))",
        },
      }}
    >
      {features.map((feature) => (
        <EachFeature key={feature.title} {...feature} />
      ))}
    </Box>
  );
};

export default Features;
