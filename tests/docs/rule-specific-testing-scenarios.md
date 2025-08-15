# ゲーム形式別テストシナリオ

## 概要

このドキュメントは、Score Watcherのオンライン版で利用可能な各ゲーム形式の固有機能をテストするためのPlaywrightテストシナリオを定義します。各形式の特徴的な機能とルールに基づいて、形式ごとに特化したテストケースを実行する必要があります。

## 共通テスト設定

### 前提条件

- 認証済みのテストユーザーでアクセス
- オンライン版ゲーム作成・プレイヤー追加が完了済み
- ボードページでの基本操作が可能

### 基本テスト手順

1. 指定形式でゲームを作成
2. 必要数のプレイヤーを追加
3. ボードページに移動
4. 形式固有の機能をテスト
5. 期待される結果を検証

---

## 1. Normal形式（スコア計算）

### 特徴

- 最もシンプルな形式
- 正解でポイント増加のみ
- 失格・勝ち抜け条件なし

### テストシナリオ

#### 1.1 基本スコア加算テスト

```javascript
test("Normal形式 - 基本スコア加算", async ({ page }) => {
  // Normal形式のゲームを作成
  await createGame(page, "normal", "Normalテストゲーム");

  // プレイヤーのスコアボタンをクリック
  await page.locator("#players-area").first().getByRole("button").click();

  // スコアが1ptに増加することを確認
  await expect(
    page.locator("#players-area").first().getByRole("button")
  ).toContainText("1pt");

  // さらにクリックしてスコア増加を確認
  await page.locator("#players-area").first().getByRole("button").click();
  await expect(
    page.locator("#players-area").first().getByRole("button")
  ).toContainText("2pt");
});
```

#### 1.2 継続的スコア増加テスト

- 複数回の正解操作でスコアが継続的に増加することを確認
- 誤答ボタンが存在しないことを確認
- 失格・勝ち抜け状態が発生しないことを確認

#### 1.3 完全ゲームシナリオテスト

```javascript
test("Normal形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "normal", "Normal完全テスト", 3);

  // Normal形式では勝ち抜け・敗退条件がないため、
  // スコア蓄積のみを確認
  const players = [
    page.locator("#players-area").nth(0),
    page.locator("#players-area").nth(1),
    page.locator("#players-area").nth(2),
  ];

  // プレイヤー1: 10回正解
  for (let i = 0; i < 10; i++) {
    await players[0].getByRole("button").click();
  }
  await expect(players[0].getByText("10pt")).toBeVisible();

  // プレイヤー2: 5回正解
  for (let i = 0; i < 5; i++) {
    await players[1].getByRole("button").click();
  }
  await expect(players[1].getByText("5pt")).toBeVisible();

  // プレイヤー3: 2回正解
  for (let i = 0; i < 2; i++) {
    await players[2].getByRole("button").click();
  }
  await expect(players[2].getByText("2pt")).toBeVisible();

  // Normal形式では全員がplaying状態を維持
  for (let i = 0; i < 3; i++) {
    await expect(players[i].getByRole("button")).not.toBeDisabled();
  }
});
```

---

## 2. NomX形式（N○M✕）

### 特徴

- N回正解で勝ち抜け
- M回誤答で失格
- リーチ状態の表示

### テストシナリオ

#### 2.1 勝ち抜けテスト

```javascript
test("NomX形式 - 勝ち抜け動作", async ({ page }) => {
  // 7○3✕でゲーム作成
  await createGame(page, "nomx", "NomXテストゲーム", {
    win_point: 7,
    lose_point: 3,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();

  // 6回正解（リーチ状態）
  for (let i = 0; i < 6; i++) {
    await correctButton.click();
  }

  // リーチ状態の表示を確認
  await expect(firstPlayer).toHaveClass(/reach/);

  // 7回目の正解で勝ち抜け
  await correctButton.click();
  await expect(firstPlayer.getByTestId("player-score")).toContainText("1st");

  // ボタンが無効化されることを確認
  await expect(correctButton).toBeDisabled();
});
```

#### 2.2 失格テスト

```javascript
test("NomX形式 - 失格動作", async ({ page }) => {
  await createGame(page, "nomx", "NomX失格テスト", {
    win_point: 7,
    lose_point: 3,
  });

  const firstPlayer = page.locator("#players-area").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 2回誤答（リーチ状態）
  for (let i = 0; i < 2; i++) {
    await wrongButton.click();
  }

  // 失格リーチ状態の表示を確認
  await expect(firstPlayer).toHaveClass(/lose-reach/);

  // 3回目の誤答で失格
  await wrongButton.click();
  await expect(firstPlayer.getByTestId("player-score")).toContainText("LOSE");

  // 全ボタンが無効化されることを確認
  await expect(firstPlayer.getByRole("button").first()).toBeDisabled();
  await expect(firstPlayer.getByRole("button").last()).toBeDisabled();
});
```

#### 2.3 完全ゲームシナリオテスト（勝ち抜け・敗退）

