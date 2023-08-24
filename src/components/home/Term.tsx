import { Box, Icon, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

const Term: React.FC = () => {
  return (
    <Box pt={5}>
      <h2>ご利用にあたって</h2>
      <UnorderedList>
        <ListItem>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </ListItem>
        <ListItem>
          本アプリの開発者はユーザーが本アプリを使用したことにより生じる損害について、いかなる責任も負いません。
        </ListItem>
        <ListItem>
          お問い合わせは
          <Link
            color="blue.500"
            href="https://discord.gg/rct5sx6rbZ"
            isExternal
          >
            開発者のDiscordサーバー
            <Icon>
              <ExternalLink />
            </Icon>
          </Link>
          やTwitter からお願いします。
        </ListItem>
        <ListItem>
          本アプリを利用した際はぜひ
          <Link
            color="blue.500"
            href="https://twitter.com/hashtag/ScoreWatcher?f=live"
            isExternal
          >
            #ScoreWatcher
          </Link>
          でコメントをお寄せください。不具合報告や機能要望なども受け付けます。
        </ListItem>
        <ListItem>
          <Link
            href="https://forms.gle/T6CGBZntoGAiQSxH9"
            sx={{ color: "blue.500" }}
          >
            Googleフォーム
          </Link>
          でユーザーアンケートを行っています。今後のアップデートの参考とするため、ご協力いただけると幸いです。
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default Term;
