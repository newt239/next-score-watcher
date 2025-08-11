# サーバー保存版 データ同期機能設計

## 概要

サーバー保存版ゲーム機能（`/online/games`）におけるデータ同期機能の詳細設計です。リアルタイム同期、オフライン対応、競合解決などの高度な同期機能を実装します。

**重要**: URLパス（`/online/games`）以外では既存の命名規約をそのまま使用します。コンポーネント名、関数名、型名は既存実装と同じ名前を使用してください。

## 現在の実装状況

### ✅ 実装済み機能

- **基本的なオンラインゲーム機能**: ゲーム作成、プレイヤー管理、設定、ボード表示
- **ポーリングベースの同期**: 2秒間隔でのデータ取得（基本動作は確立済み）
- **認証基盤**: Better Authによる基本的な認証・セッション管理
- **データベース設計**: Turso（SQLite）による安定したデータ保存

### ❌ 未実装の機能（改善が必要）

- **WebSocketによるリアルタイム同期**: より効率的な同期方式
- **オフライン対応**: ネットワーク切断時の機能継続
- **競合解決システム**: 同時編集時のデータ整合性保証
- **セキュリティ強化**: レート制限、詳細な認証、監査ログ

## リアルタイム同期

### WebSocket実装

#### サーバーサイド（Hono WebSocket）

```typescript
// src/server/websocket.ts
import { createHonoApp } from "./api/index";
import { upgradeWebSocket } from "hono/cloudflare-workers";

type GameRoom = {
  gameId: string;
  connections: Set<WebSocket>;
  lastActivity: Date;
};

class GameRoomManager {
  private rooms = new Map<string, GameRoom>();

  joinRoom(gameId: string, ws: WebSocket, userId: string) {
    if (!this.rooms.has(gameId)) {
      this.rooms.set(gameId, {
        gameId,
        connections: new Set(),
        lastActivity: new Date(),
      });
    }

    const room = this.rooms.get(gameId)!;
    room.connections.add(ws);
    room.lastActivity = new Date();

    // 接続通知
    this.broadcast(gameId, {
      type: "USER_JOINED",
      userId,
      timestamp: new Date().toISOString(),
    });

    // 接続解除処理
    ws.addEventListener("close", () => {
      room.connections.delete(ws);
      if (room.connections.size === 0) {
        // 最後のユーザーが退出後、一定時間でルーム削除
        setTimeout(() => {
          if (room.connections.size === 0) {
            this.rooms.delete(gameId);
          }
        }, 30000); // 30秒後
      }
    });
  }

  broadcast(gameId: string, data: any, excludeWs?: WebSocket) {
    const room = this.rooms.get(gameId);
    if (!room) return;

    const message = JSON.stringify(data);
    for (const ws of room.connections) {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    }
  }

  getRoomSize(gameId: string): number {
    return this.rooms.get(gameId)?.connections.size || 0;
  }
}

const roomManager = new GameRoomManager();

// WebSocketエンドポイント
export const websocketHandler = upgradeWebSocket((c) => {
  const gameId = c.req.param("gameId");
  const userId = c.req.header("x-user-id");

  if (!gameId || !userId) {
    return new Response("Bad Request", { status: 400 });
  }

  return {
    onOpen: (evt, ws) => {
      roomManager.joinRoom(gameId, ws, userId);
    },

    onMessage: async (evt, ws) => {
      const data = JSON.parse(evt.data as string);

      switch (data.type) {
        case "GAME_ACTION":
          // ゲーム操作の処理
          await handleGameAction(data, gameId, userId);

          // 他のクライアントに通知
          roomManager.broadcast(
            gameId,
            {
              type: "GAME_STATE_UPDATED",
              action: data,
              timestamp: new Date().toISOString(),
            },
            ws
          );
          break;

        case "PING":
          ws.send(JSON.stringify({ type: "PONG" }));
          break;
      }
    },

    onClose: () => {
      // 接続解除処理はjoinRoom内で処理済み
    },
  };
});

const handleGameAction = async (data: any, gameId: string, userId: string) => {
  try {
    // データベースに操作を保存
    await addOnlineGameLog(
      {
        gameId,
        playerId: data.playerId,
        actionType: data.actionType,
        questionNumber: data.questionNumber,
        isSystemAction: false,
      },
      userId
    );
  } catch (error) {
    console.error("Failed to save game action:", error);
  }
};
```

#### クライアントサイド実装

