/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";

import Anchor from "#/app/_components/Anchor";
import { css } from "@panda/css";

type FeatureProps = {
  title: string;
  image?: string;
  description: ReactNode;
};

const Features: React.FC = () => {
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
              <Anchor href="/option">アプリ設定</Anchor>
              から、得点表示画面の表示をカスタマイズできます。
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>主な機能</h2>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "0 32px",
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
