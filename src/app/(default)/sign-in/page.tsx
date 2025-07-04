"use client";

import { useCallback, useState } from "react";

import { Button, Title } from "@mantine/core";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const handleLogin = useCallback(async () => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/` : "/",
      },
    });
    if (error) setError(error.message);
  }, []);

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
