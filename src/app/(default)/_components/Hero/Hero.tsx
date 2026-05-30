import { Box, Image } from "@mantine/core";

import classes from "./Hero.module.css";
import QuickStart from "./QuickStart/QuickStart";

const Hero = () => {
  return (
    <Box className={classes.hero}>
      <Box className={classes.hero_media}>
        <Image alt="大会画像" src="/images/hero.webp" className={classes.hero_image} />
        <Box className={classes.hero_overlay} />
      </Box>
      <Box className={classes.hero_content}>
        <Box className={classes.hero_text}>
          <Box>競技クイズのための</Box>
          <Box>得点表示アプリ</Box>
        </Box>
        <p className={classes.hero_subtitle}>
          <span className={classes.nowrap}>スコアの表示だけでなく、</span>
          <span className={classes.nowrap}>勝ち抜け・敗退状態や</span>
          <span className={classes.nowrap}>問題文の表示にも対応。</span>
        </p>
        <Box className={classes.hero_card}>
          <QuickStart />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
