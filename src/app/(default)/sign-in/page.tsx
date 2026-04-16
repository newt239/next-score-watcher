import { Alert, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import LoginForm from "./_components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ callbackURL?: string }>;
};

/**
 * オンライン機能へのサインインページ
 * 認証後のリダイレクト先はクエリパラメータ callbackURL で指定する
 * 指定が無い場合はオンライン版トップ (/online) に戻す
 */
const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const callbackURL =
    params.callbackURL && params.callbackURL.startsWith("/")
      ? params.callbackURL
      : "/online/games";

  return (
    <main>
      <Title>ログイン</Title>
      <Alert
        color="red"
        title="アルファ版の機能です"
        icon={<IconInfoCircle />}
        mt="md"
      >
        ログイン機能はアルファ版の機能です。この期間に保存されたデータはすべて正式リリース時に削除されます。
      </Alert>
      <LoginForm callbackURL={callbackURL} />
    </main>
  );
};

export default LoginPage;
