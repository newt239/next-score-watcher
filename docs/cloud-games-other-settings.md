# Cloud Games その他設定機能設計

## 概要

Cloud Gamesにおけるその他設定機能の詳細設計です。ゲーム名変更、Discord Webhook、ゲームコピー・削除、データエクスポートなどの管理機能を実装します。

## 機能一覧

### 1. ゲーム名変更機能

**目的**: 作成後のゲーム名を変更可能にする  
**実装内容**:

- インライン編集UI
- リアルタイム保存
- バリデーション（文字数制限等）

### 2. Discord Webhook設定

**目的**: ゲーム結果をDiscordに通知  
**実装内容**:

- Webhook URL入力フィールド
- テスト送信機能
- 設定の保存・削除

### 3. ゲームコピー機能

**目的**: 既存ゲームを複製して新しいゲームを作成  
**実装内容**:

- 設定のコピー（プレイヤー、ルール設定等）
- ログは除外（新しいゲームとして開始）
- 名前の自動生成（"○○のコピー"）

### 4. ゲーム削除機能

**目的**: 不要なゲームを削除  
**実装内容**:

- 確認ダイアログ
- 論理削除（deleted_at設定）
- 関連データの整合性保持

### 5. データエクスポート機能

**目的**: ゲームデータの外部出力  
**実装内容**:

- JSON形式でのエクスポート
- CSV形式でのスコア履歴エクスポート
- ゲーム設定のバックアップ

### 6. ゲーム統計表示

**目的**: ゲームの進行状況や統計を表示  
**実装内容**:

- 問題数、プレイ時間
- プレイヤー別統計
- ゲーム履歴

## UI設計

### レイアウト構成

```tsx
CloudOtherConfig.tsx
├── CloudGameNameEditor.tsx (ゲーム名編集)
├── CloudDiscordWebhook.tsx (Webhook設定)
├── CloudGameActions.tsx (アクション群)
│   ├── CloudCopyGame.tsx (コピー)
│   ├── CloudDeleteGame.tsx (削除)
│   └── CloudExportGame.tsx (エクスポート)
└── CloudGameStats.tsx (統計情報)
```

### セクション分割

```tsx
<Stack gap="lg">
  {/* 基本設定 */}
  <Card withBorder>
    <Card.Section>
      <Title order={4}>基本設定</Title>
    </Card.Section>
    <CloudGameNameEditor />
  </Card>

  {/* 外部連携 */}
  <Card withBorder>
    <Card.Section>
      <Title order={4}>外部連携</Title>
    </Card.Section>
    <CloudDiscordWebhook />
  </Card>

  {/* ゲーム管理 */}
  <Card withBorder>
    <Card.Section>
      <Title order={4}>ゲーム管理</Title>
    </Card.Section>
    <CloudGameActions />
  </Card>

  {/* 統計情報 */}
  <Card withBorder>
    <Card.Section>
      <Title order={4}>統計情報</Title>
    </Card.Section>
    <CloudGameStats />
  </Card>
</Stack>
```

## API設計

### 既存APIの拡張

`cloud-db.ts`に以下の関数を追加:

```typescript
// ゲーム名更新（既存のupdateCloudGameを使用）
export const updateCloudGameName = async (
  gameId: string,
  name: string,
  userId: string
) => {
  await updateCloudGame(gameId, { name }, userId);
};

// Discord Webhook URL更新
export const updateCloudGameWebhook = async (
  gameId: string,
  webhookUrl: string,
  userId: string
) => {
  await updateCloudGame(gameId, { discordWebhookUrl: webhookUrl }, userId);
};

// ゲームコピー
export const copyCloudGame = async (
  sourceGameId: string,
  newGameName: string,
  userId: string
) => {
  // 1. 元ゲームの情報を取得
  const sourceGame = await getCloudGame(sourceGameId, userId);
  const sourcePlayers = await getCloudGamePlayers(sourceGameId, userId);

  // 2. 新しいゲームを作成
  const newGameId = await createCloudGame(
    {
      name: newGameName,
      ruleType: sourceGame.ruleType,
      discordWebhookUrl: sourceGame.discordWebhookUrl,
    },
    userId
  );

  // 3. プレイヤーをコピー
  for (const player of sourcePlayers) {
    await addCloudGamePlayer(
      newGameId,
      {
        playerId: player.id,
        displayOrder: player.display_order,
        initialScore: player.initial_score,
        initialCorrectCount: player.initial_correct,
        initialWrongCount: player.initial_wrong,
      },
      userId
    );
  }

  // 4. ルール設定もコピー（形式に応じて）
  await copyGameRuleSettings(
    sourceGameId,
    newGameId,
    sourceGame.ruleType,
    userId
  );

  return newGameId;
};

// ゲーム削除（論理削除）
export const deleteCloudGameSoft = async (gameId: string, userId: string) => {
  await DBClient.update(game)
    .set({ deletedAt: new Date() })
    .where(and(eq(game.id, gameId), eq(game.userId, userId)));
};

// ゲームデータエクスポート
export const exportCloudGameData = async (gameId: string, userId: string) => {
  const [gameData, players, logs] = await Promise.all([
    getCloudGame(gameId, userId),
    getCloudGamePlayers(gameId, userId),
    getCloudGameLogs(gameId, userId),
  ]);

  return {
    game: gameData,
    players,
    logs,
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };
};
```

### 新しいAPIエンドポイント

`cloud-games.ts`に追加:

