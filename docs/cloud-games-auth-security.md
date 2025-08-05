# Cloud Games 認証・権限管理設計

## 概要

Cloud Gamesにおける認証・権限管理の詳細設計です。ユーザーデータの分離、アクセス制御、セキュリティの強化を実装します。

## 現在の認証状況

### 既存の実装

- Better Auth による基本認証
- ユーザー登録・ログイン機能
- セッション管理

### 不足している機能

- 詳細な権限管理
- APIエンドポイントの認証強化
- データアクセス制御の徹底
- セッション期限管理

## 認証フロー

### 1. ユーザー認証

```typescript
// 現在の認証フロー
const session = await authClient.getSession();
const user = session?.data?.user;

// 改善後のフロー（エラーハンドリング強化）
const authenticateUser = async (): Promise<User | null> => {
  try {
    const session = await authClient.getSession();

    if (!session?.data?.user) {
      throw new Error("User not authenticated");
    }

    return session.data.user;
  } catch (error) {
    console.error("Authentication failed:", error);
    // ログイン画面にリダイレクト
    router.push("/sign-in");
    return null;
  }
};
```

### 2. API認証

```typescript
// 現在のAPI認証（不十分）
const userId = c.req.header("x-user-id");
if (!userId) {
  return c.json({ error: "Unauthorized" }, 401);
}

// 改善後のAPI認証
const authenticateAPIRequest = async (c: Context) => {
  try {
    // JWT トークンの検証
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);

    return {
      userId: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  } catch (error) {
    return null;
  }
};
```

## 権限管理システム

### ユーザーロール（将来拡張用）

```typescript
type UserRole = "user" | "premium" | "admin";

type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt?: Date;
};
```

### データアクセス制御

```typescript
// リソース所有権の確認
const verifyResourceOwnership = async (
  resourceType: "game" | "player" | "log",
  resourceId: string,
  userId: string
): Promise<boolean> => {
  switch (resourceType) {
    case "game":
      const game = await DBClient.select()
        .from(gameTable)
        .where(and(eq(gameTable.id, resourceId), eq(gameTable.userId, userId)))
        .limit(1);
      return game.length > 0;

    case "player":
      const player = await DBClient.select()
        .from(playerTable)
        .where(
          and(eq(playerTable.id, resourceId), eq(playerTable.userId, userId))
        )
        .limit(1);
      return player.length > 0;

    default:
      return false;
  }
};
```

## セキュリティ強化

### 1. API エンドポイントの保護

```typescript
// 認証ミドルウェア
const authMiddleware = async (c: Context, next: Next) => {
  const user = await authenticateAPIRequest(c);

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // コンテキストにユーザー情報を設定
  c.set("user", user);
  await next();
};

// 使用例
export const getCloudGameHandler = factory.createHandlers(
  authMiddleware,
  async (c) => {
    const user = c.get("user");
    const gameId = c.req.param("gameId");

    // 所有権確認
    const hasAccess = await verifyResourceOwnership(
      "game",
      gameId,
      user.userId
    );
    if (!hasAccess) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const game = await getCloudGame(gameId, user.userId);
    return c.json({ game });
  }
);
```

### 2. レート制限

```typescript
// メモリベースのレート制限（本番では Redis を使用）
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    const key = `rate_limit:${user.userId}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    if (record.count >= maxRequests) {
      return c.json({ error: "Too many requests" }, 429);
    }

    record.count++;
    await next();
  };
};

// 使用例（1分間に60リクエストまで）
export const addCloudGameLogHandler = factory.createHandlers(
  authMiddleware,
  rateLimit(60, 60000)
  // ... handler logic
);
```

### 3. 入力値検証の強化

```typescript
// Zodスキーマによる厳密な検証
const gameCreationSchema = z.object({
  name: z
    .string()
    .min(1, "ゲーム名は必須です")
    .max(100, "ゲーム名は100文字以内で入力してください")
    .regex(/^[^\<\>]*$/, "使用できない文字が含まれています"),
  ruleType: z.enum([
    "normal",
    "nomx",
    "nomx-ad",
    "ny",
    "nomr",
    "nbyn",
    "nupdown",
    "divide",
    "swedish10",
    "backstream",
    "attacksurvival",
    "squarex",
    "z",
    "freezex",
    "endless-chance",
    "variables",
    "aql",
  ]),
  discordWebhookUrl: z.string().url().optional().or(z.literal("")),
});