```javascript
test("NomX形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "nomx", "NomX完全テスト", 4, {
    win_point: 5, // 5回正解で勝ち抜け
    lose_point: 3, // 3回誤答で失格
    win_through: 2, // 2人勝ち抜けでゲーム終了
  });

  const players = [
    page.locator("#players-area").nth(0),
    page.locator("#players-area").nth(1),
    page.locator("#players-area").nth(2),
    page.locator("#players-area").nth(3),
  ];

  // === Phase 1: 序盤戦 ===
  // プレイヤー1: 3回正解
  for (let i = 0; i < 3; i++) {
    await players[0].getByRole("button").first().click();
  }

  // プレイヤー2: 2回正解、1回誤答
  for (let i = 0; i < 2; i++) {
    await players[1].getByRole("button").first().click();
  }
  await players[1].getByRole("button").last().click(); // 誤答

  // プレイヤー3: 1回誤答
  await players[2].getByRole("button").last().click();

  // === Phase 2: プレイヤー4失格 ===
  // プレイヤー4: 3回連続誤答で失格
  for (let i = 0; i < 3; i++) {
    await players[3].getByRole("button").last().click();
  }
  await expect(players[3].getByTestId("player-score")).toContainText("LOSE");
  await expect(players[3].getByRole("button").first()).toBeDisabled();

  // === Phase 3: 勝ち抜け競争 ===
  // プレイヤー1: 2回正解で勝ち抜け（5回到達）
  for (let i = 0; i < 2; i++) {
    await players[0].getByRole("button").first().click();
  }
  await expect(players[0].getByTestId("player-score")).toContainText("1st");
  await expect(players[0].getByRole("button")).toBeDisabled();

  // プレイヤー2: 3回正解で勝ち抜け（5回到達）
  for (let i = 0; i < 3; i++) {
    await players[1].getByRole("button").first().click();
  }
  await expect(players[1].getByTestId("player-score")).toContainText("2nd");
  await expect(players[1].getByRole("button")).toBeDisabled();

  // === Phase 4: ゲーム終了確認 ===
  // 2人勝ち抜けでゲーム終了のメッセージ確認
  await expect(page.getByText(/ゲーム終了/)).toBeVisible();

  // プレイヤー3は継続中状態
  await expect(players[2]).not.toHaveClass(/win|lose/);
});
```

---

## 3. AQL形式

### 特徴

- 10人固定のチーム戦
- 左チーム（1-5番）vs 右チーム（6-10番）
- チームスコア積が200以上で勝利
- 相手チーム誤答時の自動復活システム

### テストシナリオ

#### 3.1 チーム表示テスト

```javascript
test("AQL形式 - チーム分け表示", async ({ page }) => {
  // 10人のプレイヤーでAQLゲーム作成
  await createGameWithPlayers(page, "aql", "AQLテストゲーム", 10, {
    left_team: "チームA",
    right_team: "チームB",
  });

  // チーム名の表示を確認
  await expect(page.getByText("チームA")).toBeVisible();
  await expect(page.getByText("チームB")).toBeVisible();

  // 左チーム（プレイヤー1-5）の表示確認
  for (let i = 0; i < 5; i++) {
    await expect(page.locator(".left-team").nth(i)).toBeVisible();
  }

  // 右チーム（プレイヤー6-10）の表示確認
  for (let i = 0; i < 5; i++) {
    await expect(page.locator(".right-team").nth(i)).toBeVisible();
  }
});
```

#### 3.2 復活システムテスト

```javascript
test("AQL形式 - 自動復活システム", async ({ page }) => {
  await createGameWithPlayers(page, "aql", "AQL復活テスト", 10);

  // 左チームプレイヤー1を2回誤答で失格させる
  const leftPlayer1 = page.locator(".left-team").first();
  const wrongButton = leftPlayer1.getByRole("button").last();

  await wrongButton.click(); // 1回目誤答
  await wrongButton.click(); // 2回目誤答（失格）

  await expect(leftPlayer1).toHaveClass(/lose/);

  // 右チームプレイヤー6が誤答
  const rightPlayer6 = page.locator(".right-team").first();
  await rightPlayer6.getByRole("button").last().click();

  // 左チームプレイヤー1が自動復活することを確認
  await expect(leftPlayer1).not.toHaveClass(/lose/);
  await expect(leftPlayer1.getByTestId("player-score")).toContainText("1pt");
});
```

#### 3.3 チーム勝利条件テスト

```javascript
test("AQL形式 - チームスコア積による勝利判定", async ({ page }) => {
  await createGameWithPlayers(page, "aql", "AQL勝利テスト", 10);

  // 左チーム各プレイヤーを一定回数正解させる
  // 例: 4×4×4×2×2 = 256 > 200
  const leftTeamScores = [4, 4, 4, 2, 2];

  for (let i = 0; i < 5; i++) {
    const player = page.locator(".left-team").nth(i);
    const correctButton = player.getByRole("button").first();

    for (let j = 0; j < leftTeamScores[i]; j++) {
      await correctButton.click();
    }
  }

  // チーム勝利の表示を確認
  await expect(page.getByText(/チームA.*勝利/)).toBeVisible();

  // 勝利チームの背景色変更を確認
  await expect(page.locator(".left-team-area")).toHaveClass(/win/);
});
```

#### 3.4 完全ゲームシナリオテスト（チーム勝敗）

```javascript
test("AQL形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "aql", "AQL完全テスト", 10, {
    left_team: "レッドチーム",
    right_team: "ブルーチーム"
  });

  const leftPlayers = [];
  const rightPlayers = [];

  // チーム分け
  for (let i = 0; i < 5; i++) {
    leftPlayers.push(page.locator(".left-team").nth(i));
    rightPlayers.push(page.locator(".right-team").nth(i));
  }

  // === Phase 1: 左チーム優勢戦略 ===
  // 左チーム各プレイヤーを2-3正解させる
  for (let i = 0; i < 5; i++) {
    const correctCount = i < 3 ? 3 : 2; // 前3人は3正解、後2人は2正解
    for (let j = 0; j < correctCount; j++) {
      await leftPlayers[i].getByRole("button").first().click();
    }
  }

  // 左チームスコア積: 4×4×4×3×3 = 576 > 200 で勝利のはず
  await expect(page.getByText(/レッドチーム.*勝利/)).toBeVisible();

  // === Phase 2: 失格・復活システムの検証 ===
  // 右チームプレイヤー1を失格させる
  for (let i = 0; i < 2; i++) {
    await rightPlayers[0].getByRole("button").last().click(); // 2回誤答で失格
  }
  await expect(rightPlayers[0]).toHaveClass(/lose/);

  // 左チームプレイヤー1が誤答（右チーム失格者復活）
  await leftPlayers[0].getByRole("button").last().click();
  await expect(rightPlayers[0]).not.toHaveClass(/lose/);
  await expect(rightPlayers[0].getByText("1pt")).toBeVisible(); // 復活時は1ptにリセット

  // === Phase 3: ゲーム終了状態の確認 ===
  // 勝利チームの全プレイヤーが操作不能になることを確認
  for (let i = 0; i < 5; i++) {
    await expect(leftPlayers[i].getByRole("button")).toBeDisabled();
  }

  // 敗北チームも操作不能
  for (let i = 0; i < 5; i++) {
    await expect(rightPlayers[i].getByRole("button")).toBeDisabled();
  }
});
});
```

