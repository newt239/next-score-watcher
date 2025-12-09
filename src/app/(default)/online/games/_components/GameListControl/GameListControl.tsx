"use client";

import { Group, NativeSelect, SegmentedControl } from "@mantine/core";
import { useQueryState } from "nuqs";

/**
 * ゲーム一覧の表示制御コンポーネント
 * @returns ゲーム一覧の表示制御UI
 */
const GameListControl: React.FC = () => {
  const [displayMode, setDisplayMode] = useQueryState("display", {
    defaultValue: "grid",
  });
  const [orderType, setOrderType] = useQueryState("order", {
    defaultValue: "last_open",
  });

  return (
    <Group justify="end" mb="lg" gap="md">
      <SegmentedControl
        value={displayMode}
        onChange={(v) => setDisplayMode(v)}
        data={[
          { value: "grid", label: "グリッド" },
          { value: "table", label: "テーブル" },
        ]}
      />
      <NativeSelect value={orderType} onChange={(e) => setOrderType(e.target.value)}>
        <option value="last_open">最終更新順</option>
        <option value="name">ゲーム名順</option>
      </NativeSelect>
    </Group>
  );
};

export default GameListControl;
