import { Box, Button, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "tabler-icons-react";

const Hero: React.FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <Image
        alt="大会画像"
        sx={{
          height: "80vh",
          width: "100%",
          borderRadius: "3xl",
          objectFit: "cover",
        }}
        src="/images/hero.webp"
      />
      <Box
        sx={{
          backdropFilter: "blur(3px)",
          color: "white",
          left: "50%",
          borderRadius: "3xl",
          margin: "16px",
          padding: "16px",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
        }}
      >
        <Box
          sx={{
            fontSize: { base: "3xl", lg: "5xl", md: "4xl" },
            lineHeight: "initial",
            textShadow: "black 1px 0 10px",
          }}
        >
          <Box>競技クイズのための</Box>
          <Box>
            <Box
              sx={{
                textShadow: "green 1px 0 10px",
              }}
            >
              得点表示
            </Box>
            アプリ
          </Box>
        </Box>
        <Box
          sx={{
            my: "16px",
          }}
        >
          <p>
            Score
            Watcherは、競技クイズの得点表示に特化したWebアプリケーションです。
          </p>
          <p>
            スコアの表示だけでなく、勝ち抜け・敗退状態や問題文の表示にも対応しています。
          </p>
        </Box>
        <Button
          as={Link}
          to="/rules"
          size="lg"
          colorScheme="green"
          rightIcon={<ArrowRight />}
        >
          ゲームを作る
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