---

## 4. SquareX形式

### 特徴

- 奇数問目・偶数問目の正解数の積でスコア計算
- 3行レイアウト（スコア・計算式・操作ボタン）
- 問題番号による分類システム

### テストシナリオ

#### 4.1 奇数・偶数問目スコア計算テスト

```javascript
test("SquareX形式 - 奇数偶数スコア計算", async ({ page }) => {
  await createGame(page, "squarex", "SquareXテストゲーム", {
    win_point: 16,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();

  // Q1（0番目=奇数問目）で正解
  await correctButton.click();
  await expect(firstPlayer.getByText("1×0")).toBeVisible(); // 計算式表示
  await expect(firstPlayer.getByText("0pt")).toBeVisible(); // スコア0

  // Q2（1番目=偶数問目）で正解
  await correctButton.click();
  await expect(firstPlayer.getByText("1×1")).toBeVisible(); // 計算式表示
  await expect(firstPlayer.getByText("1pt")).toBeVisible(); // スコア1

  // Q3（2番目=奇数問目）で正解
  await correctButton.click();
  await expect(firstPlayer.getByText("2×1")).toBeVisible(); // 計算式表示
  await expect(firstPlayer.getByText("2pt")).toBeVisible(); // スコア2
});
```

#### 4.2 勝ち抜け条件テスト

```javascript
test("SquareX形式 - 16pt勝ち抜け", async ({ page }) => {
  await createGame(page, "squarex", "SquareX勝ち抜けテスト", {
    win_point: 16,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();

  // 4×4=16になるまで正解を重ねる
  // 奇数問目4回、偶数問目4回の計8回正解が必要
  for (let i = 0; i < 8; i++) {
    await correctButton.click();

    // 問題番号を確認しながらスコアを追跡
    const questionNumber = await page
      .locator("[data-testid='question-number']")
      .textContent();
    // 期待されるスコア計算を確認
  }

  // 16pt到達で勝ち抜け
  await expect(firstPlayer.getByTestId("player-score")).toContainText("1st");
});
```

#### 4.3 レイアウト表示テスト

```javascript
test("SquareX形式 - 3行レイアウト表示", async ({ page }) => {
  await createGame(page, "squarex", "SquareXレイアウトテスト");

  const firstPlayer = page.locator("#players-area").first();

  // 1行目: メインスコア表示
  await expect(firstPlayer.locator(".score-display")).toBeVisible();

  // 2行目: 計算式表示（緑色ボタン）
  const formulaButton = firstPlayer.locator(".formula-display");
  await expect(formulaButton).toBeVisible();
  await expect(formulaButton).toHaveClass(/green/);
  await expect(formulaButton).toBeDisabled(); // 操作不可

  // 3行目: 操作ボタン（正解・誤答）
  await expect(firstPlayer.getByRole("button").first()).toBeVisible(); // 正解
  await expect(firstPlayer.getByRole("button").last()).toBeVisible(); // 誤答
});
```

#### 4.4 完全ゲームシナリオテスト（勝ち抜け）

```javascript
test("SquareX形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "squarex", "SquareX完全テスト", 3, {
    win_point: 25, // 5×5=25で勝ち抜け
  });

  const players = [
    page.locator("#players-area").nth(0),
    page.locator("#players-area").nth(1),
    page.locator("#players-area").nth(2),
  ];

  // === Phase 1: プレイヤー1の戦略的勝ち抜け ===
  // バランス型戦略で効率的に勝ち抜けを狙う

  // 奇数問目5回、偶数問目5回の計10回正解が必要
  // Q1(0),Q3(2),Q5(4),Q7(6),Q9(8) = 奇数問目5回
  // Q2(1),Q4(3),Q6(5),Q8(7),Q10(9) = 偶数問目5回

  for (let i = 0; i < 10; i++) {
    await players[0].getByRole("button").first().click();

    // 途中経過の確認
    if (i === 1) {
      // Q1,Q2後: 1×1=1pt
      await expect(players[0].getByText("1pt")).toBeVisible();
      await expect(players[0].getByText("1×1")).toBeVisible();
    }
    if (i === 3) {
      // Q1,Q2,Q3,Q4後: 2×2=4pt
      await expect(players[0].getByText("4pt")).toBeVisible();
      await expect(players[0].getByText("2×2")).toBeVisible();
    }
    if (i === 7) {
      // Q1-Q8後: 4×4=16pt
      await expect(players[0].getByText("16pt")).toBeVisible();
      await expect(players[0].getByText("4×4")).toBeVisible();
    }
  }

  // 10回目正解で25pt到達、勝ち抜け確認
  await expect(players[0].getByText("25pt")).toBeVisible();
  await expect(players[0].getByText("5×5")).toBeVisible();
  await expect(players[0].getByTestId("player-score")).toContainText("1st");
  await expect(players[0].getByRole("button")).toBeDisabled();

  // === Phase 2: プレイヤー2の非効率戦略 ===
  // 偏重型戦略（奇数問目重視）

  // 奇数問目を10回正解（偶数問目は誤答含む）
  for (let i = 0; i < 15; i++) {
    const questionNum = i % 2;
    if (questionNum === 0) {
      // 奇数問目
      await players[1].getByRole("button").first().click();
    } else {
      // 偶数問目は誤答
      await players[1].getByRole("button").last().click();
    }
  }

  // 偏重型のため効率が悪い（例: 10×1=10pt程度）
  await expect(players[1].getByText(/10pt|5pt|2pt/)).toBeVisible();
  await expect(players[1]).not.toHaveClass(/win/);

  // === Phase 3: プレイヤー3の継続中状態確認 ===
  // ゲーム継続中であることを確認
  await expect(players[2].getByRole("button")).not.toBeDisabled();
  await expect(players[2]).not.toHaveClass(/win|lose/);
});
```

