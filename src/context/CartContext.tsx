import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { effectiveUnitPrice } from "@/lib/pricing";
import type { CartLine, Product } from "@/types";

interface CartContextValue {
  lines: CartLine[];
  /** Returns true if at least one unit was added; false if at stock limit or out of stock. */
  addItem: (product: Product, quantity?: number) => boolean;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  /** Same as subtotal until shipping/fees exist elsewhere. */
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    let added = false;
    setLines((prev) => {
      const max = product.stockQuantity;
      if (max <= 0) return prev;

      const idx = prev.findIndex((l) => l.product.id === product.id);
      const current = idx === -1 ? 0 : prev[idx].quantity;
      const room = max - current;
      const toAdd = Math.min(quantity, room);
      if (toAdd <= 0) return prev;

      added = true;
      if (idx === -1) {
        return [...prev, { product, quantity: toAdd }];
      }
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        product,
        quantity: current + toAdd,
      };
      return next;
    });
    return added;
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId);
        return;
      }
      setLines((prev) => {
        const line = prev.find((l) => l.product.id === productId);
        if (!line) return prev;
        const max = line.product.stockQuantity;
        const q = Math.min(quantity, max);
        return prev.map((l) =>
          l.product.id === productId ? { ...l, quantity: q } : l,
        );
      });
    },
    [removeItem],
  );

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce(
      (sum, l) => sum + effectiveUnitPrice(l.product) * l.quantity,
      0,
    );
    return {
      lines,
      addItem,
      removeItem,
      setQuantity,
      clear,
      itemCount,
      subtotal,
      total: subtotal,
    };
  }, [lines, addItem, removeItem, setQuantity, clear]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
