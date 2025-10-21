import type { Metadata } from "next";

import { Code } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";

import ButtonLink from "@/components/ButtonLink";
import Link from "@/components/Link";

export const metadata: Metadata = {
  title: "Webhookについて",
  alternates: {
    canonical: "https://score-watcher.com/option/webhook",
  },
};

const WebhookPage = () => {
  return (
    <>
      <ButtonLink
        variant="subtle"
        href="/option"
        leftSection={<IconArrowBackUp />}
        size="sm"
      >
        アプリ設定に戻る
      </ButtonLink>
      <div>
        <h2>Discord Webhookについて</h2>
        <p>プレイヤーの勝ち抜け時にDiscordへメッセージを送信します。</p>
        <p>まずメッセージを受け取りたいチャンネルの設定を開いてください。</p>
        <p>
          「連携サービス」タブ内に「ウェブフック」という項目があるので、「ウェブフックを作成」をクリックし、「ウェブフックURLをコピー」してください。
        </p>
        <p>
          コピーしたURLを設定内に貼り付けることで、通知が行われるようになります。
        </p>
      </div>
      <div>
        <h2>Webhookについて</h2>
        <p>※こちらは開発者向けの高度な機能となります。</p>
        <p>ゲームが進行するたびに、設定されたURLへPOSTリクエストを行います。</p>
        <p>
          POSTされるデータは<Code>info</Code>, <Code>logs</Code>,{" "}
          <Code>scores</Code>で構成されています。
        </p>
        <p>詳細は実際にご利用の上お確かめください。</p>
        <h3>Response Example</h3>
        <Link href="https://gist.github.com/newt239/e03f8ed7fbc00852999bced29d80e8af">
          Webhookで提供されるjsonの例｜Score Watcher
        </Link>
      </div>
    </>
  );
};

export default WebhookPage;
