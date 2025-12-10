import type { Metadata } from "next";

import { Group, Text, Title } from "@mantine/core";

import Link from "@/components/Link";

export const metadata: Metadata = {
  title: "商用利用について",
  alternates: {
    canonical: "https://score-watcher.com/docs/for_commercial_use",
  },
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <Title order={2}>商用利用に関するルール</Title>
      <Text mb="sm">
        本サービスでは金銭的な余裕のない学生や団体の活動の助けになりたいという思いから、現在すべての機能を無償で提供しております。
      </Text>
      <Text mb="sm">
        このため、本サービスを商用に利用することや、営利目的で利用することは、原則として禁止しています。
      </Text>
      <Text mb="sm">ここで言う「商用利用」とは、以下のような場合を指します。</Text>
      <ul>
        <li>
          参加者がクイズに参加するために参加費（名称にかかわない）を支払う必要があるイベントにおいて利用する場合
          <ul>
            <li>
              ただし、徴収した参加費をイベント会場や早押しボタンのレンタル料として利用する場合など、イベントの開催にあたって必要な経費（人件費を除く）に充てる場合を除きます。
            </li>
          </ul>
        </li>
        <li>本サービスを利用した有料サービスを提供する場合</li>
        <li>企業が利用する場合</li>
        <li>その他、開発者が商用利用と判断する場合</li>
      </ul>
      <Text mb="sm">
        許諾のない非営利目的での利用が確認された場合、当該団体に対してアクセス制限や団体名公表などの措置を行う場合があります。
      </Text>
      <Text mb="sm">
        かならず開発者と連絡を取り、許可を得てください。
        <Link href="https://x.com/newt239">Twitter</Link>や
        <Link href="mailto:contact@newt239.dev">メール</Link>、
        <Link href="https://discord.gg/rct5sx6rbZ">Discordサーバー</Link>
        などでお気軽にご相談ください。
      </Text>
      <Group justify="end">2024年7月18日 制定</Group>
      <Group justify="end">2024年8月31日 改定</Group>
    </>
  );
};

export default PrivacyPolicyPage;
