# サーバー保存版 ボード表示機能設計

## 概要

サーバー保存版ゲーム機能（`/online/games`）におけるボード表示機能の詳細設計です。ゲームの進行状況をリアルタイムで表示し、プレイヤーの操作（正解・誤答等）を処理する機能を実装します。

**重要**: URLパス（`/online/games`）以外では既存の命名規約をそのまま使用します。コンポーネント名、関数名、型名は既存実装と同じ名前を使用してください。

## 現在の実装状況

現在の`CloudBoard`は基本情報の表示のみ：

```tsx
return (
  <Box className={classes.board}>
    <Text size="xl" fw={700} mb="md">
      {game.name} - クラウドボード
    </Text>
    <Text size="sm" c="dimmed">
      クラウドゲーム用のボード表示機能は実装中です。
    </Text>
    <Text size="sm" mt="md">
      ゲーム形式: {game.ruleType}
    </Text>
    <Text size="sm">プレイヤー数: {players.length}人</Text>
    <Text size="sm">ログ数: {logs.length}件</Text>
  </Box>
);
```

## 機能要件

### 基本表示機能

1. **ゲーム情報表示**: ゲーム名、形式、進行状況
2. **プレイヤー一覧**: 名前、スコア、順位、状態
3. **スコア計算**: リアルタイムでのスコア更新
4. **ゲーム状態**: 勝利判定、失格判定

### 操作機能

1. **プレイヤー操作**: ○×ボタン、スルーボタン
2. **元に戻す/やり直し**: ログ管理による操作取り消し
3. **ゲーム制御**: 開始・終了・リセット
4. **問題管理**: 問題番号の管理

### 表示機能

1. **勝利モーダル**: ゲーム終了時の表示
2. **ゲームログ**: 操作履歴の表示
3. **プレイヤー順位**: リアルタイム順位更新
4. **設定パネル**: 表示設定の調整

## データフロー

### スコア計算フロー

```typescript
// 操作 → ログ追加 → スコア再計算 → UI更新
const handlePlayerAction = async (playerId: string, action: Variants) => {
  // 1. ログをデータベースに追加
  await addGameLog(
    {
      gameId,
      playerId,
      actionType: action,
      questionNumber: currentQuestion,
      isSystemAction: false,
    },
    user.id
  );

  // 2. ログを再取得してスコア計算
  const updatedLogs = await getGameLogs(gameId, user.id);
  const computedScores = computeScore(game, players, updatedLogs);

  // 3. UI状態を更新
  setScores(computedScores);
  setLogs(updatedLogs);

  // 4. 勝利判定
  checkWinCondition(computedScores);
};
```

### 既存のスコア計算ロジックの活用

`src/utils/computeScore/index.ts`を使用：

```typescript
import { computeScore } from "@/utils/computeScore";

// サーバー保存版での使用例
const calculateScores = (game: Game, players: Player[], logs: GameLog[]) => {
  // 既存の型に変換
  const indexedDBGame = convertToIndexedDBFormat(game);
  const indexedDBPlayers = convertToIndexedDBFormat(players);
  const indexedDBLogs = convertToIndexedDBFormat(logs);

  // 既存のスコア計算ロジックを使用
  return computeScore(indexedDBGame, indexedDBPlayers, indexedDBLogs);
};
```

## コンポーネント設計

### 基本構造

```
CloudBoard.tsx → Board.tsx
├── BoardHeader.tsx (ゲーム情報)
├── Players.tsx (プレイヤー一覧)
│   └── Player.tsx (個別プレイヤー)
│       ├── PlayerName.tsx
│       ├── PlayerScore.tsx
│       └── PlayerButtons.tsx
├── ActionButtons.tsx (全体操作)
├── GameLogs.tsx (ログ表示)
├── WinModal.tsx (勝利モーダル)
└── PreferenceDrawer.tsx (設定)
```

### 既存コンポーネントとの関係

| 機能       | IndexedDB版  | サーバー保存版 | 変更点                   |
| ---------- | ------------ | -------------- | ------------------------ |
| データ取得 | useLiveQuery | useState + API | リアルタイム性の実装方法 |
| ログ追加   | 直接DB操作   | API呼び出し    | 非同期処理の追加         |
| スコア計算 | 同期処理     | 非同期処理     | ローディング状態の管理   |
| 認証       | なし         | 必須           | ユーザー確認処理         |

## 形式別対応

### 基本形式（Normal, NY等）

- 標準的なスコア表示
- ○×ボタンのみ

### 特殊形式（AQL）

- チーム戦表示
- 特殊なレイアウト
- 専用コンポーネント（AQL.tsx）

### その他の形式

- 各形式の仕様に応じたUI調整
- 既存の形式別コンポーネントの移植

## 状態管理

### メインステート

```typescript
const [game, setGame] = useState<OnlineGame | null>(null);
const [players, setPlayers] = useState<OnlinePlayer[]>([]);
const [logs, setLogs] = useState<OnlineLog[]>([]);
const [scores, setScores] = useState<ComputedScoreProps[]>([]);
const [currentQuestion, setCurrentQuestion] = useState(1);
const [isGameActive, setIsGameActive] = useState(true);
const [winnerData, setWinnerData] = useState<WinPlayerProps[]>([]);
```

### ローディング状態

```typescript
const [isLoading, setIsLoading] = useState(false);
const [actionInProgress, setActionInProgress] = useState(false);
const [undoInProgress, setUndoInProgress] = useState(false);
```

### UI状態

```typescript
const [showLogs, setShowLogs] = useState(false);
const [showSettings, setShowSettings] = useState(false);
const [winModalOpen, setWinModalOpen] = useState(false);
```

