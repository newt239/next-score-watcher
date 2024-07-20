"use client";

import { Box, List, Title } from "@mantine/core";

import Link from "@/app/_components/Link/Link";

const Term: React.FC = () => {
  return (
    <Box mt="lg">
      <Title order={2}>ご利用にあたって</Title>
      <List>
        <List.Item>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </List.Item>
        <List.Item>
          本サービスの開発者はユーザーが本サービスを使用したことにより生じる損害について、いかなる責任も負いません。
        </List.Item>
        <List.Item>
          本サービスを利用することにより
          <Link href="/docs/terms_of_service">利用規約</Link>及び
          <Link href="/docs/privacy_policy">プライバシーポリシー</Link>
          に同意したものとみなします。
        </List.Item>
        <List.Item>
          お問い合わせは
          <Link href="https://discord.gg/rct5sx6rbZ">
            開発者のDiscordサーバー
          </Link>
          や<Link href="https://twitter.com/newt239">Twitter</Link>
          からお願いします。
        </List.Item>
        <List.Item>
          本サービスを利用した際はぜひ
          <Link href="https://twitter.com/hashtag/ScoreWatcher?f=live">
            #ScoreWatcher
          </Link>
          でコメントをお寄せください。不具合報告や機能要望なども受け付けます。
        </List.Item>
        <List.Item>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdzHOWVcYOY6zWcrq8-niNOwk8e0XrhdjGESOEXe9Gk5yxNdQ/viewform">
            Googleフォーム
          </Link>
          でユーザーアンケートを行っています。今後のアップデートの参考とするため、ご協力いただけると幸いです。
        </List.Item>
      </List>
    </Box>
  );
};

export default Term;
