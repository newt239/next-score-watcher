import { ArrowBackUp, ExternalLink } from "tabler-icons-react";

import Anchor from "#/app/_components/Anchor";
import ButtonLink from "#/app/_components/ButtonLink";

export const metadata = {
  title: "Webhookについて | Score Watcher",
};

export default function WebhookPage({
  searchParams,
}: {
  searchParams: { from: string };
}) {
  return (
    <div>
      <div>
        {searchParams.from ? (
          <ButtonLink
            href={`/${searchParams.from}/config`}
            size="sm"
            variant="subtle"
          >
            <ArrowBackUp />
            ゲーム設定に戻る
          </ButtonLink>
        ) : (
          <ButtonLink href="/option" size="sm" variant="subtle">
            <ArrowBackUp />
            アプリ設定に戻る
          </ButtonLink>
        )}
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
          <p color="red.500">※こちらは開発者向けの高度な機能となります。</p>
          <p>
            ゲームが進行するたびに、設定されたURLへPOSTリクエストを行います。
          </p>
          <p>
            POSTされるデータは<code>info</code>, <code>logs</code>,{" "}
            <code>scores</code>で構成されています。
          </p>
          <p>詳細は実際にご利用の上お確かめください。</p>
          <h3>Response Example</h3>
          <Anchor href="https://gist.github.com/newt239/e03f8ed7fbc00852999bced29d80e8af">
            Webhookで提供されるjsonの例｜Score Watcher
            <ExternalLink />
          </Anchor>
        </div>
      </div>
    </div>
  );
}