// SQLインジェクション対策（Drizzle ORMが自動で対応）
// XSS対策（入力値のサニタイズ）
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>'"&]/g, (match) => {
    const htmlEntities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "&": "&amp;",
    };
    return htmlEntities[match] || match;
  });
};
```

## セッション管理

### セッション状態の監視

```typescript
// クライアントサイドでのセッション監視
const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const session = await authClient.getSession();
        const userData = session?.data?.user;

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();

    // 定期的なセッション確認（10分間隔）
    const interval = setInterval(checkAuthState, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { user, isLoading, isAuthenticated };
};
```

### 自動ログアウト

```typescript
// 長時間非アクティブでの自動ログアウト
const useAutoLogout = (timeoutMinutes: number = 60) => {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        async () => {
          await authClient.signOut();
          router.push("/sign-in");
          notifications.show({
            title: "セッション期限切れ",
            message: "長時間操作がなかったため自動的にログアウトしました",
            color: "yellow",
          });
        },
        timeoutMinutes * 60 * 1000
      );
    };

    // マウス・キーボード操作を監視
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const resetTimeoutHandler = () => resetTimeout();

    events.forEach((event) => {
      document.addEventListener(event, resetTimeoutHandler, true);
    });

    resetTimeout(); // 初期タイマー設定

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimeoutHandler, true);
      });
    };
  }, [timeoutMinutes, router]);
};
```

## データ保護

### 個人情報の暗号化

```typescript
// 機密データの暗号化（将来実装）
const encryptSensitiveData = (data: string): string => {
  // 実装例：AES-256-GCM による暗号化
  return encrypt(data, process.env.ENCRYPTION_KEY!);
};

const decryptSensitiveData = (encrypted: string): string => {
  return decrypt(encrypted, process.env.ENCRYPTION_KEY!);
};
```

### ログ・監査

```typescript
// セキュリティイベントのロギング
const logSecurityEvent = async (
  eventType: "login" | "logout" | "unauthorized_access" | "data_access",
  userId: string,
  details?: Record<string, any>
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    eventType,
    userId,
    details,
    userAgent: details?.userAgent,
    ipAddress: details?.ipAddress,
  };

  // データベースまたはログサービスに記録
  console.log("Security Event:", JSON.stringify(logEntry));
};
```

## プライバシー設定

### データ削除・エクスポート

```typescript
// GDPR対応: ユーザーデータの完全削除
export const deleteUserData = async (userId: string) => {
  await DBClient.transaction(async (tx) => {
    // ゲームデータの削除
    await tx.delete(game).where(eq(game.userId, userId));

    // プレイヤーデータの削除
    await tx.delete(player).where(eq(player.userId, userId));

    // ログデータの削除
    await tx.delete(gameLog).where(eq(gameLog.userId, userId));

    // その他の関連データも削除
    // ...
  });
};

// ユーザーデータのエクスポート
export const exportUserData = async (userId: string) => {
  const [games, players, logs] = await Promise.all([
    DBClient.select().from(game).where(eq(game.userId, userId)),
    DBClient.select().from(player).where(eq(player.userId, userId)),
    DBClient.select().from(gameLog).where(eq(gameLog.userId, userId)),
  ]);

  return {
    exportDate: new Date().toISOString(),
    userId,
    data: { games, players, logs },
  };
};
```

## 実装計画

### フェーズ1: 基本セキュリティ強化

- API認証の改善
- 入力値検証の強化
- エラーハンドリングの統一

### フェーズ2: 権限管理システム

- リソース所有権確認
- 認証ミドルウェア実装
- レート制限の導入

### フェーズ3: セッション管理強化

- 自動ログアウト機能
- セッション状態監視
- 異常検知システム

### フェーズ4: プライバシー・コンプライアンス

- データ削除・エクスポート機能
- 監査ログ機能
- 暗号化機能

## セキュリティテスト

### 認証テスト

- 未認証でのアクセステスト
- セッション期限切れテスト
- 権限チェックテスト

### 脆弱性テスト

- SQLインジェクション対策テスト
- XSS対策テスト
- CSRF対策テスト（必要に応じて）

### ペネトレーションテスト

- 不正アクセス試行テスト
- レート制限テスト
- データ漏洩防止テスト
