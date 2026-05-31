/**
 * アップデート履歴・今後の予定・要望フォームに関する共通データ。
 * アップデートモーダルと `/changelog` ページの両方から参照する。
 */

/** 変更履歴1バージョン分のデータ */
export type ChangelogEntry = {
  version: string;
  date: string;
  news?: string;
  features?: string[];
  improvements?: string[];
  fixes?: string[];
  others?: string[];
};

/** 変更履歴（新しいバージョンを先頭に並べる） */
export const changelog: ChangelogEntry[] = [
  {
    version: "3.3.0",
    date: "2026-05-29",
    news: "新ルール「アタック25」を追加しました。あわせて複数の形式における機能不備を修正しています。引き続きサポートフォームなどを通じてご報告いただけますと幸いです。",
    features: ["新ルール「アタック25」を追加"],
    improvements: ["表示設定の変更をスコア表示へ即時反映するよう改善"],
    fixes: [
      "誤答数の記号表示で✕の個数や○の混入が起きる不具合を修正",
      "記号付与オフ時に誤答数5以上で✕が付与される不具合を修正",
      "アプリ設定のトグルが正しく保存されない不具合を修正",
      "N○M✕ / normal 形式のスコア計算・勝ち抜け・敗退判定の不具合を修正",
    ],
    others: ["オンライン機能を削除しローカル版のみの構成に変更", "依存関係を更新"],
  },
  {
    version: "3.2.0",
    date: "2025-10-16",
    features: ["オンライン機能の提供に向けたアルファ版をリリース"],
    improvements: ["一部UIを微調整"],
    others: ["依存関係を更新"],
  },
  {
    version: "3.0.0",
    date: "2024-08-20",
    features: [
      "ゲーム開始後にプレイヤーの人数を変更できるよう改善",
      "AQLルールを「その他の形式」から「形式一覧」に移動し他の形式とロジックを統合",
      "ヘッダーを非表示にする機能を追加",
      "ヘッダーやプレイヤーの高さを変更できるよう改善",
    ],
    improvements: [
      "フォントを変更し全体的にUIを再設計",
      "「ゲーム一覧」でグリッド表示とテーブル表示を切り替えられるよう改善",
      "得点表示画面下部の「ゲームログ」で幅が長いとき横スクロールできるよう改善",
    ],
  },
];

/** 今後追加予定の機能（※暫定。実際の予定に合わせて編集してください） */
export const upcomingFeatures: string[] = [
  "得点表示画面のレイアウトをさらに細かくカスタマイズできる機能",
  "複数のゲームを大会としてまとめて管理する機能",
  "クイズ問題のインポート・エクスポート形式の拡充",
  "英語など多言語への対応",
];

/** 新機能の要望・不具合報告を受け付けるGoogleフォームのURL */
export const REQUEST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdzHOWVcYOY6zWcrq8-niNOwk8e0XrhdjGESOEXe9Gk5yxNdQ/viewform";