```typescript
// src/hooks/useOnlineGameSync.ts
interface GameSyncConfig {
  gameId: string;
  userId: string;
  onGameStateUpdate: (data: any) => void;
  onUserJoined: (userId: string) => void;
  onError: (error: Error) => void;
}

export const useOnlineGameSync = ({
  gameId,
  userId,
  onGameStateUpdate,
  onUserJoined,
  onError,
}: GameSyncConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/games/${gameId}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");

      // 認証情報を送信
      ws.send(
        JSON.stringify({
          type: "AUTH",
          userId,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "GAME_STATE_UPDATED":
            onGameStateUpdate(data);
            break;
          case "USER_JOINED":
            onUserJoined(data.userId);
            setActiveUsers((prev) => [
              ...prev.filter((id) => id !== data.userId),
              data.userId,
            ]);
            break;
          case "PONG":
            // Keep-alive response
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setActiveUsers([]);

      // 自動再接続（指数バックオフ）
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    };

    ws.onerror = (error) => {
      onError(new Error("WebSocket connection failed"));
    };
  }, [gameId, userId, onGameStateUpdate, onUserJoined, onError]);

  const sendGameAction = useCallback((action: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "GAME_ACTION",
          ...action,
        })
      );
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    // Keep-alive ping
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "PING" }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    activeUsers,
    sendGameAction,
    disconnect,
  };
};
```

## オフライン対応

### Service Worker実装

```typescript
// public/sw.js
const CACHE_NAME = "score-watcher-v1";
const OFFLINE_CACHE = "offline-v1";

// オフライン時のフォールバック
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/online/games")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 成功時はレスポンスをキャッシュ
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(OFFLINE_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから取得
          return caches.match(event.request);
        })
    );
  }
});
```

### オフライン操作のキューイング

```typescript
// src/utils/offline-queue.ts
interface QueuedAction {
  id: string;
  gameId: string;
  action: any;
  timestamp: Date;
  retries: number;
}

class OfflineActionQueue {
  private queue: QueuedAction[] = [];
  private isProcessing = false;

  addAction(gameId: string, action: any) {
    const queuedAction: QueuedAction = {
      id: `${Date.now()}-${Math.random()}`,
      gameId,
      action,
      timestamp: new Date(),
      retries: 0,
    };

    this.queue.push(queuedAction);
    this.saveToStorage();

    // オンライン復帰時に処理
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const action = this.queue[0];

      try {
        await this.executeAction(action);
        this.queue.shift(); // 成功時は削除
      } catch (error) {
        action.retries++;

        if (action.retries >= 3) {
          // 3回失敗で諦める
          this.queue.shift();
          console.error("Failed to sync action after 3 retries:", action);
        } else {
          // 指数バックオフで再試行
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, action.retries))
          );
        }
        break; // エラー時は一時停止
      }
    }

    this.saveToStorage();
    this.isProcessing = false;
  }

  private async executeAction(queuedAction: QueuedAction) {
    const response = await fetch(
      `/api/online/games/${queuedAction.gameId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": getCurrentUserId(),
        },
        body: JSON.stringify(queuedAction.action),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  private saveToStorage() {
    localStorage.setItem("offline-queue", JSON.stringify(this.queue));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem("offline-queue");
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }

  init() {
    this.loadFromStorage();

    // オンライン復帰時の処理
    window.addEventListener("online", () => {
      this.processQueue();
    });
  }
}

export const offlineQueue = new OfflineActionQueue();
```

## 競合解決

### 楽観的同時実行制御

```typescript
// src/utils/conflict-resolution.ts
interface ConflictResolutionStrategy {
  resolveConflict(
    localChanges: any[],
    remoteChanges: any[],
    lastSyncTimestamp: Date
  ): Promise<any[]>;
}

