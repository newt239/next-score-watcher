/* eslint-disable @next/next/no-img-element */

import ButtonLink from "#/components/ButtonLink";
import { css } from "@panda/css";

const Hero: React.FC = () => {
  return (
    <div
      className={css({
        w: "100%",
        position: "relative",
      })}
    >
      <img
        alt={"大会画像"}
        className={css({
          width: "100%",
          height: "80vh",
          objectFit: "cover",
          borderRadius: "3xl",
        })}
        src="/images/hero.webp"
      />
      <div
        className={css({
          position: "absolute",
          bottom: 0,
          left: 0,
          m: "16px",
          w: "calc(100% - 32px)",
        })}
      >
        <p
          className={css({
            fontSize: { base: "3xl", md: "4xl", lg: "5xl" },
            fontWeight: "700",
            lineHeight: "initial",
          })}
        >
          <span className={css({ position: "relative", bgColor: "white" })}>
            競技クイズのための
          </span>
          <div></div>
          <span className={css({ color: "green.500", bgColor: "white" })}>
            得点表示アプリ
          </span>
        </p>
        <p
          className={css({
            color: "white",
          })}
        >
          Score
          Watcherは、競技クイズの得点表示に特化したWebアプリケーションです。スコアの表示だけでなく、勝ち抜け・敗退状態や問題文の表示にも対応しています。
        </p>
        <div
          className={css({
            mt: "32px",
            display: "flex",
            justifyContent: "flex-end",
          })}
        >
          <ButtonLink href="/rules">ゲームを作る</ButtonLink>
        </div>
      </div>
    </div>
  );
};

export default Hero;
