# Cloud Games 形式設定機能設計

## 概要

Cloud Gamesにおける各ゲーム形式の設定機能の詳細設計です。17種類のゲーム形式それぞれに固有の設定項目を動的に生成・管理します。

## 対応ゲーム形式

### 基本形式

1. **normal** - 基本的なクイズ形式
2. **nomx** - N○Mx形式（勝ち抜け）
3. **nomx-ad** - N○Mx (Attack & Defense)
4. **ny** - NY形式（早押し）

### 特殊形式

5. **nomr** - N○Mr形式（復活あり）
6. **nbyn** - NbyN形式
7. **nupdown** - N Up Down形式
8. **divide** - 継続変動形式
9. **swedish10** - Swedish 10形式
10. **backstream** - バックストリーム
11. **attacksurvival** - アタック&サバイバル
12. **squarex** - スクエアX
13. **z** - Z形式
14. **freezex** - フリーズX
15. **endless-chance** - エンドレスチャンス
16. **variables** - 変動制限式
17. **aql** - AQL（Academic Quiz League）

## データベース設計

### 既存スキーマの活用

既存の`rule.ts`で定義されている各形式専用テーブルを使用:

```typescript
// 各形式のテーブル例
gameNomxSetting: {
  gameId: string (unique reference to game.id),
  winPoint: number (default: 7),
  losePoint: number (default: 3)
}

gameNomxAdSetting: {
  gameId: string,
  winPoint: number (default: 7),
  losePoint: number (default: 3),
  streakOver3: boolean (default: true)
}

gameAqlSetting: {
  gameId: string,
  leftTeam: string,
  rightTeam: string
}
```

### 必要なAPI拡張

```typescript
// 形式設定の取得
export const getCloudGameRuleConfig = async (
  gameId: string,
  ruleType: RuleNames,
  userId: string
);

// 形式設定の更新
export const updateCloudGameRuleConfig = async (
  gameId: string,
  ruleType: RuleNames,
  config: any, // 形式により異なる
  userId: string
);

// 形式設定の初期化
export const initializeCloudGameRuleConfig = async (
  gameId: string,
  ruleType: RuleNames,
  userId: string
);
```

## UI設計

### 動的設定生成

各ゲーム形式に応じて設定UIを動的生成:

```typescript
// 設定項目の型定義
type RuleConfigItem = {
  key: string;
  label: string;
  type: "number" | "boolean" | "text" | "select";
  defaultValue: any;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
  description?: string;
};

// 各形式の設定定義
const ruleConfigs: Record<RuleNames, RuleConfigItem[]> = {
  nomx: [
    {
      key: "winPoint",
      label: "勝ち抜けポイント",
      type: "number",
      defaultValue: 7,
      validation: { min: 1, max: 50, required: true },
      description: "○問正解で勝ち抜け",
    },
    {
      key: "losePoint",
      label: "失格ポイント",
      type: "number",
      defaultValue: 3,
      validation: { min: 1, max: 20, required: true },
      description: "×問誤答で失格",
    },
  ],
  // 他の形式も同様に定義...
};
```

### コンポーネント構成

```
CloudRuleSettings.tsx
├── CloudRuleConfigForm.tsx (動的フォーム生成)
│   ├── CloudNumberInput.tsx (数値入力)
│   ├── CloudBooleanInput.tsx (真偽値入力)
│   ├── CloudTextInput.tsx (テキスト入力)
│   └── CloudSelectInput.tsx (選択入力)
├── CloudRulePreview.tsx (設定プレビュー)
└── CloudRuleValidation.tsx (バリデーション表示)
```

## 実装計画

### ステップ1: 設定定義の作成

- 各形式の設定項目定義
- バリデーションルールの定義
- デフォルト値の設定

### ステップ2: API実装

- 形式別設定の取得・更新API
- バリデーション処理
- エラーハンドリング

### ステップ3: 動的フォーム生成

- 設定項目に応じたUI生成
- リアルタイムバリデーション
- プレビュー機能

### ステップ4: 既存ゲームロジックとの連携

- 設定値の計算ロジックへの反映
- 互換性の確認
- テスト実装

## 形式別設定詳細

### Normal形式

設定項目なし（基本形式）

### Nomx形式

- 勝ち抜けポイント（winPoint）
- 失格ポイント（losePoint）

### Nomx-ad形式

- 勝ち抜けポイント（winPoint）
- 失格ポイント（losePoint）
- 3連答以上での特殊処理（streakOver3）

### AQL形式

- 左チーム名（leftTeam）
- 右チーム名（rightTeam）
- 問題数設定（自動）

### その他の形式

各形式の仕様書（docs/rules/）に基づいて設定項目を定義

## バリデーション戦略

### フロントエンド

- Mantineのフォームバリデーション
- リアルタイム入力チェック
- 視覚的エラー表示

### バックエンド

- Zodスキーマによるバリデーション
- 形式固有のビジネスロジック検証
- データベース制約チェック

### 共通バリデーション

```typescript
const commonValidation = {
  positiveInteger: z.number().int().positive(),
  nonNegativeInteger: z.number().int().min(0),
  requiredString: z.string().min(1),
  optionalString: z.string().optional(),
  boolean: z.boolean(),
};
```

## 技術的考慮事項

### パフォーマンス

- 設定変更の即座反映
- 不要なAPI呼び出しの抑制
- キャッシュ戦略

### 拡張性

- 新しいゲーム形式の追加容易性
- 設定項目の動的追加
- バックワード互換性

### ユーザビリティ

- 直感的な設定UI
- 詳細なヘルプ情報
- 設定の視覚的プレビュー