```typescript
// ゲームコピー
export const copyCloudGameHandler = factory.createHandlers(
  zValidator(
    "json",
    z.object({
      sourceGameId: z.string(),
      newGameName: z.string().min(1),
    })
  ),
  async (c) => {
    const userId = c.req.header("x-user-id");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const { sourceGameId, newGameName } = c.req.valid("json");

    try {
      const newGameId = await copyCloudGame(sourceGameId, newGameName, userId);
      return c.json({ gameId: newGameId }, 201);
    } catch (error) {
      return c.json({ error: "Failed to copy game" }, 500);
    }
  }
);

// データエクスポート
export const exportCloudGameHandler = factory.createHandlers(async (c) => {
  const gameId = c.req.param("gameId");
  const userId = c.req.header("x-user-id");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  if (!gameId) return c.json({ error: "Game ID required" }, 400);

  try {
    const exportData = await exportCloudGameData(gameId, userId);

    return c.json(exportData, 200, {
      "Content-Disposition": `attachment; filename="game-${gameId}.json"`,
    });
  } catch (error) {
    return c.json({ error: "Failed to export game" }, 500);
  }
});
```

## 個別機能の実装詳細

### 1. ゲーム名変更

```tsx
const CloudGameNameEditor: React.FC<{ game: CloudGame }> = ({ game }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(game.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (name.trim() === game.name) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateCloudGameName(game.id, name.trim(), user.id);
      notifications.show({
        title: "保存完了",
        message: "ゲーム名を更新しました",
        color: "green",
      });
      setIsEditing(false);
    } catch (error) {
      notifications.show({
        title: "エラー",
        message: "ゲーム名の更新に失敗しました",
        color: "red",
      });
      setName(game.name); // 元に戻す
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Group gap="xs">
      {isEditing ? (
        <>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setName(game.name);
                setIsEditing(false);
              }
            }}
            maxLength={100}
            autoFocus
          />
          <ActionIcon onClick={handleSave} loading={isLoading}>
            <IconCheck />
          </ActionIcon>
          <ActionIcon onClick={() => setIsEditing(false)}>
            <IconX />
          </ActionIcon>
        </>
      ) : (
        <>
          <Text>{game.name}</Text>
          <ActionIcon onClick={() => setIsEditing(true)}>
            <IconEdit />
          </ActionIcon>
        </>
      )}
    </Group>
  );
};
```

### 2. Discord Webhook設定

```tsx
const CloudDiscordWebhook: React.FC<{ game: CloudGame }> = ({ game }) => {
  const form = useForm({
    initialValues: {
      webhookUrl: game.discordWebhookUrl || "",
    },
    validate: {
      webhookUrl: (value) => {
        if (!value) return null;
        try {
          new URL(value);
          return value.includes("discord.com/api/webhooks")
            ? null
            : "Discord Webhook URLを入力してください";
        } catch {
          return "正しいURLを入力してください";
        }
      },
    },
  });

  const handleSave = async (values: typeof form.values) => {
    try {
      await updateCloudGameWebhook(game.id, values.webhookUrl, user.id);
      notifications.show({
        title: "保存完了",
        message: "Webhook設定を更新しました",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "エラー",
        message: "Webhook設定の更新に失敗しました",
        color: "red",
      });
    }
  };

  const testWebhook = async () => {
    // テスト送信の実装
  };

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <Stack gap="sm">
        <TextInput
          label="Discord Webhook URL"
          placeholder="https://discord.com/api/webhooks/..."
          {...form.getInputProps("webhookUrl")}
        />
        <Group gap="sm">
          <Button type="submit">保存</Button>
          <Button
            variant="outline"
            onClick={testWebhook}
            disabled={!form.values.webhookUrl || !!form.errors.webhookUrl}
          >
            テスト送信
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
```

### 3. ゲームコピー機能

```tsx
const CloudCopyGame: React.FC<{ game: CloudGame }> = ({ game }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCopy = async (newName: string) => {
    setIsLoading(true);
    try {
      const newGameId = await copyCloudGame(game.id, newName, user.id);
      notifications.show({
        title: "コピー完了",
        message: "新しいゲームを作成しました",
        color: "green",
      });
      setModalOpen(false);
      router.push(`/cloud-games/${newGameId}/config`);
    } catch (error) {
      notifications.show({
        title: "エラー",
        message: "ゲームのコピーに失敗しました",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button leftSection={<IconCopy />} onClick={() => setModalOpen(true)}>
        ゲームをコピー
      </Button>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <CopyGameForm
          defaultName={`${game.name}のコピー`}
          onSubmit={handleCopy}
          loading={isLoading}
        />
      </Modal>
    </>
  );
};
```

## 実装計画

### ステップ1: 基本設定機能

- ゲーム名編集UI
- インライン編集の実装
- API連携

### ステップ2: 外部連携機能

- Discord Webhook設定
- テスト送信機能
- バリデーション

### ステップ3: ゲーム管理機能

- コピー機能のAPI実装
- 削除機能（論理削除）
- 確認ダイアログ

### ステップ4: データエクスポート

- JSON/CSVエクスポート
- ダウンロード機能
- データ形式の標準化

### ステップ5: 統計情報表示

- ゲーム統計の計算
- 可視化コンポーネント
- パフォーマンス最適化

## セキュリティ考慮事項

### データ保護

- ユーザー権限の確認
- データアクセス制限
- 論理削除による復旧可能性

### Webhook セキュリティ

- URL検証
- レート制限
- エラーハンドリング

### エクスポートデータ

- 機密情報の除外
- データサイズ制限
- 不正アクセス防止
