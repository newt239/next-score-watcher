import { Metadata } from "next";

import { Text, Title } from "@mantine/core";

export const metadata: Metadata = {
  title: "商用利用について",
  alternates: {
    canonical: "https://score-watcher.com/docs/for_commercial_use",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Title order={2}>商用利用に関するルール</Title>
      <Text mb="sm">
        本サービスを商用に利用することや、非営利目的で利用することは、原則として禁止します。
      </Text>
      <Text mb="sm">
        ただし、開発者と別途直接コンタクトを取り、許諾を得た場合に限り、これを許可します。
      </Text>
      <Text mb="sm">
        ここで言う「商用利用」とは、以下のような場合を指します。
      </Text>
      <ul>
        <li>
          参加者がクイズに参加するために参加費（名称にかかわない）を支払う必要があるイベントにおいて利用する場合
          <ul>
            <li>
              ただし、徴収した参加費を全額イベント会場のレンタル料として利用する場合を除きます。
            </li>
          </ul>
        </li>
        <li>本サービスを利用した有料サービスを提供する場合</li>
        <li>その他、開発者が商用利用と判断する場合</li>
      </ul>
      <Text mb="sm">
        許諾のない非営利目的での利用が確認された場合、当該団体に対してアクセス制限や団体名公表などの措置を行う場合があります。
      </Text>
    </>
  );
}
