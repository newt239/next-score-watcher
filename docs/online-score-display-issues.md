# オンライン版得点表示画面の実装問題点

このドキュメントは、`src/app/(board)/online/games`以下に実装されているオンライン版の得点表示画面に関する実装上の問題点を整理し、改善案を提示します。

## 現在の実装状況

オンライン版の得点表示画面は以下の構成で実装されています：

- `src/app/(board)/online/games/[game_id]/board/page.tsx` - オンライン版ボード表示
- `src/app/(default)/online/games/[game_id]/config/page.tsx` - オンライン版ボード設定画面

## 主要な問題点

### 1. CLAUDE.mdルール違反

**問題**: プロジェクトのコーディング規約に違反する実装が複数存在

**useEffectでのデータ取得**:

- `src/app/(board)/online/games/[game_id]/config/page.tsx`でuseEffectを使用したデータ取得
- CLAUDE.mdでは「useEffect: データ取得には使用しないでください」と明記されているが違反

**型アサーションの濫用**:

- `src/app/(board)/online/games/[game_id]/board/page.tsx:185`など複数箇所で型アサーション使用
- CLAUDE.mdでは「原則として型アサーションを使用しないでください」と規定

**Server Actions禁止ルール**:

- 現在はAPI Routes使用で適切に実装されている（問題なし）

### 2. データ取得パターンの不統一

**問題**: サーバーコンポーネントとクライアントコンポーネントでのデータ取得方法が混在

**不適切なパターン**:

```typescript
// board/page.tsx - クライアントコンポーネントでuseEffectによるデータ取得
useEffect(() => {
  const fetchData = async () => {
    // API呼び出し
  };
  fetchData();
}, []);
```

**推奨パターン（未実装）**:

```typescript
// サーバーコンポーネントでの初期データ取得 + props渡し
const BoardPage = async ({ params }: { params: { gameId: string } }) => {
  const user = await getUser();
  const apiClient = await createApiClientOnServer();
  const initialData = await apiClient.games[":gameId"].$get({ param: { gameId } });
  return <BoardComponent initialData={initialData} />;
};
```

### 3. 型定義の問題

**問題**: オンライン機能用の型定義が不整合・不完全

**独自型定義の重複**:

- `src/app/(board)/online/games/[game_id]/board/page.tsx:20-40`で独自の`OnlineGame`, `User`型を定義
- `src/models/`で定義されている型との重複・不整合

**unknown型の多用**:

```typescript
const [game, setGame] = useState<OnlineGame | unknown>(initialGame);
const [players, setPlayers] = useState<OnlinePlayer[] | unknown[]>(
  initialPlayers
);
```

型ガードで対処しているが、適切な型定義があれば不要

**API レスポンス型の不統一**:

- 一部でparseResponse使用、一部で直接レスポンス処理と不統一

### 4. エラーハンドリングの不統一

**問題**: エラー処理方法が統一されていない

**サイレントエラー処理**:

- `board/page.tsx:58-65`でエラー時にnullを返すだけでユーザーに通知なし
- `config/page.tsx`では一部のエラーでnotifications使用

**エラー回復手順の不備**:

- ネットワークエラー時の回復手順が不明確
- APIエラー時の適切なフォールバック処理がない

### 5. データ重複問題の不適切な対処

**問題**: サーバーサイドで対処すべき問題をクライアント側で修正

**クライアント側での重複除去処理**:

- `config/page.tsx`で複数箇所でプレイヤーの重複除去処理を実装
- 本来はRepository層やAPI層で対処すべき問題
- クライアント側での対症療法的な実装となっている

```typescript
// 不適切な例：クライアント側での重複除去
const uniquePlayers = players.filter(
  (player, index, self) => index === self.findIndex((p) => p.id === player.id)
);
```

### 6. リアルタイム更新機能の欠如

**問題**: リアルタイムデータ同期機能が未実装

