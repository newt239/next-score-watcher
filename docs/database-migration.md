# データベース移行計画

## 現在のスキーマの問題点

### 1. ゲームテーブル (`games`) の問題

- **汎用性の欠如**: すべてのゲーム形式に対して同じテーブルを使用しているため、特定の形式でのみ使用されるフィールドが多数存在
- **optionsフィールドの型安全性の欠如**: JSON形式で保存されており、TypeScriptの型チェックが不十分
- **目的不一致のフィールド使用**: `correct_me`, `wrong_me`, `correct_other`, `wrong_other`などが本来の目的と異なる用途で使用されている
- **冗長なフィールド**: `win_point`, `lose_point`, `win_through`, `limit`など、ゲーム形式によっては不要なフィールドが常に存在

### 2. プレイヤーテーブル (`players`) の問題

- **ゲーム固有データとマスターデータの混在**: ゲーム固有の初期値（`initial_correct`, `initial_wrong`等）がプレイヤーマスターに含まれている
- **型安全性の問題**: `tags`がstring配列として保存されているが、実際の使用方法が不明確

### 3. ログテーブル (`logs`) の問題

- **数値型フラグの使用**: `system`, `available`が0/1の数値で管理されており、可読性が低い
- **インデックス設計の問題**: 検索パフォーマンスを考慮したインデックス設計が不十分

### 4. クイズテーブル (`quizes`) の問題

- **テーブル名の誤記**: `quizes`は正しくは`quizzes`
- **問題番号の管理**: `n`フィールドの意味が不明確

## 新しいデータスキーマ設計

### 1. 共通テーブル

#### `games` - ゲーム基本情報

```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE,
  discord_webhook_url TEXT,
  profile_id UUID REFERENCES profiles(id)
);
```

#### `game_players` - ゲーム参加プレイヤー

```sql
CREATE TABLE game_players (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  display_order INTEGER NOT NULL,
  initial_score INTEGER DEFAULT 0,
  initial_correct_count INTEGER DEFAULT 0,
  initial_wrong_count INTEGER DEFAULT 0
);
```

### 2. ゲーム形式別設定テーブル

#### `game_nomx_settings` - N○M✕形式設定

```sql
CREATE TABLE game_nomx_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 7,
  lose_point INTEGER NOT NULL DEFAULT 3
);
```

#### `game_nomx_ad_settings` - 連答つきN○M✕形式設定

```sql
CREATE TABLE game_nomx_ad_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 7,
  lose_point INTEGER NOT NULL DEFAULT 3,
  streak_over3 BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### `game_ny_settings` - NewYork形式設定

```sql
CREATE TABLE game_ny_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  target_point INTEGER NOT NULL DEFAULT 10
);
```

#### `game_nomr_settings` - N○M休形式設定

```sql
CREATE TABLE game_nomr_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 7,
  rest_count INTEGER NOT NULL DEFAULT 3
);
```

#### `game_nbyn_settings` - NbyN形式設定

```sql
CREATE TABLE game_nbyn_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  n_value INTEGER NOT NULL DEFAULT 5
);
```

#### `game_nupdown_settings` - Nupdown形式設定

```sql
CREATE TABLE game_nupdown_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 5
);
```

#### `game_divide_settings` - Divide形式設定

```sql
CREATE TABLE game_divide_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 100,
  base_point INTEGER NOT NULL DEFAULT 10,
  initial_point INTEGER NOT NULL DEFAULT 10
);
```

#### `game_swedish10_settings` - Swedish10形式設定

```sql
CREATE TABLE game_swedish10_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 10,
  lose_point INTEGER NOT NULL DEFAULT 10
);
```

#### `game_backstream_settings` - Backstream形式設定

```sql
CREATE TABLE game_backstream_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  initial_point INTEGER NOT NULL DEFAULT 10,
  win_point INTEGER NOT NULL DEFAULT 20,
  lose_threshold INTEGER NOT NULL DEFAULT 0
);
```

#### `game_attacksurvival_settings` - Attack Survival形式設定

```sql
CREATE TABLE game_attacksurvival_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 5,
  lose_point INTEGER NOT NULL DEFAULT 3,
  attack_point INTEGER NOT NULL DEFAULT 3
);
```

#### `game_squarex_settings` - Square✕形式設定

```sql
CREATE TABLE game_squarex_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  square_size INTEGER NOT NULL DEFAULT 3,
  win_condition INTEGER NOT NULL DEFAULT 3
);
```

#### `game_z_settings` - Z形式設定

```sql
CREATE TABLE game_z_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 5,
  zone_point INTEGER NOT NULL DEFAULT 3
);
```

#### `game_freezex_settings` - Freeze✕形式設定

```sql
CREATE TABLE game_freezex_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 5,
  freeze_point INTEGER NOT NULL DEFAULT 3
);
```

#### `game_endless_chance_settings` - Endless Chance形式設定

```sql
CREATE TABLE game_endless_chance_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  lose_count INTEGER NOT NULL DEFAULT 3,
  use_r BOOLEAN NOT NULL DEFAULT FALSE
);
```

#### `game_variables_settings` - Variables形式設定

```sql
CREATE TABLE game_variables_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  win_point INTEGER NOT NULL DEFAULT 10
);
```

#### `game_aql_settings` - AQL形式設定

```sql
CREATE TABLE game_aql_settings (
  game_id UUID PRIMARY KEY REFERENCES games(id) ON DELETE CASCADE,
  left_team VARCHAR(255) NOT NULL,
  right_team VARCHAR(255) NOT NULL
);
```

### 3. プレイヤー関連テーブル

#### `players` - プレイヤーマスター

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  affiliation VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_id UUID REFERENCES profiles(id)
);
```

