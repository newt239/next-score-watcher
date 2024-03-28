import { ReactNode } from "react";

import Anchor from "#/components/Anchor";
import { css } from "@panda/css";

type FeatureProps = {
  title: string;
  image?: string;
  description: ReactNode;
};

const Features: React.FC = () => {
  const features: FeatureProps[] = [
    {
      description:
        "得点表示に不可欠なスコアの表示・勝ち抜け or 敗退の表示に加え、問題文の表示にも対応しています。得点表示画面はスマートフォンなどでも表示が可能です。",
      image: "score-watcher_feature_basic.webp",
      title: "基本機能",
    },
    {
      description: "操作を間違えても、変更を取り消すことが出来ます。",
      image: "score-watcher_feature_undo.gif",
      title: "一つ戻す",
    },
    {
      description: "プレイヤーが勝ち抜けると、画面中央で大きく表示されます。",
      image: "score-watcher_feature_winthrough.webp",
      title: "勝ち抜けを表示",
    },
    {
      description:
        "プログラムが想定外の挙動をしたときも大丈夫。プレイヤーのスコアや背景の色を自由に変更できるモードを搭載しています。限定問題数に達したときの判定勝ち抜けなどにも使えます。",
      image: "score-watcher_feature_editable.gif",
      title: "スコアの手動更新",
    },
    {
      description: "暗い会場でも見やすいダークモードでの表示に対応しています。",
      image: "score-watcher_feature_colormode.webp",
      title: "カラーモード",
    },
    {
      description: (
        <>
          <div>
            <h4>オフライン対応</h4>
            <p>
              一回ページを読み込んでおけば、アプリを利用する上でネット接続は必要ありません。プレイヤーデータや問題データがサーバーに送信されることはありません。
            </p>
          </div>
          <div>
            <h4>ショートカットキー</h4>
            <p>得点表示画面ではショートカットコマンドが利用できます。</p>
          </div>
          <div>
            <h4>表示はカスタマイズ可能</h4>
            <p>
              <Anchor href="/config">アプリ設定</Anchor>
              から、得点表示画面の表示をカスタマイズできます。
            </p>
          </div>
        </>
      ),
      title: "その他",
    },
  ];

  return (
    <div>
      <h2>主な機能</h2>
      <div
        className={css({
          display: "grid",
          gap: "0 32px",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        })}
      >
        {features.map((feature) => (
          <div key={feature.title}>
            <h3>{feature.title}</h3>
            {feature.image && (
              <img
                alt={`画像: ${feature.title}`}
                className={css({
                  borderRadius: "md",
                })}
                src={"images/" + feature.image}
              />
            )}
            <div>{feature.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
