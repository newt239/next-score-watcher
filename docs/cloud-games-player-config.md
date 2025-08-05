# Cloud Games プレイヤー設定機能設計

## 概要

Cloud Gamesにおけるプレイヤー設定機能の詳細設計です。既存のIndexedDB版の機能をSQLiteベースに移行し、クラウド対応を行います。

## 機能要件

### 基本機能

1. **プレイヤー追加**: 既存プレイヤーから選択または新規作成
2. **プレイヤー削除**: ゲームからプレイヤーを除外
3. **並び順変更**: ドラッグ&ドロップによる順序変更
4. **個別設定**: プレイヤーごとの初期値設定

### 設定項目

- 初期スコア（initial_score）
- 初期正解数（initial_correct_count）
- 初期誤答数（initial_wrong_count）
- 表示順序（display_order）

## データベース設計

### 既存テーブルの活用

```sql
-- ゲーム参加プレイヤー（既存）
game_player (
  id: string PRIMARY KEY,
  game_id: string REFERENCES game(id),
  player_id: string REFERENCES player(id),
  display_order: integer NOT NULL,
  initial_score: integer DEFAULT 0,
  initial_correct_count: integer DEFAULT 0,
  initial_wrong_count: integer DEFAULT 0,
  user_id: string REFERENCES user(id),
  created_at: timestamp,
  updated_at: timestamp,
  deleted_at: timestamp
)
```

### 必要なAPI拡張

既存の`cloud-db.ts`に以下の関数を追加:

```typescript
// ゲームプレイヤーの更新
export const updateCloudGamePlayer = async (
  gameId: string,
  playerId: string,
  playerData: Partial<{
    displayOrder: number;
    initialScore: number;
    initialCorrectCount: number;
    initialWrongCount: number;
  }>,
  userId: string
);

// ゲームプレイヤーの削除
export const removeCloudGamePlayer = async (
  gameId: string,
  playerId: string,
  userId: string
);

// プレイヤー順序の一括更新
export const updateCloudGamePlayersOrder = async (
  gameId: string,
  playerOrders: { playerId: string; displayOrder: number }[],
  userId: string
);
```

## UI/UX設計

### コンポーネント構成

```
CloudPlayersConfig.tsx
├── CloudPlayerList.tsx (プレイヤー一覧表示)
│   ├── CloudPlayerItem.tsx (個別プレイヤー)
│   └── CloudPlayerDragHandle.tsx (ドラッグハンドル)
├── CloudAddPlayer.tsx (プレイヤー追加)
│   ├── CloudSelectExistingPlayer.tsx (既存選択)
│   └── CloudCreateNewPlayer.tsx (新規作成)
└── CloudPlayerSettings.tsx (個別設定)
```

### 既存コンポーネントとの差分

| 機能             | IndexedDB版   | Cloud版              |
| ---------------- | ------------- | -------------------- |
| データ保存       | Dexie直接操作 | API経由              |
| リアルタイム更新 | useLiveQuery  | useState + useEffect |
| プレイヤー作成   | ローカル作成  | サーバー作成         |
| 認証             | なし          | ユーザーID必須       |

## 実装計画

### ステップ1: API拡張

- `cloud-db.ts`に必要な関数を追加
- `cloud-games.ts`にエンドポイントを追加
- バリデーションスキーマの作成

### ステップ2: 基本UI実装

- CloudPlayersConfigの基本構造
- プレイヤー一覧表示
- 追加・削除機能

### ステップ3: ドラッグ&ドロップ

- @hello-pangea/dndの統合
- 順序変更のAPI連携
- 楽観的更新の実装

### ステップ4: 個別設定

- 各プレイヤーの詳細設定UI
- フォームバリデーション
- リアルタイム保存

## 技術的考慮事項

### パフォーマンス

- 楽観的更新によるレスポンス向上
- デバウンス処理による API呼び出し制限
- エラーハンドリングとロールバック

### セキュリティ

- ユーザー認証の確認
- データアクセス権限チェック
- SQLインジェクション対策

### 互換性

- 既存のゲームロジックとの互換性維持
- 型定義の共通化
- エラーメッセージの統一

## テスト方針

### 単体テスト

- API関数のテスト
- バリデーション処理のテスト
- UI コンポーネントのテスト

### 統合テスト

- プレイヤー追加・削除フローのテスト
- ドラッグ&ドロップ機能のテスト
- エラーケースのテスト

### E2Eテスト

- 完全なプレイヤー設定フローのテスト
- 複数ユーザーでの操作テスト
- パフォーマンステスト
