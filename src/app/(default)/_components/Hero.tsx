/* eslint-disable @next/next/no-img-element */

import ButtonLink from "#/app/_components/ButtonLink";
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
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          m: "16px",
          w: "80%",
        })}
      >
        <div
          className={css({
            fontSize: { base: "3xl", md: "4xl", lg: "5xl" },
            fontWeight: "700",
            lineHeight: "initial",
          })}
        >
          <span className={css({ position: "relative", bgColor: "white" })}>
            競技クイズのための
          </span>
          <span className={css({ color: "green.500", bgColor: "white" })}>
            得点表示アプリ
          </span>
        </div>
        <div
          className={css({
            color: "white",
            my: "16px",
          })}
        >
          <p>
            Score
            Watcherは、競技クイズの得点表示に特化したWebアプリケーションです。
          </p>
          <p>
            スコアの表示だけでなく、勝ち抜け・敗退状態や問題文の表示にも対応しています。
          </p>
        </div>
        <ButtonLink href="/rules" size="xl">
          ゲームを作る
        </ButtonLink>
      </div>
    </div>
  );
};

export default Hero;
