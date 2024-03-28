import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Code, Icon, Link } from "@chakra-ui/react";
import { ArrowBackUp, ExternalLink } from "tabler-icons-react";

import ButtonLink from "#/components/ButtonLink";

const WebhookPage = () => {
  const [params] = useSearchParams();
  const from = params.get("from");

  useEffect(() => {
    document.title = "Webhookについて | Score Watcher";
  }, []);

  return (
    <div>
      <div>
        {from ? (
          <ButtonLink href={`/${from}/config`} leftIcon={<ArrowBackUp />}>
            ゲーム設定に戻る
          </ButtonLink>
        ) : (
          <ButtonLink href="/option" leftIcon={<ArrowBackUp />} size="sm">
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
          <p>※こちらは開発者向けの高度な機能となります。</p>
          <p>
            ゲームが進行するたびに、設定されたURLへPOSTリクエストを行います。
          </p>
          <p>
            POSTされるデータは<Code>info</Code>, <Code>logs</Code>,{" "}
            <Code>scores</Code>で構成されています。
          </p>
          <p>詳細は実際にご利用の上お確かめください。</p>
          <h3>Response Example</h3>
          <Link
            color="blue.500"
            href="https://gist.github.com/newt239/e03f8ed7fbc00852999bced29d80e8af"
            isExternal
          >
            Webhookで提供されるjsonの例｜Score Watcher
            <Icon>
              <ExternalLink />
            </Icon>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WebhookPage;
