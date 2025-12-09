import type { Metadata } from "next";

import { Text, Title } from "@mantine/core";

import Link from "@/components/Link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  alternates: {
    canonical: "https://score-watcher.com/docs/privacy_policy",
  },
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <Title order={2}>プライバシーポリシー</Title>
      <Title order={3} mt="lg">
        アクセス解析ツールについて
      </Title>
      <Text mb="sm">
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
      </Text>
      <Text mb="sm">
        この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しての詳細は
        <Link href="https://marketingplatform.google.com/about/analytics/terms/jp/">
          Googleアナリティクスサービス利用規約
        </Link>
        のページをご覧ください。
      </Text>
      <Title order={3} mt="lg">
        エラー監視ツールについて
      </Title>
      <Text mb="sm">
        当サイトでは、エラー監視ツール「Sentry」を使用しています。このSentryはエラーの発生箇所や発生回数を収集するためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
      </Text>
      <Text mb="sm">
        この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しての詳細は
        <Link href="https://sentry.io/privacy/">Sentryプライバシーポリシー</Link>
        のページをご覧ください。
      </Text>
    </>
  );
};

export default PrivacyPolicyPage;
