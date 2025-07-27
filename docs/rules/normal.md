# normal形式（スコア計算）仕様書

## 概要

normal形式（スコア計算）は、Score Watcherで利用できる最もシンプルなスコア管理形式です。基本的なポイント制クイズゲームの管理に適しており、「スコア計算」という名前で表示されます。

## 基本仕様

### ゲームルール名

- **システム名**: `normal`
- **表示名**: スコア計算
- **短縮説明**: スコアの計算を行います。
- **詳細説明**: ポイント数が表示されている部分をクリックすることでポイントが増加します。

### ゲーム設定項目

| 項目         | 設定値の例 | 説明                                                   |
| ------------ | ---------- | ------------------------------------------------------ |
| `correct_me` | 10         | 正解時にプレイヤーに加算されるポイント                 |
| `wrong_me`   | -10        | 誤答時にプレイヤーに加算されるポイント（通常は負の値） |
| `win_point`  | 50         | 勝ち抜けに必要なポイント数（この値以上になると勝利）   |
| `lose_point` | -30        | 失格になるポイント数（この値以下になると失格）         |
| `options`    | undefined  | 特別なオプション設定はなし                             |

## スコア計算ロジック

### 初期状態

各プレイヤーの初期状態は、ゲーム設定時に個別に設定可能です：

- **スコア**: プレイヤーの初期正解数（`initial_correct`）がそのままスコアになります
- **正解数**: プレイヤーの初期正解数（`initial_correct`）
- **誤答数**: プレイヤーの初期誤答数（`initial_wrong`）
- **状態**: `playing`（プレイ中）

**設定可能な初期値**：

- `initial_correct`: プレイヤーの初期正解数（デフォルト: 0）
- `initial_wrong`: プレイヤーの初期誤答数（デフォルト: 0）
- `base_correct_point`: 基本正解時獲得ポイント（デフォルト: 10）
- `base_wrong_point`: 基本誤答時獲得ポイント（デフォルト: -10）

### 正解時の処理

1. プレイヤーのスコアに `correct_me` の値を加算
2. 正解数を1増加
3. 最後の正解問題番号を記録
4. スコアが `win_point` 以上になった場合、状態を `win`（勝利）に変更

### 誤答時の処理

1. プレイヤーのスコアに `wrong_me` の値を加算（通常は減算）
2. 誤答数を1増加
3. 最後の誤答問題番号を記録
4. 誤答数が `lose_point` 以上になった場合、状態を `lose`（失格）に変更

### 状態管理

- **`playing`**: ゲーム続行中
- **`win`**: 勝ち抜け完了
- **`lose`**: 失格状態

## UI表示・操作方法

### スコアボード表示

- プレイヤーカードに赤色のスコア表示ボタンが配置される
- ボタンには現在のスコアが「◯pt」形式で表示される

### 操作方法

基本的な操作方法については、[共通操作方法](./common-operations.md)を参照してください。

#### Normalゲーム固有の操作

- **スコア表示ボタンをクリック**: 正解として記録され、スコアが増加

## 実装詳細

### 関連ファイル

- **スコア計算ロジック**: `src/utils/computeScore/normal.ts`
- **ゲーム設定定義**: `src/utils/rules.ts` (15-23行目)
- **型定義**: `src/utils/types.ts`
- **テストファイル**: `src/utils/computeScore/__tests__/normal.test.ts`

### UI コンポーネント

- **メインボード**: `src/app/(board)/games/[game_id]/board/_components/Board/Board.tsx`
- **プレイヤー表示**: `src/app/(board)/games/[game_id]/board/_components/Player/Player.tsx`
- **スコア表示**: `src/app/(board)/games/[game_id]/board/_components/PlayerScore/PlayerScore.tsx`
- **スコアボタン**: `src/app/(board)/games/[game_id]/board/_components/PlayerScoreButton/PlayerScoreButton.tsx`

### 計算アルゴリズム

```typescript
// 正解時
if (log.variant === "correct") {
  const newScore = playerState.score + game.correct_me;
  if (newScore >= game.win_point) {
    // 勝利状態に変更
    playerState.state = "win";
  }
}

// 誤答時
if (log.variant === "wrong") {
  const newScore = playerState.score + game.wrong_me;
  const newWrong = playerState.wrong + 1;
  if (newWrong >= game.lose_point) {
    // 失格状態に変更
    playerState.state = "lose";
  }
}
```

## 使用場面

Normalゲームルールは以下のような場面で活用できます：

- 基本的なポイント制クイズ大会
- 早押しクイズの個人戦
- シンプルなスコア管理が必要な競技
- 他の複雑なルールを学ぶ前の基礎練習

## 注意事項

- プレイヤーの初期正解数・初期誤答数は、ゲーム作成時またはゲーム設定画面で個別に変更可能です
- 初期値を変更した場合、スコア計算に即座に反映されます
- その他の注意事項については、[共通操作方法](./common-operations.md)を参照してください
