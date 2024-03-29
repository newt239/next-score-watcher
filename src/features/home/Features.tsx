import { css } from "@panda/css";

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
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: side === "left" ? "flex-start" : "flex-end",
        gap: "0.5rem",
        p: "10px",
        pt: "50px",
        fontSize: "1.5rem",
        lg: {
          p: "50px",
          pb: 0,
          fontSize: "2rem",
          gap: "1rem",
        },
      })}
    >
      <div
        className={css({
          position: "relative",
        })}
      >
        <div
          className={css({
            position: "absolute",
            backgroundColor: "green.300",
            borderRadius: "50%",
            zIndex: 0,
            top: -5,
            left: side === "left" ? -5 : undefined,
            right: side === "right" ? -5 : undefined,
            width: 90,
            height: 90,
            opacity: 0.5,
            filter: "blur(5px)",
            _dark: {
              backgroundColor: "green.700",
            },
            lg: {
              top: -30,
              left: side === "left" ? -30 : undefined,
              right: side === "right" ? -30 : undefined,
              width: 120,
              height: 120,
            },
          })}
        ></div>
      </div>
      <div
        className={css({
          fontWeight: 700,
          textWrap: "balance",
          textAlign: side === "left" ? "start" : "end",
          zIndex: 1,
        })}
      >
        {title}
      </div>
      <img
        className={css({
          borderRadius: "1rem",
          filter: "drop-shadow(1px 2px 3px black)",
          width: "max(75%, 300px)",
        })}
        src={`images/${image}`}
        alt={description}
      />
    </div>
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
    <div
      className={css({
        p: "20px",
        backgroundImage:
          "linear-gradient(0deg, transparent calc(100% - 1px), #f0f0f0 calc(100% - 1px)),linear-gradient(90deg, transparent calc(100% - 1px), #f0f0f0 calc(100% - 1px))",
        backgroundSize: "20px 20px",
        backgroundPosition: "center center",
        backgroundRepeat: "repeat",
        zIndex: -1,
        _dark: {
          backgroundImage:
            "linear-gradient(0deg, transparent calc(100% - 1px), #2d3748 calc(100% - 1px)),linear-gradient(90deg, transparent calc(100% - 1px), #2d3748 calc(100% - 1px))",
        },
      })}
    >
      {features.map((feature) => (
        <EachFeature key={feature.title} {...feature} />
      ))}
    </div>
  );
};

export default Features;