---

## 5. NY形式（NewYork）

### 特徴

- 正解で+1、誤答で-1
- Nポイント到達で勝ち抜け
- スコアがマイナスになる可能性

### テストシナリオ

#### 5.1 加減算システムテスト

```javascript
test("NY形式 - 加減算システム", async ({ page }) => {
  await createGame(page, "ny", "NYテストゲーム", {
    win_point: 10,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 正解で+1
  await correctButton.click();
  await expect(firstPlayer.getByText("1pt")).toBeVisible();

  // 誤答で-1
  await wrongButton.click();
  await expect(firstPlayer.getByText("0pt")).toBeVisible();

  // さらに誤答でマイナススコア
  await wrongButton.click();
  await expect(firstPlayer.getByText("-1pt")).toBeVisible();
});
```

#### 5.2 勝ち抜け条件テスト

```javascript
test("NY形式 - 10pt勝ち抜け", async ({ page }) => {
  await createGame(page, "ny", "NY勝ち抜けテスト", {
    win_point: 10,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();

  // 10回正解で勝ち抜け
  for (let i = 1; i <= 10; i++) {
    await correctButton.click();
    await expect(firstPlayer.getByText(`${i}pt`)).toBeVisible();
  }

  // 勝ち抜け表示確認
  await expect(firstPlayer.getByTestId("player-score")).toContainText("1st");
});
```

#### 5.3 完全ゲームシナリオテスト（勝ち抜け・失格なし）

```javascript
test("NY形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "ny", "NY完全テスト", 3, {
    win_point: 8, // 8pt到達で勝ち抜け
  });

  const players = [
    page.locator("#players-area").nth(0),
    page.locator("#players-area").nth(1),
    page.locator("#players-area").nth(2),
  ];

  // === Phase 1: プレイヤー1の安定勝ち抜け ===
  // 正解重視で着実に8ptを目指す

  // 10回正解、2回誤答で8pt到達
  for (let i = 0; i < 10; i++) {
    await players[0].getByRole("button").first().click(); // +1
  }
  // 現在10pt
  await expect(players[0].getByText("10pt")).toBeVisible();

  // 2回誤答
  for (let i = 0; i < 2; i++) {
    await players[0].getByRole("button").last().click(); // -1
  }
  // 8pt到達で勝ち抜け
  await expect(players[0].getByText("8pt")).toBeVisible();
  await expect(players[0].getByTestId("player-score")).toContainText("1st");
  await expect(players[0].getByRole("button")).toBeDisabled();

  // === Phase 2: プレイヤー2の苦戦（マイナススコア経験）===
  // 誤答が多い状況をシミュレート

  // 3回正解
  for (let i = 0; i < 3; i++) {
    await players[1].getByRole("button").first().click();
  }
  await expect(players[1].getByText("3pt")).toBeVisible();

  // 5回誤答でマイナスに転落
  for (let i = 0; i < 5; i++) {
    await players[1].getByRole("button").last().click();
  }
  await expect(players[1].getByText("-2pt")).toBeVisible();

  // 再度10回正解で復活・勝ち抜け
  for (let i = 0; i < 10; i++) {
    await players[1].getByRole("button").first().click();
  }
  await expect(players[1].getByText("8pt")).toBeVisible();
  await expect(players[1].getByTestId("player-score")).toContainText("2nd");
  await expect(players[1].getByRole("button")).toBeDisabled();

  // === Phase 3: プレイヤー3の継続状態 ===
  // NY形式は失格がないため、3番目のプレイヤーは継続中

  // 数回の操作で継続状態を確認
  for (let i = 0; i < 3; i++) {
    await players[2].getByRole("button").first().click();
  }
  await expect(players[2].getByText("3pt")).toBeVisible();
  await expect(players[2]).not.toHaveClass(/win|lose/);
  await expect(players[2].getByRole("button")).not.toBeDisabled();
});
```

---

## 6. Backstream形式

### 特徴

- 正解で+1、n回目の誤答で-n
- 正答数-誤答数が10で勝ち抜け
- -10で失格

### テストシナリオ

#### 6.1 累積誤答ペナルティテスト

```javascript
test("Backstream形式 - 累積誤答ペナルティ", async ({ page }) => {
  await createGame(page, "backstream", "Backstreamテストゲーム");

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 3回正解
  for (let i = 0; i < 3; i++) {
    await correctButton.click();
  }
  await expect(firstPlayer.getByText("3pt")).toBeVisible();

  // 1回目誤答（-1）
  await wrongButton.click();
  await expect(firstPlayer.getByText("2pt")).toBeVisible();

  // 2回目誤答（-2）
  await wrongButton.click();
  await expect(firstPlayer.getByText("0pt")).toBeVisible();

  // 3回目誤答（-3）
  await wrongButton.click();
  await expect(firstPlayer.getByText("-3pt")).toBeVisible();
});
```

#### 6.2 完全ゲームシナリオテスト（勝ち抜け・失格）

