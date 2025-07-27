"use client";

import { useState } from "react";

import { Alert, Button, Title } from "@mantine/core";

import { authClient } from "@/utils/auth-client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      // better-authクライアントを使用したサインイン
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("サインインエラー:", err);
      setError("サインインに失敗しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  return (
    <main>
      <Title>ログイン</Title>
      <Button
        mt="lg"
        onClick={handleLogin}
        color="blue"
        loading={loading}
        disabled={loading}
      >
        Googleでログイン
      </Button>
      {error && (
        <Alert color="red" mt="md">
          {error}
        </Alert>
      )}
    </main>
  );
}
