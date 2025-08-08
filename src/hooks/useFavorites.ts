"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "lef:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[] | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
        setFavorites(parsed);
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  const add = useCallback((slug: string) => {
    setFavorites((prev) => {
      const current = prev ?? [];
      if (current.includes(slug)) return current;
      const next = [...current, slug];
      try {
        if (typeof window !== "undefined")
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setFavorites((prev) => {
      const current = prev ?? [];
      const next = current.filter((s) => s !== slug);
      try {
        if (typeof window !== "undefined")
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const current = prev ?? [];
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      try {
        if (typeof window !== "undefined")
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (slug: string) => {
      return (favorites ?? []).includes(slug);
    },
    [favorites],
  );

  return useMemo(
    () => ({
      favorites: favorites ?? [],
      isReady: favorites !== null,
      add,
      remove,
      toggle,
      isFavorite,
    }),
    [favorites, add, remove, toggle, isFavorite],
  );
}
