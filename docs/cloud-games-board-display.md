# Cloud Games ボード表示機能設計

## 概要

Cloud Gamesにおけるボード表示機能の詳細設計です。ゲームの進行状況をリアルタイムで表示し、プレイヤーの操作（正解・誤答等）を処理する機能を実装します。

## 現在の状況

現在のCloudBoardは基本情報の表示のみ：

- ゲーム名とルール表示
- プレイヤー数とログ数の表示
- 実際のゲーム操作機能は未実装

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
  await addCloudGameLog(
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
  const updatedLogs = await getCloudGameLogs(gameId, user.id);
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

// Cloud版での使用例
const calculateScores = (
  game: CloudGame,
  players: CloudPlayer[],
  logs: CloudLog[]
) => {
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
CloudBoard.tsx
├── CloudBoardHeader.tsx (ゲーム情報)
├── CloudPlayers.tsx (プレイヤー一覧)
│   └── CloudPlayer.tsx (個別プレイヤー)
│       ├── CloudPlayerName.tsx
│       ├── CloudPlayerScore.tsx
│       └── CloudPlayerButtons.tsx
├── CloudActionButtons.tsx (全体操作)
├── CloudGameLogs.tsx (ログ表示)
├── CloudWinModal.tsx (勝利モーダル)
└── CloudPreferenceDrawer.tsx (設定)
```

### 既存コンポーネントとの関係

| 機能       | IndexedDB版  | Cloud版        | 変更点                   |
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
- 専用コンポーネント（CloudAQL.tsx）

### その他の形式

- 各形式の仕様に応じたUI調整
- 既存の形式別コンポーネントの移植

## 状態管理

### メインステート

```typescript
const [game, setGame] = useState<CloudGame | null>(null);
const [players, setPlayers] = useState<CloudPlayer[]>([]);
const [logs, setLogs] = useState<CloudLog[]>([]);
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
        getCloudGameLogs(gameId, user.id),
        getCloudGamePlayers(gameId, user.id),
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

### 将来的な改善（WebSocket）

```typescript
// 将来の実装予定
useEffect(() => {
  const ws = new WebSocket(`ws://localhost:3000/games/${gameId}`);

  ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);

    switch (type) {
      case "GAME_LOG_ADDED":
        setLogs((prev) => [...prev, data]);
        break;
      case "PLAYER_UPDATED":
        updatePlayer(data);
        break;
    }
  };

  return () => ws.close();
}, [gameId]);
```

## エラーハンドリング

### 操作エラー

```typescript
const handlePlayerAction = async (playerId: string, action: Variants) => {
  setActionInProgress(true);

  try {
    await addCloudGameLog(
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

### ネットワークエラー

```typescript
const [isOffline, setIsOffline] = useState(false);

useEffect(() => {
  const handleOnline = () => setIsOffline(false);
  const handleOffline = () => setIsOffline(true);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

// オフライン時の表示
{isOffline && (
  <Alert color="yellow" title="オフライン">
    インターネット接続を確認してください
  </Alert>
)}
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

## パフォーマンス考慮事項

### 最適化戦略

1. **メモ化**: React.memo, useMemo, useCallback
2. **仮想化**: 大量のログ表示時
3. **遅延読み込み**: 重いコンポーネントの動的import
4. **キャッシュ**: API レスポンスのキャッシュ

### 実装例

```typescript
const CloudPlayer = React.memo<PlayerProps>(({ player, score, onAction }) => {
  const handleAction = useCallback((action: Variants) => {
    onAction(player.id, action);
  }, [player.id, onAction]);

  return (
    // プレイヤーコンポーネント
  );
});

const memoizedScores = useMemo(() => {
  return calculateScores(game, players, logs);
}, [game, players, logs]);
```
