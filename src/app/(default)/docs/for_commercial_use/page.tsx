import { Metadata } from "next";

import { Text, Title } from "@mantine/core";

export const metadata: Metadata = {
  title: "商用利用について",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Title order={2}>商用利用に関するルール</Title>
      <Text mb="sm">
        本サービスを商用利用する際は、開発者と直接コンタクトを取り、別途許諾を得る必要があります。
      </Text>
      <Text mb="sm">
        ここで言う「商用利用」とは、以下のような場合を指します。
      </Text>
      <ul>
        <li>
          参加者がクイズに参加するために参加費（名称にかかわない）を払う必要があるイベントにおいて利用する場合
          <ul>
            <li>
              ただし、徴収した参加費を全額イベント会場のレンタル料として利用する場合を除きます。
            </li>
          </ul>
        </li>
        <li>本サービスを利用した有料サービスを提供する場合</li>
        <li>その他、開発者が商用利用と判断する場合</li>
      </ul>
    </>
  );
}
