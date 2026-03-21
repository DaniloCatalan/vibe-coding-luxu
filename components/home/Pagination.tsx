"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-nordic-dark/10 disabled:hover:text-nordic-dark cursor-pointer"
        aria-label="Previous page"
      >
        <span className="material-icons text-sm leading-none">arrow_back</span>
        Prev
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              page === currentPage
                ? "bg-nordic-dark text-white shadow-sm"
                : "text-nordic-muted hover:text-nordic-dark hover:bg-nordic-dark/5 border border-transparent hover:border-nordic-dark/10"
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-nordic-dark/10 disabled:hover:text-nordic-dark cursor-pointer"
        aria-label="Next page"
      >
        Next
        <span className="material-icons text-sm leading-none">arrow_forward</span>
      </button>
    </div>
  );
}