```javascript
test("Backstream形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "backstream", "Backstream完全テスト", 3, {
    win_point: 10, // 10pt到達で勝ち抜け
    lose_point: -10, // -10pt到達で失格
  });

  const players = [
    page.locator("#players-area").nth(0),
    page.locator("#players-area").nth(1),
    page.locator("#players-area").nth(2),
  ];

  // === Phase 1: プレイヤー1の勝ち抜け ===
  // 正解重視で10pt到達を目指す

  // 12回正解、2回誤答で10pt到達
  for (let i = 0; i < 12; i++) {
    await players[0].getByRole("button").first().click(); // +1
  }
  await expect(players[0].getByText("12pt")).toBeVisible();

  // 1回目誤答（-1）
  await players[0].getByRole("button").last().click();
  await expect(players[0].getByText("11pt")).toBeVisible();

  // 2回目誤答（-2）
  await players[0].getByRole("button").last().click();
  await expect(players[0].getByText("9pt")).toBeVisible();

  // 1回正解で10pt到達、勝ち抜け
  await players[0].getByRole("button").first().click();
  await expect(players[0].getByText("10pt")).toBeVisible();
  await expect(players[0].getByTestId("player-score")).toContainText("1st");
  await expect(players[0].getByRole("button")).toBeDisabled();

  // === Phase 2: プレイヤー2の失格 ===
  // 誤答が多すぎて-10ptに到達

  // 2回正解
  for (let i = 0; i < 2; i++) {
    await players[1].getByRole("button").first().click();
  }
  await expect(players[1].getByText("2pt")).toBeVisible();

  // 4回誤答で大幅マイナス（-1-2-3-4 = -10）
  for (let i = 1; i <= 4; i++) {
    await players[1].getByRole("button").last().click();
    const expectedScore = 2 - (1 + 2 + 3 + 4);
    if (i === 4) {
      // 4回目誤答後: 2-10=-8pt（まだ失格ではない）
      await expect(players[1].getByText("-8pt")).toBeVisible();
    }
  }

  // さらに1回誤答（5回目: -5）で-13pt、失格確定
  await players[1].getByRole("button").last().click();
  await expect(players[1].getByText("-13pt")).toBeVisible();
  await expect(players[1].getByTestId("player-score")).toContainText("LOSE");
  await expect(players[1].getByRole("button")).toBeDisabled();

  // === Phase 3: プレイヤー3の継続状態 ===
  // バランスの取れた解答で継続中

  // 3回正解、1回誤答
  for (let i = 0; i < 3; i++) {
    await players[2].getByRole("button").first().click();
  }
  await players[2].getByRole("button").last().click(); // 1回目誤答（-1）

  await expect(players[2].getByText("2pt")).toBeVisible(); // 3-1=2pt
  await expect(players[2]).not.toHaveClass(/win|lose/);
  await expect(players[2].getByRole("button")).not.toBeDisabled();
});
```

---

## 7. Z形式

### 特徴

- 5段階のステージクリアシステム
- ステージごとに異なるルール
- ステージクリア時の全体リセット

### テストシナリオ

#### 7.1 ステージ進行テスト

```javascript
test("Z形式 - ステージ進行システム", async ({ page }) => {
  await createGameWithPlayers(page, "z", "Zテストゲーム", 5);

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();

  // ステージ1: 1回正解でクリア
  await correctButton.click();

  // ステージ2進出を確認
  await expect(firstPlayer.getByText(/ステージ2/)).toBeVisible();

  // 他のプレイヤーがリセットされることを確認
  for (let i = 1; i < 5; i++) {
    const player = page.locator("#players-area").nth(i);
    await expect(player.getByText("0pt")).toBeVisible();
  }
});
```

#### 7.2 完全ゲームシナリオテスト（ステージクリア・勝ち抜け）

```javascript
test("Z形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "z", "Z完全テスト", 4);

  const players = [
    page.locator("#players-area").nth(0),
    page.locator("#players-area").nth(1),
    page.locator("#players-area").nth(2),
    page.locator("#players-area").nth(3),
  ];

  // === Phase 1: プレイヤー1のステージ1→2進出 ===
  // ステージ1: 1回正解でクリア
  await players[0].getByRole("button").first().click();

  await expect(players[0].getByText(/ステージ2/)).toBeVisible();
  // 他プレイヤーはリセットされてステージ1に戻る
  for (let i = 1; i < 4; i++) {
    await expect(players[i].getByText(/ステージ1/)).toBeVisible();
  }

  // === Phase 2: プレイヤー2のステージ1→2→3進出 ===
  // ステージ1クリア
  await players[1].getByRole("button").first().click();
  await expect(players[1].getByText(/ステージ2/)).toBeVisible();

  // ステージ2: 2回正解でクリア
  for (let i = 0; i < 2; i++) {
    await players[1].getByRole("button").first().click();
  }
  await expect(players[1].getByText(/ステージ3/)).toBeVisible();

  // === Phase 3: プレイヤー3の失格 ===
  // ステージ1で誤答して失格状態
  await players[2].getByRole("button").last().click();
  await expect(players[2]).toHaveClass(/incapacity/); // 1問休み

  // === Phase 4: プレイヤー1の最終勝ち抜け ===
  // プレイヤー1がステージ2→3→4→5まで進む

  // ステージ2クリア（2回正解）
  for (let i = 0; i < 2; i++) {
    await players[0].getByRole("button").first().click();
  }
  await expect(players[0].getByText(/ステージ3/)).toBeVisible();

  // ステージ3クリア（3回正解）
  for (let i = 0; i < 3; i++) {
    await players[0].getByRole("button").first().click();
  }
  await expect(players[0].getByText(/ステージ4/)).toBeVisible();

  // ステージ4クリア（4回正解）
  for (let i = 0; i < 4; i++) {
    await players[0].getByRole("button").first().click();
  }
  await expect(players[0].getByText(/ステージ5/)).toBeVisible();

  // ステージ5到達で勝ち抜け
  await expect(players[0].getByTestId("player-score")).toContainText("1st");
  await expect(players[0].getByRole("button")).toBeDisabled();

  // === Phase 5: 他プレイヤーの状態確認 ===
  // プレイヤー2はステージ3で継続中
  await expect(players[1].getByText(/ステージ3/)).toBeVisible();
  await expect(players[1]).not.toHaveClass(/win/);

  // プレイヤー3,4は下位ステージで継続
  await expect(players[2]).not.toHaveClass(/win/);
  await expect(players[3]).not.toHaveClass(/win/);
});
```

---

