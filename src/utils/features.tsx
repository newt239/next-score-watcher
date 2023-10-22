import { Icon, Link } from "@chakra-ui/react";
import { ExternalLink } from "tabler-icons-react";

type Feature = {
  news?: React.ReactNode;
  feature: string[];
  bugfix: string[];
};

export const features: { [key: string]: Feature } = {
  "2.4.5": {
    news: (
      <>
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
      </>
    ),
    feature: [],
    bugfix: ["個人設定が反映されない不具合を修正"],
  },
};
