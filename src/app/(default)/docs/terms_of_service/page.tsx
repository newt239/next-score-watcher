import { Metadata } from "next";

import { Group, Text, Title } from "@mantine/core";

import Link from "@/app/_components/Link/Link";

export const metadata: Metadata = {
  title: "利用規約",
  alternates: {
    canonical: "https://score-watcher.com/docs/terms_of_service",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Title order={2}>利用規約</Title>
      <Text mb="sm">
        この規約は、本ウェブサイト（PWAモードやベータ版サイト、プレビュー版サイトを含む）から提供している得点表示サービス（以下「本サービス」といいます）の利用に関する条件を定めるものです。
      </Text>
      <Text mb="sm">
        本サービスの利用者は、自らの責任において本サービスを使用することに同意し、本サービスの利用によって生じる一切の損害、損失について、本サービスの開発者は損害賠償義務及びその他一切の責任を負いません。
      </Text>
      <Text mb="sm">
        本サービスを、公序良俗に反する目的で利用することや、開発者が意図するものと著しくかけ離れた方法で利用することを禁止します。
      </Text>
      <Text mb="sm">
        本サービスを商用利用することは、原則禁止とします。詳しくは
        <Link href="/docs/for_commercial_use">商用利用に関するルール</Link>
        をご確認ください。
      </Text>
      <Text mb="sm">全ての規約は、予告無く改変する場合があります。</Text>
      <Text mb="sm">
        本サービスを利用することで、これらの規約に同意したとみなします。
      </Text>
      <Group justify="end">2024年7月18日 制定</Group>
    </>
  );
}
