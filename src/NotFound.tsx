import { Box } from "@chakra-ui/react";
import Link from "~/components/common/Link";

const NotFound: React.FC = () => {
  return (
    <Box sx={{ px: "1rem" }}>
      <h2>ページが見つかりません</h2>
      <p>お探しのページは移動または削除された可能性があります。</p>
      <p>以下のリンクからトップページに戻ってください。</p>
      <p>
        <Link color="blue.500" href="https://score-watcher.com/">
          https://score-watcher.com/
        </Link>
      </p>
    </Box>
  );
};

export default NotFound;
