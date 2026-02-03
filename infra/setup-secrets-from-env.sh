#!/usr/bin/env bash

set -euo pipefail

PROJECT_ID="${1:-}"

if [[ -z "${PROJECT_ID}" ]]; then
  echo "使い方: $0 PROJECT_ID" >&2
  exit 1
fi

if [[ ! -f ".env.example" ]]; then
  echo ".env.example が見つかりません。リポジトリのルートで実行してください。" >&2
  exit 1
fi

if [[ ! -f ".env" ]]; then
  echo ".env が見つかりません。Secret に登録したい値を .env に記述してください。" >&2
  exit 1
fi

echo "gcloud のプロジェクトを ${PROJECT_ID} に設定します..."
gcloud config set project "${PROJECT_ID}"

# .env を読み込んで環境変数として利用
set -a
# shellcheck disable=SC1091
. .env
set +a

echo ".env.example の一覧に基づいて Secret Manager を更新します..."

while IFS='=' read -r key _; do
  # 空行・コメントをスキップ
  if [[ -z "${key}" ]] || [[ "${key}" == \#* ]]; then
    continue
  fi

  value="${!key-}"

  if [[ -z "${value:-}" ]]; then
    echo "スキップ: ${key} (.env に値がありません)" >&2
    continue
  fi

  if gcloud secrets describe "${key}" >/dev/null 2>&1; then
    echo "既存 Secret ${key} に新しいバージョンを追加します..."
  else
    echo "Secret ${key} を作成します..."
    gcloud secrets create "${key}" --replication-policy="automatic"
  fi

  printf '%s' "${value}" | gcloud secrets versions add "${key}" --data-file=-
done < .env.example

echo "Secret Manager への登録が完了しました。"

