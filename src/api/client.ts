import type { Genre, Product } from "@/types";

const BASE = "/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function getProducts(): Promise<Product[]> {
  return fetchJson<Product[]>("/products");
}

export function getProduct(id: string): Promise<Product> {
  return fetchJson<Product>(`/products/${id}`);
}

export function getGenres(): Promise<Genre[]> {
  return fetchJson<Genre[]>("/genres");
}
