import { describe, expect, it } from "vitest";

import { normalizeSearchText } from "@/utils/functions";

describe("normalizeSearchText", () => {
  it("大文字小文字を統一する", () => {
    expect(normalizeSearchText("NewYork")).toBe(normalizeSearchText("newyork"));
  });

  it("全角英数字を半角に揃える", () => {
    expect(normalizeSearchText("ＮＹ２５")).toBe(normalizeSearchText("ny25"));
  });

  it("ひらがなとカタカナを統一する", () => {
    expect(normalizeSearchText("にゅーよーく")).toBe(normalizeSearchText("ニューヨーク"));
  });

  it("○✕記号のゆれを吸収する", () => {
    expect(normalizeSearchText("7○3✕")).toBe(normalizeSearchText("7o3x"));
    expect(normalizeSearchText("N◯M×")).toBe(normalizeSearchText("nomx"));
  });

  it("空白や中黒を除去する", () => {
    expect(normalizeSearchText("アタック 25")).toBe(normalizeSearchText("アタック25"));
    expect(normalizeSearchText("エヌ・マル")).toBe(normalizeSearchText("エヌマル"));
  });
});
