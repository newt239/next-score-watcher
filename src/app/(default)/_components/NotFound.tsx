import { Box } from "@mantine/core";

import Link from "@/app/_components/Link/Link";

const NotFound: React.FC = () => {
  return (
    <Box>
      <h2>ページが見つかりません</h2>
      <p>お探しのページは移動または削除された可能性があります。</p>
      <p>以下のリンクからトップページに戻ってください。</p>
      <p>
        <Link href="https://score-watcher.com/">
          https://score-watcher.com/
        </Link>
      </p>
    </Box>
  );
};

export default NotFound;