## 8. Variables形式

### 特徴

- プレイヤーごとの変動値N設定
- 正解で+N、誤答で-N×(N-2)
- 30pt到達で勝ち抜け

### テストシナリオ

#### 8.1 変動値設定テスト

```javascript
test("Variables形式 - 変動値設定", async ({ page }) => {
  await createGame(page, "variables", "Variablesテストゲーム");

  // ゲーム開始前に各プレイヤーの変動値を設定
  const firstPlayer = page.locator("#players-area").first();

  // 変動値設定画面の表示確認
  await expect(page.getByText("変動値を設定してください")).toBeVisible();

  // 変動値5を設定
  await firstPlayer.locator("input[type='number']").fill("5");
  await page.getByRole("button", { name: "設定完了" }).click();

  // 設定が反映されることを確認
  await expect(firstPlayer.getByText("変動値: 5")).toBeVisible();
});
```

#### 8.2 完全ゲームシナリオテスト（変動値戦略・勝ち抜け）

```javascript
test("Variables形式 - 完全ゲームシナリオ", async ({ page }) => {
  await createGameWithPlayers(page, "variables", "Variables完全テスト", 3, {
    win_point: 30, // 30pt到達で勝ち抜け
  });

  const players = [
    page.locator("#players-area").nth(0),
    page.locator("#players-area").nth(1),
    page.locator("#players-area").nth(2),
  ];

  // === Phase 1: 変動値設定 ===
  // プレイヤー1: 安全戦略（変動値3）
  await players[0].locator("input[type='number']").fill("3");

  // プレイヤー2: 積極戦略（変動値5）
  await players[1].locator("input[type='number']").fill("5");

  // プレイヤー3: 危険戦略（変動値7）
  await players[2].locator("input[type='number']").fill("7");

  await page.getByRole("button", { name: "設定完了" }).click();

  // === Phase 2: プレイヤー1の安全勝ち抜け ===
  // 変動値3: 正解+3, 誤答-3×(3-2)=-3

  // 10回正解で30pt到達
  for (let i = 0; i < 10; i++) {
    await players[0].getByRole("button").first().click();
    await expect(players[0].getByText(`${(i + 1) * 3}pt`)).toBeVisible();
  }

  // 30pt到達で勝ち抜け
  await expect(players[0].getByTestId("player-score")).toContainText("1st");
  await expect(players[0].getByRole("button")).toBeDisabled();

  // === Phase 3: プレイヤー3の危険戦略失敗 ===
  // 変動値7: 正解+7, 誤答-7×(7-2)=-35

  // 4回正解で28pt
  for (let i = 0; i < 4; i++) {
    await players[2].getByRole("button").first().click();
  }
  await expect(players[2].getByText("28pt")).toBeVisible();

  // 1回誤答で大幅減少: 28-35=-7pt
  await players[2].getByRole("button").last().click();
  await expect(players[2].getByText("-7pt")).toBeVisible();

  // === Phase 4: プレイヤー2の積極戦略成功 ===
  // 変動値5: 正解+5, 誤答-5×(5-2)=-15

  // 6回正解で30pt到達
  for (let i = 0; i < 6; i++) {
    await players[1].getByRole("button").first().click();
  }
  await expect(players[1].getByText("30pt")).toBeVisible();
  await expect(players[1].getByTestId("player-score")).toContainText("2nd");
  await expect(players[1].getByRole("button")).toBeDisabled();

  // === Phase 5: プレイヤー3の復活挑戦 ===
  // マイナスから復活を試みるも、変動値7は高リスク

  // 5回正解で復活: -7+35=28pt
  for (let i = 0; i < 5; i++) {
    await players[2].getByRole("button").first().click();
  }
  await expect(players[2].getByText("28pt")).toBeVisible();

  // さらに1回正解で勝ち抜け: 28+7=35pt > 30pt
  await players[2].getByRole("button").first().click();
  await expect(players[2].getByText("35pt")).toBeVisible();
  await expect(players[2].getByTestId("player-score")).toContainText("3rd");
  await expect(players[2].getByRole("button")).toBeDisabled();
});
```

---

## 9. NomX-AD形式（連答つきN○M✕）

### 特徴

- 基本的にはNomX形式と同様
- 同じプレイヤーが連続正解すると+2される
- streak_over3オプションで3連続以上の処理

### テストシナリオ

#### 9.1 連答ボーナステスト

```javascript
test("NomX-AD形式 - 連答ボーナス", async ({ page }) => {
  await createGame(page, "nomx-ad", "NomX-ADテストゲーム", {
    win_point: 7,
    lose_point: 3,
    streak_over3: true,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();

  // 1回目正解（通常スコア）
  await correctButton.click();
  await expect(firstPlayer.getByText("1-0")).toBeVisible();

  // 2回目連続正解（+2ボーナス）
  await correctButton.click();
  await expect(firstPlayer.getByText("3-0")).toBeVisible(); // 1+2=3

  // 他プレイヤーが解答して連答を中断
  const secondPlayer = page.locator("#players-area").nth(1);
  await secondPlayer.getByRole("button").first().click();

  // 再び1回目正解（通常スコア）
  await correctButton.click();
  await expect(firstPlayer.getByText("4-0")).toBeVisible(); // 3+1=4
});
```

---

## 10. NomR形式（N○M休）

### 特徴

- N回正解で勝ち抜け
- M回誤答で失格ではなく休み状態
- 休み期間後に復帰可能

### テストシナリオ

#### 10.1 休み状態テスト

```javascript
test("NomR形式 - 休み状態システム", async ({ page }) => {
  await createGame(page, "nomr", "NomRテストゲーム", {
    win_point: 7,
    lose_point: 3,
  });

  const firstPlayer = page.locator("#players-area").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 3回誤答で休み状態
  for (let i = 0; i < 3; i++) {
    await wrongButton.click();
  }

  // 休み表示の確認
  await expect(firstPlayer.getByText(/3休/)).toBeVisible();

  // 3問経過後に復帰することを確認
  // （他のプレイヤーで3問進める）
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "スルー" }).click();
  }

  // 復帰確認
  await expect(firstPlayer.getByRole("button")).not.toBeDisabled();
});
```