#### `player_tags` - プレイヤータグ

```sql
CREATE TABLE player_tags (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  UNIQUE(player_id, tag_name)
);
```

### 4. ゲームログ関連テーブル

#### `game_logs` - ゲーム操作ログ

```sql
CREATE TABLE game_logs (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  question_number INTEGER,
  action_type VARCHAR(50) NOT NULL, -- 'correct', 'wrong', 'through', etc.
  score_change INTEGER DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_system_action BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE -- 取り消し可能フラグ
);
```

#### `quiz_sessions` - クイズセッション

```sql
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  quiz_set_name VARCHAR(255),
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER,
  session_status VARCHAR(50) DEFAULT 'active' -- 'active', 'paused', 'completed'
);
```

### 5. クイズ関連テーブル

#### `quiz_sets` - クイズセット

```sql
CREATE TABLE quiz_sets (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_id UUID REFERENCES profiles(id)
);
```

#### `quiz_questions` - クイズ問題

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY,
  quiz_set_id UUID REFERENCES quiz_sets(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  category VARCHAR(100),
  difficulty_level INTEGER,
  UNIQUE(quiz_set_id, question_number)
);
```

### 6. プロファイル管理テーブル

#### `profiles` - プロファイル

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. インデックス設計

```sql
-- ゲームログの高速検索用
CREATE INDEX idx_game_logs_game_player ON game_logs(game_id, player_id);
CREATE INDEX idx_game_logs_timestamp ON game_logs(timestamp);
CREATE INDEX idx_game_logs_active ON game_logs(game_id, is_active);

-- プレイヤー検索用
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_profile ON players(profile_id);

-- ゲーム検索用
CREATE INDEX idx_games_rule_type ON games(rule_type);
CREATE INDEX idx_games_profile ON games(profile_id);
CREATE INDEX idx_games_last_accessed ON games(last_accessed_at);
```

## 移行手順

### フェーズ1: 新スキーマの実装準備

1. **新しい型定義の作成**
   - `src/utils/types-v2.ts`に新しい型定義を作成
   - 既存の型定義との互換性を保つアダプター関数を実装

2. **データアクセス層の抽象化**
   - `src/utils/db-v2.ts`に新しいデータアクセス層を実装
   - Repository パターンの導入

### フェーズ2: 段階的移行

1. **読み取り専用操作の移行**
   - ゲーム一覧表示、プレイヤー一覧表示など
   - 既存データから新スキーマへの変換処理を実装

2. **書き込み操作の移行**
   - 新規ゲーム作成、ログ追加など
   - 両方のスキーマに同時書き込みする期間を設ける

3. **データ移行ツールの実装**
   - 既存IndexedDBデータを新スキーマに変換するツール
   - データ整合性チェック機能

### フェーズ3: クラウドデータベース対応

1. **データベース選択と設定**
   - PostgreSQL (Supabase) またはMongoDB (Atlas)の選択
   - 認証・認可システムの統合

2. **同期機能の実装**
   - オフライン時の動作保証
   - 競合解決メカニズム

3. **パフォーマンス最適化**
   - クエリ最適化
   - キャッシュ戦略

### フェーズ4: 完全移行

1. **旧スキーマのサポート終了**
   - 移行期間の設定（3ヶ月程度）
   - ユーザーへの通知

2. **最終データクリーンアップ**
   - 旧テーブルの削除
   - 不要なコードの削除

## 実装における考慮事項

### 1. 型安全性の向上

- ゲーム形式ごとの専用テーブルにより完全な型安全性を実現
- JSONBフィールドを排除し、すべて明示的なカラムで管理
- TypeScriptのdiscriminated unionによる形式別型定義

#### TypeScript型定義例

```typescript
// 基本ゲーム情報
type BaseGame = {
  id: string;
  name: string;
  rule_type: RuleNames;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  is_archived: boolean;
  discord_webhook_url?: string;
  profile_id: string;
};

// 形式別設定の型定義
type GameSettings = {
  nomx: {
    win_point: number;
    lose_point: number;
  };
  "nomx-ad": {
    win_point: number;
    lose_point: number;
    streak_over3: boolean;
  };
  ny: {
    target_point: number;
  };
  aql: {
    left_team: string;
    right_team: string;
  };
  // ... 他の形式
};

// 完全な型安全性を持つゲーム型
type GameWithSettings<T extends RuleNames> = BaseGame & {
  rule_type: T;
  settings: GameSettings[T];
};

// 使用例
type NomxGame = GameWithSettings<"nomx">;
type AQLGame = GameWithSettings<"aql">;
```

### 2. パフォーマンス

- 適切なインデックス設計
- N+1問題の回避
- ページネーション対応

### 3. 拡張性

- 新しいゲーム形式の追加が容易
- プラグインアーキテクチャの導入検討
- APIのバージョニング

### 4. データ整合性

- 外部キー制約の活用
- トランザクション処理
- データバリデーション

## 想定される利点

1. **保守性の向上**: 明確なデータ構造により、バグの削減と機能追加が容易
2. **性能向上**: 適切なインデックス設計により検索性能が向上
3. **型安全性**: TypeScriptとの連携により実行時エラーを削減
4. **拡張性**: 新しいゲーム形式や機能の追加が容易
5. **データ品質**: 制約により不正なデータの混入を防止

## リスク管理

1. **移行期間の複雑性**: 両スキーマの並行稼働による複雑性
2. **データ損失のリスク**: 十分なバックアップとテスト
3. **パフォーマンス低下**: 移行期間中の性能監視
4. **ユーザビリティの影響**: 移行時のユーザー体験への配慮
