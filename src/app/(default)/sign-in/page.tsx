"use client";

import { useState } from "react";

import { Button, Title } from "@mantine/core";

import { signIn } from "./_actions/sign-in";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const handleLogin = () => {
    setError(null);
    signIn();
  };

  return (
    <main>
      <Title>ログイン</Title>
      <Button mt="lg" onClick={handleLogin} color="blue">
        Googleでログイン
      </Button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </main>
  );
}