---

## 11. NbyN形式

### 特徴

- 正答数と誤答数の積でスコア計算
- 初期値は正答数=0、誤答数=N
- 積がN²に達すると勝ち抜け

### テストシナリオ

#### 11.1 積計算システムテスト

```javascript
test("NbyN形式 - 正答×誤答積計算", async ({ page }) => {
  await createGame(page, "nbyn", "NbyNテストゲーム", {
    win_point: 5, // 5by5 = 25pt勝ち抜け
    lose_point: 5,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 初期状態: 0正答×5誤答=0pt
  await expect(firstPlayer.getByText("0pt")).toBeVisible();

  // 1回正解: 1正答×5誤答=5pt
  await correctButton.click();
  await expect(firstPlayer.getByText("5pt")).toBeVisible();

  // 1回誤答: 1正答×4誤答=4pt
  await wrongButton.click();
  await expect(firstPlayer.getByText("4pt")).toBeVisible();

  // さらに正解を重ねて25pt到達をテスト
  for (let i = 0; i < 4; i++) {
    await correctButton.click();
  }
  // 5正答×4誤答=20pt
  await expect(firstPlayer.getByText("20pt")).toBeVisible();

  // 1回誤答で5正答×3誤答=15pt
  await wrongButton.click();
  await expect(firstPlayer.getByText("15pt")).toBeVisible();
});
```

---

## 12. Nupdown形式

### 特徴

- N回正解で勝ち抜け
- 誤答すると正解数が0にリセット
- 誤答に非常に厳しいルール

### テストシナリオ

#### 12.1 リセットシステムテスト

```javascript
test("Nupdown形式 - 誤答リセット", async ({ page }) => {
  await createGame(page, "nupdown", "Nupdownテストゲーム", {
    win_point: 5,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 4回正解（リーチ状態）
  for (let i = 0; i < 4; i++) {
    await correctButton.click();
  }
  await expect(firstPlayer.getByText("4-")).toBeVisible();

  // 1回誤答で0にリセット
  await wrongButton.click();
  await expect(firstPlayer.getByText("0-1")).toBeVisible();

  // 再び5回正解で勝ち抜け
  for (let i = 0; i < 5; i++) {
    await correctButton.click();
  }
  await expect(firstPlayer.getByTestId("player-score")).toContainText("1st");
});
```

---

## 13. Divide形式

### 特徴

- 初期値10pt、正解で+10pt
- n回目の誤答で現在値をnで割る
- 100pt到達で勝ち抜け

### テストシナリオ

#### 13.1 除算ペナルティテスト

```javascript
test("Divide形式 - 除算ペナルティシステム", async ({ page }) => {
  await createGame(page, "divide", "Divideテストゲーム", {
    win_point: 100,
    correct_me: 10,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 初期値10pt
  await expect(firstPlayer.getByText("10pt")).toBeVisible();

  // 1回正解で20pt
  await correctButton.click();
  await expect(firstPlayer.getByText("20pt")).toBeVisible();

  // 1回目誤答で20÷1=20pt（変化なし）
  await wrongButton.click();
  await expect(firstPlayer.getByText("20pt")).toBeVisible();

  // さらに正解で30pt
  await correctButton.click();
  await expect(firstPlayer.getByText("30pt")).toBeVisible();

  // 2回目誤答で30÷2=15pt
  await wrongButton.click();
  await expect(firstPlayer.getByText("15pt")).toBeVisible();
});
```

---

## 14. Swedish10形式

### 特徴

- 10回正解で勝ち抜け
- 誤答時のダメージが正解数に応じて変動
- 10✕以上で失格

### テストシナリオ

#### 14.1 段階的誤答ペナルティテスト

```javascript
test("Swedish10形式 - 段階的誤答ペナルティ", async ({ page }) => {
  await createGame(page, "swedish10", "Swedish10テストゲーム", {
    win_point: 10,
    lose_point: 10,
  });

  const firstPlayer = page.locator("#players-area").first();
  const correctButton = firstPlayer.getByRole("button").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 0正答時の誤答（1✕）
  await wrongButton.click();
  await expect(firstPlayer.getByText("0-1")).toBeVisible();

  // 2回正解後の誤答（2✕）
  for (let i = 0; i < 2; i++) {
    await correctButton.click();
  }
  await wrongButton.click();
  await expect(firstPlayer.getByText(/2-.*3/)).toBeVisible(); // 1+2=3✕

  // 5回正解後の誤答（3✕）
  for (let i = 0; i < 3; i++) {
    await correctButton.click();
  }
  await wrongButton.click();
  await expect(firstPlayer.getByText(/5-.*6/)).toBeVisible(); // 3+3=6✕
});
```

---

## 15. Attack Survival形式

### 特徴

- 全プレイヤーが初期Nポイント保持
- 正解で他プレイヤーのポイントを減少
- 誤答で自分のポイントが減少

### テストシナリオ

#### 15.1 ポイント減少システムテスト

```javascript
test("AttackSurvival形式 - ポイント減少システム", async ({ page }) => {
  await createGameWithPlayers(
    page,
    "attacksurvival",
    "AttackSurvivalテスト",
    3,
    {
      win_point: 15, // 初期ポイント
      correct_other: -1, // 他者への影響
      wrong_me: -2, // 自分への影響
    }
  );

  // 全プレイヤー初期15pt確認
  for (let i = 0; i < 3; i++) {
    await expect(
      page.locator("#players-area").nth(i).getByText("15pt")
    ).toBeVisible();
  }

  // プレイヤー1が正解（他者-1pt）
  await page
    .locator("#players-area")
    .first()
    .getByRole("button")
    .first()
    .click();

  // プレイヤー1は15pt維持、他は14ptに減少
  await expect(
    page.locator("#players-area").first().getByText("15pt")
  ).toBeVisible();
  await expect(
    page.locator("#players-area").nth(1).getByText("14pt")
  ).toBeVisible();
  await expect(
    page.locator("#players-area").nth(2).getByText("14pt")
  ).toBeVisible();

  // プレイヤー1が誤答（自分-2pt）
  await page
    .locator("#players-area")
    .first()
    .getByRole("button")
    .last()
    .click();
  await expect(
    page.locator("#players-area").first().getByText("13pt")
  ).toBeVisible();
});
```

