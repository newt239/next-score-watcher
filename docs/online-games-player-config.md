# サーバー保存版 プレイヤー設定機能設計

## 概要

サーバー保存版ゲーム機能（`/online/games`）におけるプレイヤー設定機能の詳細設計です。既存のIndexedDB版の機能をSQLiteベースに移行し、クラウド対応を行います。

**重要**: URLパス（`/online/games`）以外では既存の命名規約をそのまま使用します。コンポーネント名、関数名、型名は既存実装と同じ名前を使用してください。

## 現在の実装状況

現在の`CloudPlayersConfig`はプレースホルダーのみ：

```tsx
const CloudPlayersConfig: React.FC = () => {
  return (
    <div>
      <Text>プレイヤー設定（クラウド版）</Text>
      <Text size="sm" c="dimmed">
        クラウドゲーム用のプレイヤー設定機能は実装中です。
      </Text>
    </div>
  );
};
```

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

`src/server/repositories/games.ts`に以下の関数を追加:

```typescript
// ゲームプレイヤーの更新
export const updateGamePlayer = async (
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
export const removeGamePlayer = async (
  gameId: string,
  playerId: string,
  userId: string
);

// プレイヤー順序の一括更新
export const updateGamePlayersOrder = async (
  gameId: string,
  playerOrders: { playerId: string; displayOrder: number }[],
  userId: string
);
```

## UI/UX設計

### コンポーネント構成

```
CloudPlayersConfig.tsx → PlayersConfig.tsx
├── PlayerList.tsx (プレイヤー一覧表示)
│   ├── PlayerItem.tsx (個別プレイヤー)
│   └── PlayerDragHandle.tsx (ドラッグハンドル)
├── AddPlayer.tsx (プレイヤー追加)
│   ├── SelectExistingPlayer.tsx (既存選択)
│   └── CreateNewPlayer.tsx (新規作成)
└── PlayerSettings.tsx (個別設定)
```

### 既存コンポーネントとの差分

| 機能             | IndexedDB版   | サーバー保存版 | 変更点                    |
| ---------------- | ------------- | -------------- | ------------------------- |
| データ保存       | Dexie直接操作 | API経由        | 非同期処理の追加          |
| リアルタイム更新 | useLiveQuery  | useState + API | ポーリングまたはWebSocket |
| プレイヤー作成   | ローカル作成  | サーバー作成   | 認証とバリデーション      |
| 認証             | なし          | ユーザーID必須 | セキュリティ強化          |

## 実装計画

### ステップ1: API拡張

- `src/server/repositories/games.ts`に必要な関数を追加
- `src/server/controllers/game/`にエンドポイントを追加
- バリデーションスキーマの作成

### ステップ2: 基本UI実装

- PlayersConfigの基本構造
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

## 実装例

### PlayersConfig基本構造

```tsx
"use client";

import { useState, useEffect } from "react";
import { Button, Group, Text, Stack } from "@mantine/core";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import PlayerItem from "./PlayerItem";
import AddPlayer from "./AddPlayer";

type PlayersConfigProps = {
  gameId: string;
  userId: string;
};

const PlayersConfig: React.FC<PlayersConfigProps> = ({ gameId, userId }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamePlayers();
  }, [gameId]);

  const fetchGamePlayers = async () => {
    // APIからプレイヤー取得
  };

  const handlePlayerAdd = async (playerId: string) => {
    // プレイヤー追加処理
  };

  const handlePlayerRemove = async (playerId: string) => {
    // プレイヤー削除処理
  };

  const handleDragEnd = async (result: any) => {
    // ドラッグ&ドロップ処理
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="lg" fw={600}>
          プレイヤー設定
        </Text>
        <AddPlayer onAdd={handlePlayerAdd} />
      </Group>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="players">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {players.map((player, index) => (
                <Draggable
                  key={player.id}
                  draggableId={player.id}
                  index={index}
                >
                  {(provided) => (
                    <PlayerItem
                      player={player}
                      onRemove={handlePlayerRemove}
                      dragHandleProps={provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
};

export default PlayersConfig;
```
