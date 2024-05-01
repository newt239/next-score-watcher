import Link from "~/components/Link";

const NotFound: React.FC = () => {
  return (
    <>
      <h2>ページが見つかりません</h2>
      <p>お探しのページは移動または削除された可能性があります。</p>
      <p>以下のリンクからトップページに戻ってください。</p>
      <p>
        <Link color="blue.500" href="https://score-watcher.com/">
          https://score-watcher.com/
        </Link>
      </p>
    </>
  );
};

export default NotFound;