---

## 16. FreezeX形式

### 特徴

- X回正解で勝ち抜け
- n回目の誤答でn回休み
- NomRとは休み期間の計算が異なる

### テストシナリオ

#### 16.1 段階的休み期間テスト

```javascript
test("FreezeX形式 - 段階的休み期間", async ({ page }) => {
  await createGame(page, "freezex", "FreezeXテストゲーム", {
    win_point: 7,
  });

  const firstPlayer = page.locator("#players-area").first();
  const wrongButton = firstPlayer.getByRole("button").last();

  // 1回目誤答（1休）
  await wrongButton.click();
  await expect(firstPlayer.getByText(/1休/)).toBeVisible();

  // 1問経過で復帰
  await page.getByRole("button", { name: "スルー" }).click();
  await expect(firstPlayer.getByRole("button")).not.toBeDisabled();

  // 2回目誤答（2休）
  await wrongButton.click();
  await expect(firstPlayer.getByText(/2休/)).toBeVisible();

  // 2問経過が必要
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: "スルー" }).click();
  }
  await expect(firstPlayer.getByRole("button")).not.toBeDisabled();
});
```

---

## 17. Endless Chance形式

### 特徴

- 同じ問題に複数人が解答可能
- 正解が出るかスルーまで次の問題に進まない
- use_rオプションで復活機能制御

### テストシナリオ

#### 17.1 継続解答システムテスト

```javascript
test("EndlessChance形式 - 継続解答システム", async ({ page }) => {
  await createGameWithPlayers(
    page,
    "endless-chance",
    "EndlessChanceテスト",
    3,
    {
      win_point: 7,
      lose_point: 3,
      use_r: false,
    }
  );

  const questionBefore = await page
    .locator("[data-testid='question-number']")
    .textContent();

  // プレイヤー1が誤答（問題番号は進まない）
  await page
    .locator("#players-area")
    .first()
    .getByRole("button")
    .last()
    .click();

  const questionAfterWrong = await page
    .locator("[data-testid='question-number']")
    .textContent();
  await expect(questionBefore).toBe(questionAfterWrong);

  // プレイヤー2も誤答（まだ進まない）
  await page.locator("#players-area").nth(1).getByRole("button").last().click();

  const questionAfterWrong2 = await page
    .locator("[data-testid='question-number']")
    .textContent();
  await expect(questionBefore).toBe(questionAfterWrong2);

  // プレイヤー3が正解（ここで問題が進む）
  await page
    .locator("#players-area")
    .nth(2)
    .getByRole("button")
    .first()
    .click();

  const questionAfterCorrect = await page
    .locator("[data-testid='question-number']")
    .textContent();
  await expect(questionAfterCorrect).not.toBe(questionBefore);
});
```

---

## 18. エラーハンドリングテスト

### 各形式共通のエラーテスト

#### 9.1 無効操作の防止テスト

```javascript
test("形式別 - 無効操作防止", async ({ page }) => {
  // 各形式で勝ち抜け後・失格後の操作を無効化

  // NomX形式での勝ち抜け後操作テスト
  await testInvalidOperationAfterWin(page, "nomx");

  // NomX形式での失格後操作テスト
  await testInvalidOperationAfterLose(page, "nomx");
});
```

#### 9.2 データ整合性テスト

```javascript
test("形式別 - データ整合性確認", async ({ page }) => {
  // 各形式でのスコア計算正確性を確認

  for (const rule of AVAILABLE_RULES) {
    await validateScoreCalculation(page, rule);
  }
});
```

---

## 10. パフォーマンステスト

### 形式別パフォーマンス確認

#### 10.1 複雑な計算処理のパフォーマンス

```javascript
test("形式別 - 計算パフォーマンス", async ({ page }) => {
  // SquareX形式での大量操作
  await testCalculationPerformance(page, "squarex", 100);

  // AQL形式での復活処理パフォーマンス
  await testRevivePerformance(page, "aql", 50);

  // Variables形式での複雑計算パフォーマンス
  await testComplexCalculationPerformance(page, "variables", 30);
});
```

---

## 実行優先度と分類

### 高優先度テスト

1. **基本機能テスト**: 各形式の基本的なスコア計算
2. **勝利条件テスト**: 勝ち抜け・失格条件の正確性
3. **特殊機能テスト**: 形式固有の特徴的機能

### 中優先度テスト

1. **UI表示テスト**: レイアウト・色分け・状態表示
2. **操作制限テスト**: 無効操作の防止
3. **エラーハンドリングテスト**: 異常状態での動作

### 低優先度テスト

1. **パフォーマンステスト**: 大量データでの動作確認
2. **アクセシビリティテスト**: キーボード操作・スクリーンリーダー対応
3. **エッジケーステスト**: 境界値での動作確認

---

## テスト実装時の注意点

### 形式固有の設定

- 各形式で必要なパラメータ（win_point、lose_point等）の正確な設定
- 特殊な前提条件（AQLの10人制約等）への対応

### 動的要素の待機

- スコア計算結果の反映待機
- UI状態変更の完了確認
- リアルタイム更新の同期待ち

### データクリーンアップ

- テスト間での状態の独立性確保
- テストデータの適切な削除
- データベースの整合性維持

このドキュメントに基づいて、各ゲーム形式の特徴的な機能を包括的にテストし、オンライン版Score Watcherの品質を保証することができます。
