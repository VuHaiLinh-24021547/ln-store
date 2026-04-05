import type { Product, User } from "@/types";

const BASE = "/api";

async function parseError(res: Response): Promise<string> {
  try {
    const t = await res.text();
    return t || `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

export async function createProduct(body: Product): Promise<Product> {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<Product>;
}

export async function updateProduct(
  id: string,
  body: Product,
): Promise<Product> {
  const res = await fetch(`${BASE}/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<Product>;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE}/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<User[]>;
}

export async function updateUser(id: string, body: User): Promise<User> {
  const res = await fetch(`${BASE}/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<User>;
}
