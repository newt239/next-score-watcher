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
          2024年3月までの期間、本サービスへのお問い合わせの受付を停止します。詳細は
          <Link
            color="blue.500"
            href="https://newt-house.notion.site/Score-Watcher-Info-e3605dc670724bc8adf0a5ee3f0c8392"
            isExternal
          >
            Notion上で公開しているページ
            <Icon>
              <ExternalLink />
            </Icon>
          </Link>
          をご確認ください。
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default Term;
