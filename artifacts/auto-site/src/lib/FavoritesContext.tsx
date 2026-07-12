import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const STORAGE_KEY = "bovaja_favorites";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

interface FavoritesCtx {
  favorites: Set<string>;
  toggle: (id: string) => void;
  isFavorited: (id: string) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesCtx>({
  favorites: new Set(),
  toggle: () => {},
  isFavorited: () => false,
  count: 0,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(readFavorites);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorited = useCallback((id: string) => favorites.has(id), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorited, count: favorites.size }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
