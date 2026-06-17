import { Box } from "@mantine/core";
import Image from "next/image";

import QuickStart from "../QuickStart/QuickStart";
import classes from "./Hero.module.css";

const Hero = () => {
  return (
    <Box className={classes.hero}>
      <Box className={classes.hero_media}>
        <Image
          alt="大会画像"
          src="/images/hero.webp"
          fill
          priority
          sizes="100vw"
          className={classes.hero_image}
        />
        <Box className={classes.hero_tint} />
      </Box>
      <Box className={classes.hero_content}>
        <Box className={classes.hero_text}>
          <Box className={classes.hero_title}>
            <span className={classes.title_line}>競技クイズのための</span>
            <span className={classes.title_line}>得点表示アプリ</span>
          </Box>
          <p className={classes.hero_subtitle}>
            <span className={classes.nowrap}>スコアの表示だけでなく、</span>
            <span className={classes.nowrap}>勝ち抜け・敗退状態や</span>
            <span className={classes.nowrap}>問題文の表示にも対応。</span>
          </p>
        </Box>
        <Box className={classes.hero_card}>
          <QuickStart />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
