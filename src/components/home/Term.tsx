import { Icon, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

const Term: React.FC = () => {
  return (
    <>
      <h2>本ソフトのご利用にあたって</h2>
      <UnorderedList py={5}>
        <ListItem>
          本ソフトはあくまで「得点表示ソフト」であり、問題やプレイヤー、試合記録の管理ソフトではありません。
        </ListItem>
        <ListItem>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </ListItem>
        <ListItem>
          本ソフトの開発者はユーザーが本ソフトを使用したことにより生じる損害について、いかなる責任も負いません。
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
    </>
  );
};

export default Term;