## リアルタイム更新

### ポーリング方式（初期実装）

```typescript
useEffect(() => {
  if (!gameId || !user?.id) return;

  const interval = setInterval(async () => {
    try {
      const [updatedLogs, updatedPlayers] = await Promise.all([
        getGameLogs(gameId, user.id),
        getGamePlayers(gameId, user.id),
      ]);

      if (JSON.stringify(updatedLogs) !== JSON.stringify(logs)) {
        setLogs(updatedLogs);
        // スコア再計算
        const newScores = calculateScores(game, updatedPlayers, updatedLogs);
        setScores(newScores);
      }
    } catch (error) {
      console.error("Failed to update game data:", error);
    }
  }, 2000); // 2秒間隔

  return () => clearInterval(interval);
}, [gameId, user?.id, logs]);
```

## エラーハンドリング

### 操作エラー

```typescript
const handlePlayerAction = async (playerId: string, action: Variants) => {
  setActionInProgress(true);

  try {
    await addOnlineGameLog(
      {
        gameId,
        playerId,
        actionType: action,
        questionNumber: currentQuestion,
      },
      user.id
    );

    // 楽観的更新
    const optimisticLog = {
      id: `temp-${Date.now()}`,
      game_id: gameId,
      player_id: playerId,
      variant: action,
      system: 0,
      timestamp: new Date().toISOString(),
      available: 1,
    };

    setLogs((prev) => [...prev, optimisticLog]);
  } catch (error) {
    // エラー時はロールバック
    notifications.show({
      title: "エラー",
      message: "操作の保存に失敗しました",
      color: "red",
    });

    // 状態をリフレッシュ
    await refreshGameData();
  } finally {
    setActionInProgress(false);
  }
};
```

## 実装計画

### ステップ1: 基本表示機能

- プレイヤー一覧の表示
- スコア計算の統合
- 基本的な状態管理

### ステップ2: 操作機能

- プレイヤーアクションボタン
- ログ追加のAPI連携
- 楽観的更新の実装

### ステップ3: ゲーム制御

- 元に戻す/やり直し機能
- ゲーム終了判定
- 勝利モーダル

### ステップ4: リアルタイム更新

- ポーリング機能の実装
- エラーハンドリング
- オフライン対応

### ステップ5: 形式別対応

- 特殊形式のUI実装
- AQLなどの専用コンポーネント
- 表示設定の実装

## 実装例

### OnlineBoard基本構造

```tsx
"use client";

import { useState, useEffect } from "react";
import { Box, Text, Group, Button, Stack } from "@mantine/core";

import OnlinePlayers from "./_components/OnlinePlayers";
import OnlineActionButtons from "./_components/OnlineActionButtons";
import OnlineGameLogs from "./_components/OnlineGameLogs";

import { computeScore } from "@/utils/computeScore";
import apiClient from "@/utils/hono/client";

type OnlineBoardProps = {
  game_id: string;
  user: User | null;
};

const OnlineBoard: React.FC<OnlineBoardProps> = ({ game_id, user }) => {
  const [game, setGame] = useState<OnlineGame | null>(null);
  const [players, setPlayers] = useState<OnlinePlayer[]>([]);
  const [logs, setLogs] = useState<OnlineLog[]>([]);
  const [scores, setScores] = useState<ComputedScoreProps[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchGameData();
  }, [game_id, user?.id]);

  const fetchGameData = async () => {
    try {
      const [gameResponse, playersResponse, logsResponse] = await Promise.all([
        apiClient["games"][":gameId"].$get(
          { param: { gameId: game_id } },
          { headers: { "x-user-id": user.id } }
        ),
        apiClient["games"][":gameId"]["players"].$get(
          { param: { gameId: game_id } },
          { headers: { "x-user-id": user.id } }
        ),
        apiClient["games"][":gameId"]["logs"].$get(
          { param: { gameId: game_id } },
          { headers: { "x-user-id": user.id } }
        ),
      ]);

      const gameData = await gameResponse.json();
      const playersData = await playersResponse.json();
      const logsData = await logsResponse.json();

      if ("game" in gameData) setGame(gameData.game);
      if ("players" in playersData) setPlayers(playersData.players);
      if ("logs" in logsData) setLogs(logsData.logs);

      // スコア計算
      if (gameData.game && playersData.players && logsData.logs) {
        const computedScores = computeScore(
          gameData.game,
          playersData.players,
          logsData.logs
        );
        setScores(computedScores);
      }
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerAction = async (playerId: string, action: string) => {
    try {
      await apiClient["games"][":gameId"]["logs"].$post(
        {
          param: { gameId: game_id },
          json: {
            playerId,
            actionType: action,
            questionNumber: currentQuestion,
          },
        },
        { headers: { "x-user-id": user.id } }
      );

      // データを再取得
      await fetchGameData();
    } catch (error) {
      console.error("Failed to add game log:", error);
    }
  };

  if (loading || !game) {
    return <Text>読み込み中...</Text>;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="xl" fw={700}>
          {game.name}
        </Text>
        <Text size="sm" c="dimmed">
          問題 {currentQuestion}
        </Text>
      </Group>

      <OnlinePlayers
        players={players}
        scores={scores}
        onPlayerAction={handlePlayerAction}
      />

      <OnlineActionButtons
        onNextQuestion={() => setCurrentQuestion((prev) => prev + 1)}
        onUndo={() => {
          /* 元に戻す処理 */
        }}
      />

      <OnlineGameLogs logs={logs} />
    </Stack>
  );
};

export default OnlineBoard;
```
