import ButtonLink from "#/components/ButtonLink";
import { css } from "@panda/css";

const Hero: React.FC = () => {
  return (
    <div
      className={css({
        position: "relative",
        w: "100%",
      })}
    >
      <img
        alt={"大会画像"}
        className={css({
          borderRadius: "3xl",
          height: "80vh",
          objectFit: "cover",
          width: "100%",
        })}
        src="/images/hero.webp"
      />
      <div
        className={css({
          backdropFilter: "blur(3px)",
          color: "white",
          border: "solid rgba(194,224,255,.08)",
          left: "50%",
          borderRadius: "3xl",
          m: "16px",
          p: "16px",
          position: "absolute",
          textAlign: "center",
          top: "50%",
          transform: "translate(-50%, -50%)",
          w: "80%",
        })}
      >
        <div
          className={css({
            fontSize: { base: "3xl", lg: "5xl", md: "4xl" },
            fontWeight: "700",
            lineHeight: "initial",
          })}
        >
          <div>競技クイズのための</div>
          <div>得点表示アプリ</div>
        </div>
        <div
          className={css({
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