- WebSocketやServer-Sent Eventsによるリアルタイム更新機能がない
- 手動リフレッシュやポーリングに依存している
- 複数のクライアント間でのデータ整合性が保証されていない
- 得点更新が他の参加者にリアルタイムで反映されない

### 7. パフォーマンスの問題

**問題**: 非効率なデータ取得・更新パターン

- 得点更新のたびに全データを再取得している
- 不要なAPI呼び出しが発生している
- データキャッシングが実装されていない

### 8. UI/UXの改善余地

**現在実装されている良好な点**:

- `useTransition`を使用したローディング状態表示
- 適切なボタンのdisabled制御
- Mantineを使用した統一されたUI

**改善が必要な点**:

- オフライン状態の検出・通知機能がない
- リアルタイム更新の視覚的フィードバックがない
- 接続状態インジケーターがない

## 良好に実装されている点

### 認証・リダイレクト処理

```typescript
const user = await getUser();
if (!user) {
  redirect("/sign-in");
}
```

### APIクライアントの使用

```typescript
const apiClient = await createApiClientOnServer();
```

### Zodバリデーション

- `src/models/games.ts`でのスキーマ定義は適切

### Mantineを使用したUI

- 統一されたUIコンポーネントの使用
- CSS Modulesを使用したスタイリング（Tailwind CSS未使用で適切）

## 改善案

### 短期的改善（高優先度）

1. **CLAUDE.mdルール違反の修正**
   - useEffectでのデータ取得をサーバーコンポーネント化
   - 型アサーションの除去と適切な型ガード使用
   - API専用型定義の`src/models/`への統一

2. **データ取得パターンの統一**

   ```typescript
   // 推奨パターン
   const OnlineBoardPage = async ({ params }: { params: { gameId: string } }) => {
     const user = await getUser();
     if (!user) redirect("/sign-in");

     const apiClient = await createApiClientOnServer();
     const initialData = await fetchInitialData(apiClient, params.gameId);

     return <OnlineBoardComponent initialData={initialData} />;
   };
   ```

3. **エラーハンドリングの統一**
   - 一貫したエラー通知方法の採用
   - ネットワークエラーやAPIエラーに対する統一的な処理

### 中長期的改善（中優先度）

1. **サーバーサイドでのデータ重複対処**
   - Repository層での重複除去処理実装
   - クライアント側の対症療法的処理を削除

2. **リアルタイム同期機能の実装**
   - Server-Sent EventsまたはWebSocketを使用したリアルタイム更新
   - データの差分更新によるパフォーマンス最適化

3. **UI/UXの向上**
   - リアルタイム更新の視覚的フィードバック
   - オフライン状態の検出と表示
   - 接続状態インジケーター

### 技術的考慮事項

- **CLAUDE.mdの遵守**: すべての実装はプロジェクトのコーディング規約に従う
- **API Routes**: Server Actionsではなく、Honoを使用したAPI Routesで実装
- **型安全性**: 型アサーションを避け、適切な型定義を使用
- **CSS Modules**: Tailwind CSSではなくCSS Modulesでスタイリング
- **日本語対応**: すべてのメッセージとドキュメントは日本語で記述

## 実装優先順位

1. **最優先**: CLAUDE.mdルール違反の修正（useEffect、型アサーション、型定義統一）
2. **高優先**: データ取得パターンの統一とエラーハンドリング統一
3. **中優先**: サーバーサイドでのデータ品質管理とリアルタイム同期機能
4. **低優先**: 高度なUI/UX機能の実装

## 具体的な修正対象ファイル

- `src/app/(board)/online/games/[game_id]/board/page.tsx` - useEffect除去、型アサーション修正
- `src/app/(board)/online/games/[game_id]/config/page.tsx` - 重複除去処理のサーバー移行
- `src/app/(board)/online/games/[game_id]/players/page.tsx` - データ取得パターン統一
- `src/models/` - オンライン機能用型定義の統一
- `src/server/repositories/` - データ重複対処の実装

このドキュメントは実装の進捗に応じて定期的に更新し、問題点の解決状況を追跡する必要があります。