class LastWriterWinsStrategy implements ConflictResolutionStrategy {
  async resolveConflict(
    localChanges: any[],
    remoteChanges: any[],
    lastSyncTimestamp: Date
  ) {
    // タイムスタンプベースの解決
    const allChanges = [...localChanges, ...remoteChanges];

    // 同じリソースに対する変更をグループ化
    const grouped = allChanges.reduce(
      (acc, change) => {
        const key = `${change.playerId}-${change.questionNumber}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(change);
        return acc;
      },
      {} as Record<string, any[]>
    );

    // 各グループで最新のものを選択
    const resolved = Object.values(grouped).map((changes) => {
      return changes.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
    });

    return resolved;
  }
}

class OperationalTransformStrategy implements ConflictResolutionStrategy {
  async resolveConflict(
    localChanges: any[],
    remoteChanges: any[],
    lastSyncTimestamp: Date
  ) {
    // より高度なOperational Transform
    // ゲーム操作の意図を保持しながら変更を統合

    const transformedLocal = localChanges.map((change) =>
      this.transformAgainstRemote(change, remoteChanges)
    );

    return [...remoteChanges, ...transformedLocal];
  }

  private transformAgainstRemote(localChange: any, remoteChanges: any[]) {
    // 例: スコア加算の競合解決
    for (const remoteChange of remoteChanges) {
      if (localChange.playerId === remoteChange.playerId) {
        // 同じプレイヤーへの操作は順序を調整
        if (localChange.timestamp < remoteChange.timestamp) {
          // ローカル操作が先の場合、リモート操作を考慮して調整
          localChange = this.adjustForPrecedingChange(
            localChange,
            remoteChange
          );
        }
      }
    }
    return localChange;
  }

  private adjustForPrecedingChange(localChange: any, precedingChange: any) {
    // 具体的な変換ロジック
    // ゲーム固有のルールに基づいて調整
    return localChange;
  }
}
```

### 同期状態の管理

```typescript
// src/hooks/useConflictResolution.ts
export const useConflictResolution = (gameId: string) => {
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "syncing" | "conflict"
  >("synced");
  const [conflictData, setConflictData] = useState<any>(null);

  const resolveConflict = async (
    strategy: "last-writer" | "operational-transform"
  ) => {
    setSyncStatus("syncing");

    try {
      const resolver =
        strategy === "last-writer"
          ? new LastWriterWinsStrategy()
          : new OperationalTransformStrategy();

      const resolved = await resolver.resolveConflict(
        conflictData.localChanges,
        conflictData.remoteChanges,
        conflictData.lastSyncTimestamp
      );

      // 解決済みデータをサーバーに送信
      await syncResolvedChanges(gameId, resolved);

      setSyncStatus("synced");
      setConflictData(null);
    } catch (error) {
      console.error("Conflict resolution failed:", error);
      setSyncStatus("conflict");
    }
  };

  return {
    syncStatus,
    conflictData,
    resolveConflict,
  };
};
```

## データ整合性保証

### トランザクション管理

```typescript
// src/server/repositories/ の拡張
export const executeGameTransaction = async (
  gameId: string,
  userId: string,
  operations: Array<() => Promise<void>>
) => {
  return await DBClient.transaction(async (tx) => {
    // 操作前のゲーム状態を記録
    const gameSnapshot = await getOnlineGame(gameId, userId);

    try {
      // すべての操作を実行
      for (const operation of operations) {
        await operation();
      }

      // 整合性チェック
      await validateGameState(gameId, userId);
    } catch (error) {
      // エラー時はロールバック
      console.error("Transaction failed, rolling back:", error);
      throw error;
    }
  });
};

const validateGameState = async (gameId: string, userId: string) => {
  const [game, players, logs] = await Promise.all([
    getOnlineGame(gameId, userId),
    getOnlineGamePlayers(gameId, userId),
    getOnlineGameLogs(gameId, userId),
  ]);

  // ゲーム状態の整合性チェック
  const computedScores = computeScore(game, players, logs);

  // 不正な状態の検出
  for (const score of computedScores) {
    if (score.score < 0 && !game.ruleType.includes("backstream")) {
      throw new Error(`Invalid negative score for player ${score.playerId}`);
    }
  }
};
```

## 実装計画

### フェーズ1: WebSocket基盤構築

- WebSocketサーバーの実装
- ルーム管理システム
- 基本的な接続・切断処理

### フェーズ2: リアルタイム同期

- ゲーム操作のリアルタイム配信
- 状態同期の実装
- 接続状態の監視

### フェーズ3: オフライン対応

- Service Workerの実装
- オフライン操作のキューイング
- 復帰時の同期処理

### フェーズ4: 競合解決

- 基本的な競合検出
- Last Writer Wins戦略の実装
- UI上での競合表示

### フェーズ5: 高度な競合解決

- Operational Transform実装
- ゲーム固有の変換ルール
- ユーザー選択による解決

## パフォーマンス最適化

### 差分同期

```typescript
// 変更差分のみを送信
const generateDelta = (oldState: any, newState: any) => {
  return {
    type: "DELTA",
    changes: Object.keys(newState).reduce((changes, key) => {
      if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
        changes[key] = newState[key];
      }
      return changes;
    }, {} as any),
  };
};
```

### 圧縮とバッチング

```typescript
// 操作のバッチ化
class ActionBatcher {
  private batch: any[] = [];
  private timeout?: NodeJS.Timeout;

  addAction(action: any) {
    this.batch.push(action);

    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.flushBatch();
    }, 100); // 100ms でバッチ送信
  }

  private flushBatch() {
    if (this.batch.length === 0) return;

    sendBatchedActions(this.batch);
    this.batch = [];
  }
}
```

## セキュリティ考慮事項

### WebSocket認証

- JWTトークンによる認証
- ルーム単位のアクセス制御
- レート制限の実装

### データ検証

- クライアント操作の全サーバーサイド検証
- 不正操作の検出と拒否
- 監査ログの記録

## テスト戦略

### 単体テスト

- 同期ロジックのテスト
- 競合解決アルゴリズムのテスト
- オフラインキューのテスト

### 統合テスト

- WebSocket接続のテスト
- マルチクライアント同期のテスト
- 障害復旧のテスト

### 負荷テスト

- 大量接続時のパフォーマンス
- メモリリークの検証
- ネットワーク分断テスト
