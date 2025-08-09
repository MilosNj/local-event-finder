"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PaginationControls({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const search = useSearchParams();

  function goTo(page: number) {
    const params = new URLSearchParams(search ? search.toString() : "");
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex items-center gap-4">
      <button
        disabled={!canPrev}
        onClick={() => goTo(currentPage - 1)}
        className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={!canNext}
        onClick={() => goTo(currentPage + 1)}
        className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
