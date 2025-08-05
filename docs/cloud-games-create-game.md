# Cloud Games ゲーム作成機能設計

## 概要

Cloud Gamesにおけるゲーム作成機能の詳細設計です。ユーザーが新しいクラウドゲームを作成できる機能を実装します。

## 現在の問題

現在の実装では以下が不足しています：

1. **ゲーム作成UI**: 完全に未実装
2. **ゲーム形式選択**: ルール一覧から選択する機能がない
3. **Cloud専用の作成フロー**: 既存のIndexedDB版を参考にCloud版を作成する必要

## 機能要件

### 基本機能

1. **ゲーム形式選択**: 17種類の形式から選択
2. **ゲーム名入力**: 任意のゲーム名を設定
3. **ゲーム作成**: APIを通じてデータベースに保存
4. **自動リダイレクト**: 作成後、設定画面に遷移
5. **エラーハンドリング**: 作成失敗時の適切な処理

### 対応ゲーム形式

既存の17形式すべてに対応：

- normal, nomx, nomx-ad, ny, nomr, nbyn, nupdown
- divide, swedish10, backstream, attacksurvival
- squarex, z, freezex, endless-chance, variables, aql

## UI設計

### アクセス方法の追加

現在の`CloudGameList`にゲーム作成ボタンを追加：

```tsx
// CloudGameList.tsx の修正
<Group justify="space-between" mb="lg">
  <Title order={2}>クラウドゲーム</Title>
  <Button leftSection={<IconPlus />} onClick={() => setCreateModalOpen(true)}>
    新しいゲームを作成
  </Button>
</Group>
```

### モーダル vs 専用ページ

**選択**: モーダル形式を採用

- 理由: 軽量で直感的、既存のフローを妨げない
- IndexedDB版は専用ページ（/rules）だが、Cloud版はより統合されたUX

### コンポーネント構成

```
CloudGameList.tsx
└── CloudCreateGameModal.tsx (新規)
    ├── CloudGameNameInput.tsx
    ├── CloudRuleSelector.tsx
    └── CloudCreateGameForm.tsx
```

## データフロー

### 作成フロー

1. **モーダル開く**: 「新しいゲームを作成」ボタンクリック
2. **形式選択**: グリッド形式で17形式を表示
3. **ゲーム名入力**: デフォルト名生成 + カスタマイズ可能
4. **作成実行**: API呼び出し
5. **リダイレクト**: `/cloud-games/{game_id}/config`に遷移

### API連携

既存の`createCloudGame`APIを使用：

```typescript
// API呼び出し例
const gameId = await createCloudGame(
  {
    name: gameName,
    ruleType: selectedRule,
    discordWebhookUrl: "",
  },
  user.id
);

// 成功時のリダイレクト
router.push(`/cloud-games/${gameId}/config`);
```

## 実装詳細

### ゲーム名の自動生成

```typescript
const generateDefaultGameName = (ruleType: RuleNames): string => {
  const ruleName = rules[ruleType].name;
  const timestamp = new Date().toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${ruleName} ${timestamp}`;
};
```

### ルール選択UI

既存の`RuleList`を参考にしたカード形式：

```tsx
<Grid>
  {ruleNameList.map((ruleName) => (
    <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={ruleName}>
      <Card
        shadow="xs"
        withBorder
        className={selectedRule === ruleName ? classes.selected : ""}
        onClick={() => setSelectedRule(ruleName)}
      >
        <Card.Section>{rules[ruleName].name}</Card.Section>
        <Text size="sm" c="dimmed">
          {rules[ruleName].short_description}
        </Text>
      </Card>
    </Grid.Col>
  ))}
</Grid>
```

### フォームバリデーション

```typescript
const form = useForm({
  initialValues: {
    name: "",
    ruleType: null as RuleNames | null,
  },
  validate: {
    name: (value) =>
      value.length < 1
        ? "ゲーム名を入力してください"
        : value.length > 100
          ? "ゲーム名は100文字以内で入力してください"
          : null,
    ruleType: (value) =>
      value === null ? "ゲーム形式を選択してください" : null,
  },
});
```

## 状態管理

### モーダル状態

```tsx
const [createModalOpen, setCreateModalOpen] = useState(false);
const [isCreating, setIsCreating] = useState(false);
const [selectedRule, setSelectedRule] = useState<RuleNames | null>(null);
const [gameName, setGameName] = useState("");
```

### ローディング状態

```tsx
const handleCreateGame = async () => {
  setIsCreating(true);
  try {
    const gameId = await createCloudGame(
      {
        name: gameName,
        ruleType: selectedRule!,
      },
      user.id
    );

    setCreateModalOpen(false);
    router.push(`/cloud-games/${gameId}/config`);
  } catch (error) {
    notifications.show({
      title: "エラー",
      message: "ゲームの作成に失敗しました",
      color: "red",
    });
  } finally {
    setIsCreating(false);
  }
};
```

## エラーハンドリング

### クライアントサイド

- フォームバリデーションエラー
- ネットワークエラー
- 認証エラー

### サーバーサイド

- データベースエラー
- バリデーションエラー
- 権限エラー

### 通知システム

Mantineの`notifications`を使用：

```tsx
import { notifications } from "@mantine/notifications";

// 成功時
notifications.show({
  title: "成功",
  message: "ゲームを作成しました",
  color: "green",
});

// エラー時
notifications.show({
  title: "エラー",
  message: error.message || "ゲームの作成に失敗しました",
  color: "red",
});
```

## 実装計画

### ステップ1: モーダルの基本構造

- CloudCreateGameModalコンポーネント作成
- 基本的なモーダル表示・非表示機能
- CloudGameListからの呼び出し

### ステップ2: ルール選択UI

- ルール一覧の表示
- 選択状態の管理
- 既存のrules定義の活用

### ステップ3: フォーム機能

- ゲーム名入力
- バリデーション
- 送信処理

### ステップ4: API連携とエラーハンドリング

- 既存APIとの連携
- エラー表示
- ローディング状態

### ステップ5: UX改善

- 自動生成機能
- プレビュー機能
- アクセシビリティ対応

## テスト方針

### 単体テスト

- コンポーネントのレンダリング
- フォームバリデーション
- 状態管理

### 統合テスト

- API連携テスト
- エラーケースのテスト
- リダイレクト処理のテスト

### E2Eテスト

- 完全なゲーム作成フローのテスト
- 複数ブラウザでの動作確認
- パフォーマンステスト
