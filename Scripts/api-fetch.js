import CookieManager from "../Managers/CookieManager";

export async function apiFetch(url, options = {}) {
  const token = CookieManager.LoadToken();

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(
        `API ${url} Error: ${response.status} ${response.statusText}`
      );
    }

    if (options.method === "DELETE") {
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(`API ${url} call failed: ${err}`);
    throw err;
  }
}
