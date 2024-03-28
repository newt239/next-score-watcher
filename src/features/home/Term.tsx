import Link from "~/components/custom/Link";

const Term: React.FC = () => {
  return (
    <div>
      <h2>ご利用にあたって</h2>
      <ul>
        <li>
          データはすべて端末上に保存されますが、アップデートにより予告なくデータがリセットされることがあります。
        </li>
        <li>
          本アプリの開発者はユーザーが本アプリを使用したことにより生じる損害について、いかなる責任も負いません。
        </li>
        <li>
          お問い合わせは
          <Link href="https://discord.gg/rct5sx6rbZ">
            開発者のDiscordサーバー
          </Link>
          やTwitter からお願いします。
        </li>
        <li>
          本アプリを利用した際はぜひ
          <Link href="https://twitter.com/hashtag/ScoreWatcher?f=live">
            #ScoreWatcher
          </Link>
          でコメントをお寄せください。不具合報告や機能要望なども受け付けます。
        </li>
        <li>
          <Link href="https://forms.gle/T6CGBZntoGAiQSxH9">Googleフォーム</Link>
          でユーザーアンケートを行っています。今後のアップデートの参考とするため、ご協力いただけると幸いです。
        </li>
      </ul>
    </div>
  );
};

export default Term;
