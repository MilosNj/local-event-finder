"use client";

import { useFavorites } from "~/hooks/useFavorites";

export function FavoriteToggle({ slug }: { slug: string }) {
  const { isReady, isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={!isReady}
      aria-pressed={active}
      className={`inline-flex items-center rounded-md border px-3 py-2 text-sm transition-colors ${
        active ? "border-yellow-300 bg-yellow-100" : "hover:bg-gray-50"
      }`}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      {active ? "★ Favorited" : "☆ Add to favorites"}
    </button>
  );
}
