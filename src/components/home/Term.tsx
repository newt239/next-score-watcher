import { Box, Icon, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

const Term: React.FC = () => {
  return (
    <Box pt={5}>
      <h2>本アプリのご利用にあたって</h2>
      <UnorderedList>
        <ListItem>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </ListItem>
        <ListItem>
          本アプリの開発者はユーザーが本アプリを使用したことにより生じる損害について、いかなる責任も負いません。
        </ListItem>
        <ListItem>
          お問い合わせは開発者の
          <Link
            color="blue.500"
            href="https://discord.gg/rct5sx6rbZ"
            isExternal
          >
            Discordサーバー
            <Icon>
              <ExternalLink />
            </Icon>
          </Link>
          からお願いします。
        </ListItem>
        <ListItem>
          本アプリの使用報告は
          <Link
            color="blue.500"
            href="https://twitter.com/hashtag/ScoreWatcher?f=live"
            isExternal
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
