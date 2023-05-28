import { Box, Icon, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

const Term: React.FC = () => {
  return (
    <Box pt={5}>
      <h2>本アプリのご利用にあたって</h2>
      <UnorderedList>
        <ListItem>
          本アプリはあくまで「得点表示アプリ」であり、問題やプレイヤー、試合記録の管理アプリではありません。
        </ListItem>
        <ListItem>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </ListItem>
        <ListItem>
          本アプリの開発者はユーザーが本アプリを使用したことにより生じる損害について、いかなる責任も負いません。
        </ListItem>
        <ListItem>
          お問い合わせは
          <Link href="https://twitter.com/newt239" isExternal color="blue.500">
            開発者のTwitter
            <Icon>
              <ExternalLink />
            </Icon>
          </Link>
          からお願いします。
        </ListItem>
        <ListItem>
          本アプリの使用報告は
          <Link
            href="https://twitter.com/hashtag/ScoreWatcher?f=live"
            isExternal
            color="blue.500"
          >
            #ScoreWatcher
          </Link>
          でコメントしてもらえると嬉しいです。不具合報告や機能要望なども受け付けます。
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default Term;
