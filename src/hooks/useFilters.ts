"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { type PhaseId } from "@/lib/store/projects";

export interface FilterState {
  search: string;
  status: string;
  rm: string;
  phase: string;
  page: number;
  perPage: number;
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "all",
  rm: "mine",
  phase: "all",
  page: 1,
  perPage: 10,
};

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const getInitialFilters = useCallback((): FilterState => {
    return {
      search: searchParams.get("q") || DEFAULT_FILTERS.search,
      status: searchParams.get("status") || DEFAULT_FILTERS.status,
      rm: searchParams.get("rm") || DEFAULT_FILTERS.rm,
      phase: searchParams.get("phase") || DEFAULT_FILTERS.phase,
      page: parseInt(searchParams.get("page") || "1", 10),
      perPage: parseInt(searchParams.get("perPage") || "10", 10),
    };
  }, [searchParams]);

  const [filters, setFiltersState] = useState<FilterState>(getInitialFilters);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Sync with URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("q", debouncedSearch);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.rm !== "mine") params.set("rm", filters.rm);
    if (filters.phase !== "all") params.set("phase", filters.phase);
    if (filters.page > 1) params.set("page", filters.page.toString());
    if (filters.perPage !== 10) params.set("perPage", filters.perPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, filters.status, filters.rm, filters.phase, filters.page, filters.perPage, pathname, router]);

  // Update individual filter
  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFiltersState((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Reset page when changing filters (except page itself)
      if (key !== "page" && key !== "perPage") {
        newFilters.page = 1;
      }
      return newFilters;
    });
  }, []);

  // Update multiple filters at once
  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      // Reset page if any filter other than pagination changed
      page: "page" in newFilters ? (newFilters.page ?? prev.page) : 1,
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.status !== "all" ||
      filters.rm !== "mine" ||
      filters.phase !== "all"
    );
  }, [filters]);

  return {
    filters: {
      ...filters,
      search: debouncedSearch, // Use debounced value for filtering
    },
    rawSearch: filters.search, // Use raw value for input
    setFilter,
    setFilters,
    resetFilters,
    hasActiveFilters,
  };
}

// Helper to paginate an array
export function paginate<T>(items: T[], page: number, perPage: number): {
  items: T[];
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
} {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalItems);

  return {
    items: items.slice(startIndex, endIndex),
    totalPages,
    totalItems,
    startIndex: startIndex + 1,
    endIndex,
  };
}
