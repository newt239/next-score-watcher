/**
 * データをJSONファイルとしてダウンロードさせる
 *
 * @param data JSONに変換するデータ
 * @param fileName 保存するファイル名
 * @param space JSON.stringifyに渡すインデント
 */
export const downloadJson = (data: unknown, fileName: string, space: number | string = 2) => {
  const blob = new Blob([JSON.stringify(data, null, space)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
