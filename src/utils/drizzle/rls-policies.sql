-- プロファイルのRLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profile
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" ON profile
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON profile
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can delete their own profile" ON profile
  FOR DELETE USING (auth.uid()::text = id::text);

-- プレイヤーのRLS
ALTER TABLE player ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view player in their profile" ON player
  FOR SELECT USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert player in their profile" ON player
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can update player in their profile" ON player
  FOR UPDATE USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can delete player in their profile" ON player
  FOR DELETE USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

-- プレイヤータグのRLS
ALTER TABLE player_tag ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view player tags through player" ON player_tag
  FOR SELECT USING (player_id IN (
    SELECT id FROM player WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can insert player tags through player" ON player_tag
  FOR INSERT WITH CHECK (player_id IN (
    SELECT id FROM player WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can update player tags through player" ON player_tag
  FOR UPDATE USING (player_id IN (
    SELECT id FROM player WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can delete player tags through player" ON player_tag
  FOR DELETE USING (player_id IN (
    SELECT id FROM player WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

-- ゲームのRLS
ALTER TABLE game ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view games in their profile" ON game
  FOR SELECT USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert games in their profile" ON game
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can update games in their profile" ON game
  FOR UPDATE USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can delete games in their profile" ON game
  FOR DELETE USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

-- ゲームプレイヤーのRLS
ALTER TABLE game_player ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view game player through games" ON game_player
  FOR SELECT USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can insert game player through games" ON game_player
  FOR INSERT WITH CHECK (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can update game player through games" ON game_player
  FOR UPDATE USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can delete game player through games" ON game_player
  FOR DELETE USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

-- ゲームログのRLS
ALTER TABLE game_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view game logs through games" ON game_log
  FOR SELECT USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can insert game logs through games" ON game_log
  FOR INSERT WITH CHECK (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can update game logs through games" ON game_log
  FOR UPDATE USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can delete game logs through games" ON game_log
  FOR DELETE USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

-- クイズセットのRLS
ALTER TABLE quiz_set ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quiz sets in their profile" ON quiz_set
  FOR SELECT USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert quiz sets in their profile" ON quiz_set
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can update quiz sets in their profile" ON quiz_set
  FOR UPDATE USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can delete quiz sets in their profile" ON quiz_set
  FOR DELETE USING (profile_id IN (SELECT id FROM profile WHERE auth.uid()::text = id::text));

-- クイズ問題のRLS
ALTER TABLE quiz_question ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quiz questions through quiz sets" ON quiz_question
  FOR SELECT USING (quiz_set_id IN (
    SELECT id FROM quiz_set WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can insert quiz questions through quiz sets" ON quiz_question
  FOR INSERT WITH CHECK (quiz_set_id IN (
    SELECT id FROM quiz_set WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can update quiz questions through quiz sets" ON quiz_question
  FOR UPDATE USING (quiz_set_id IN (
    SELECT id FROM quiz_set WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can delete quiz questions through quiz sets" ON quiz_question
  FOR DELETE USING (quiz_set_id IN (
    SELECT id FROM quiz_set WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

-- クイズセッションのRLS
ALTER TABLE quiz_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quiz sessions through games" ON quiz_session
  FOR SELECT USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can insert quiz sessions through games" ON quiz_session
  FOR INSERT WITH CHECK (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can update quiz sessions through games" ON quiz_session
  FOR UPDATE USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

CREATE POLICY "Users can delete quiz sessions through games" ON quiz_session
  FOR DELETE USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

-- ゲーム形式別設定テーブルのRLS（nomx）
ALTER TABLE game_nomx_setting ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage nomx settings through games" ON game_nomx_setting
  FOR ALL USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

-- ゲーム形式別設定テーブルのRLS（nomx-ad）
ALTER TABLE game_nomx_ad_setting ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage nomx ad settings through games" ON game_nomx_ad_setting
  FOR ALL USING (game_id IN (
    SELECT id FROM game WHERE profile_id IN (
      SELECT id FROM profile WHERE auth.uid()::text = id::text
    )
  ));

-- 他のゲーム設定テーブルも同様のパターンで設定
-- （簡潔にするため省略していますが、実際にはすべての設定テーブルに適用する必要があります）

-- アクセス制御を簡単にするためのビュー作成
CREATE OR REPLACE VIEW user_accessible_game AS
SELECT g.*
FROM game g
WHERE g.profile_id IN (
  SELECT id FROM profile WHERE auth.uid()::text = id::text
);

CREATE OR REPLACE VIEW user_accessible_player AS
SELECT p.*
FROM player p
WHERE p.profile_id IN (
  SELECT id FROM profile WHERE auth.uid()::text = id::text
);