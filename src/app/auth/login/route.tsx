import { supabase } from "#/utils/supabase";

export default function Login() {
  const onClickSignIn = async () => {
    "use server";

    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <form action={onClickSignIn} method="post">
      <input name="password" type="password" />
      <button>Sign In</button>
    </form>
  );
}
