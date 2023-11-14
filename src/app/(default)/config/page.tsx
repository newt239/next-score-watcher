"use client";

import Anchor from "#/app/_components/Anchor";
import Button from "#/app/_components/Button";
import FormControl from "#/app/_components/FormControl";
import TextInput from "#/app/_components/TextInput";
import Preferences from "#/components/block/Preferences";
import { css } from "@panda/css";

export default function AppConfigPage() {
  return (
    <>
      <div>
        <h2>アプリ設定</h2>
        <Preferences />
        <div>
          <FormControl
            helperText="イベント発生時設定されたURLへPOSTリクエストを送信します。詳しくはwebhookについてを御覧ください。"
            label="Webhook"
          >
            <TextInput
              placeholder="https://score-watcher.newt239.dev/api"
              type="url"
            />
          </FormControl>
          <FormControl
            helperText="アプリが上手く動作しない場合にお試しください。"
            label="アプリの初期化"
          >
            <div
              className={css({
                alignItems: "center",
                justifyContent: "space-between",
              })}
            >
              <Button>初期化する</Button>
            </div>
          </FormControl>
        </div>
      </div>
      <div>
        <h2>アプリ情報</h2>
        <p>
          アップデート情報は
          <Anchor href="https://github.com/newt239/next-score-watcher/releases">
            リリースノート
          </Anchor>
          をご確認ください。
        </p>
        <div>
          <table>
            <tbody>
              <tr>
                <th>バージョン</th>
                <td>v{localStorage.getItem("scorewatcher-version")}</td>
              </tr>
              <tr>
                <th>開発者</th>
                <td>
                  <Anchor href="https://twitter.com/newt239">newt239</Anchor>
                </td>
              </tr>
              <tr>
                <th>リポジトリ</th>
                <td>
                  <Anchor href="https://github.com/newt239/next-score-watcher">
                    newt239/next-score-watcher
                  </Anchor>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
