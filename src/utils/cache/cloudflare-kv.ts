/**
 * Cloudflare KV操作ラッパー
 */

/**
 * Cloudflare KVからデータを取得
 */
export const getFromKV = async (key: string): Promise<string | null> => {
  try {
    const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_KV_API_TOKEN;

    if (!namespaceId || !apiToken) {
      console.warn("Cloudflare KV credentials not configured");
      return null;
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${key}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`KV GET failed: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Failed to get from KV: ${key}`, error);
    return null;
  }
};

/**
 * Cloudflare KVにデータを保存
 */
export const putToKV = async (
  key: string,
  value: string,
  ttl?: number
): Promise<boolean> => {
  try {
    const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_KV_API_TOKEN;

    if (!namespaceId || !apiToken) {
      console.warn("Cloudflare KV credentials not configured");
      return false;
    }

    const body = new FormData();
    body.append("value", value);
    if (ttl) {
      body.append("expiration_ttl", ttl.toString());
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${key}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body,
      }
    );

    if (!response.ok) {
      throw new Error(`KV PUT failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to put to KV: ${key}`, error);
    return false;
  }
};

/**
 * Cloudflare KVからデータを削除
 */
export const deleteFromKV = async (key: string): Promise<boolean> => {
  try {
    const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_KV_API_TOKEN;

    if (!namespaceId || !apiToken) {
      console.warn("Cloudflare KV credentials not configured");
      return false;
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${namespaceId}/storage/kv/namespaces/${namespaceId}/values/${key}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error(`KV DELETE failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete from KV: ${key}`, error);
    return false;
  }
};
