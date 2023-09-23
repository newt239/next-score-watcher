/* eslint-disable @next/next/no-img-element */
import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { SignInButton } from "./SignInButton";

import { css } from "@panda/css";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <SignInButton />;
  }

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "16px",
      })}
    >
      <div>
        <img
          alt="アカウントのアバター"
          className={css({
            borderRadius: "full",
            w: "64px",
            aspectRatio: "1/1",
          })}
          src={session.user?.user_metadata.avatar_url}
        />
      </div>
      <div>
        <p>{session.user?.user_metadata.full_name}</p>
      </div>
    </div>
  );
}
