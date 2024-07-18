import Link from "next/link";

import { IconBrandX } from "@tabler/icons-react";

import classes from "./XIntentButton.module.css";

type Props = {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
  related?: string[];
  in_reply_to?: string;
} & React.ComponentProps<"a">;

const XIntentButton: React.FC<Props> = ({
  text,
  url,
  hashtags,
  via,
  related,
  in_reply_to,
  ...intrinsicProps
}) => {
  const _url = new URL("https://x.com/intent/tweet");

  if (text !== undefined) _url.searchParams.set("text", text);
  if (url !== undefined) _url.searchParams.set("url", url);
  if (hashtags !== undefined)
    _url.searchParams.set("hashtags", hashtags.join(","));
  if (via !== undefined) _url.searchParams.set("via", via);
  if (related !== undefined)
    _url.searchParams.set("related", related.join(","));
  if (in_reply_to !== undefined)
    _url.searchParams.set("in_reply_to", in_reply_to);

  return (
    <Link
      href={_url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className={classes.tweet_button}
      {...intrinsicProps}
    >
      <IconBrandX size={12} />
      でシェア
    </Link>
  );
};

export default XIntentButton;
