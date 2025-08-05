"use client";

import { useState, useTransition } from "react";

import { Alert, Button, Title } from "@mantine/core";

import { authClient } from "@/utils/auth/auth-client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = async () => {
    setError(null);
    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        });
      } catch (err) {
        console.error("サインインエラー:", err);
        setError("サインインに失敗しました。もう一度お試しください。");
      }
    });
  };

  return (
    <main>
      <Title>ログイン</Title>
      <Button
        mt="lg"
        onClick={handleLogin}
        color="blue"
        loading={isPending}
        disabled={isPending}
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
