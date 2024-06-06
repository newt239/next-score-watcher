"use client";

import { Anchor, List, Title } from "@mantine/core";

const Term: React.FC = () => {
  return (
    <div>
      <Title order={2}>ご利用にあたって</Title>
      <List>
        <List.Item>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </List.Item>
        <List.Item>
          本アプリの開発者はユーザーが本アプリを使用したことにより生じる損害について、いかなる責任も負いません。
        </List.Item>
        <List.Item>
          お問い合わせは
          <Anchor href="https://discord.gg/rct5sx6rbZ" target="_blank">
            開発者のDiscordサーバー
          </Anchor>
          や
          <Anchor target="_blank" href="https://twitter.com/newt239">
            Twitter
          </Anchor>
          からお願いします。
        </List.Item>
        <List.Item>
          本アプリを利用した際はぜひ
          <Anchor
            target="_blank"
            href="https://twitter.com/hashtag/ScoreWatcher?f=live"
          >
            #ScoreWatcher
          </Anchor>
          でコメントをお寄せください。不具合報告や機能要望なども受け付けます。
        </List.Item>
        <List.Item>
          <Anchor
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdzHOWVcYOY6zWcrq8-niNOwk8e0XrhdjGESOEXe9Gk5yxNdQ/viewform"
          >
            Googleフォーム
          </Anchor>
          でユーザーアンケートを行っています。今後のアップデートの参考とするため、ご協力いただけると幸いです。
        </List.Item>
      </List>
    </div>
  );
};

export default Term;
