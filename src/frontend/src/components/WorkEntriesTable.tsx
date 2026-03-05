import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { WorkEntry } from "../backend";
import { useGetPaginatedEntries, useSearchEntries } from "../hooks/useQueries";

interface WorkEntriesTableProps {
  totalEarnings: number;
  totalWithdrawn: number;
}

export default function WorkEntriesTable({
  totalEarnings,
  totalWithdrawn,
}: WorkEntriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const paginatedQuery = useGetPaginatedEntries(currentPage);
  const searchResultsQuery = useSearchEntries(debouncedSearch);

  const isSearching = debouncedSearch.trim().length > 0;

  const entries: WorkEntry[] = isSearching
    ? (searchResultsQuery.data ?? [])
    : (paginatedQuery.data?.entries ?? []);

  const totalEntries = isSearching
    ? entries.length
    : Number(paginatedQuery.data?.totalEntries ?? 0);

  const totalPages = isSearching
    ? 1
    : Number(paginatedQuery.data?.totalPages ?? 1);

  const isLoading = isSearching
    ? searchResultsQuery.isLoading
    : paginatedQuery.isLoading;

  const pageSize = 6;
  const startIndex = isSearching ? 1 : (currentPage - 1) * pageSize + 1;
  const endIndex = isSearching
    ? entries.length
    : Math.min(currentPage * pageSize, totalEntries);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  // Generate page numbers to show (max 5 around current)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Row ocid map for first 6 rows
  const rowOcids = [
    "table.row.1",
    "table.row.2",
    "table.row.3",
    "table.row.4",
    "table.row.5",
    "table.row.6",
  ];

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
      {/* Header row with earnings summary + search */}
      <div className="px-4 pt-4 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-body font-semibold text-foreground">
            Total Earnings:{" "}
            <span className="text-primary font-bold">
              ₹{totalEarnings.toLocaleString("en-IN")}
            </span>
          </span>
          <span className="text-sm font-body text-muted-foreground">|</span>
          <span className="text-sm font-body font-semibold text-foreground">
            Total Withdrawn:{" "}
            <span className="text-success font-bold">
              ₹{totalWithdrawn.toLocaleString("en-IN")} ✓
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              data-ocid="table.search_input"
              placeholder="Search project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button
            data-ocid="table.filter_button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div data-ocid="table.list" className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-12">
                No.
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Project Name
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Entry Type
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Earnings (₹)
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              ["r1", "r2", "r3", "r4", "r5", "r6"].map((k) => (
                <TableRow key={k}>
                  <TableCell>
                    <Skeleton className="h-4 w-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  {isSearching
                    ? `No entries found for "${debouncedSearch}"`
                    : "No work entries yet."}
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry, index) => (
                <TableRow
                  key={Number(entry.id)}
                  data-ocid={rowOcids[index] ?? `table.row.${index + 1}`}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-sm font-body font-medium text-muted-foreground">
                    {isSearching
                      ? index + 1
                      : (currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="text-sm font-body text-foreground whitespace-nowrap">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell className="text-sm font-body font-semibold text-foreground max-w-[180px] truncate">
                    {entry.projectName}
                  </TableCell>
                  <TableCell className="text-sm font-body text-muted-foreground whitespace-nowrap">
                    {entry.entryType}
                  </TableCell>
                  <TableCell className="text-sm font-body font-bold text-right text-primary">
                    ₹{Number(entry.earnings).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold bg-green-50 text-green-700 border-green-200 rounded-full px-2.5 py-0.5 whitespace-nowrap"
                    >
                      ● {entry.status || "Completed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isSearching && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs font-body text-muted-foreground">
            {totalEntries === 0
              ? "No entries"
              : `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`}
          </p>
          <div className="flex items-center gap-1">
            <Button
              data-ocid="pagination.pagination_prev"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage <= 1 || isLoading}
              onClick={handlePrev}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                data-ocid="pagination.tab"
                variant={pageNum === currentPage ? "default" : "outline"}
                size="icon"
                className="h-7 w-7 text-xs font-bold"
                onClick={() => setCurrentPage(pageNum)}
                disabled={isLoading}
              >
                {pageNum}
              </Button>
            ))}

            <Button
              data-ocid="pagination.pagination_next"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={currentPage >= totalPages || isLoading}
              onClick={handleNext}
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
