"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";

interface PriceHistoryItem {
  _id: string;
  CNG: number;
  DIESEL: number;
  OCTANE: number;
  LPG: number;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function PriceHistoryTable({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [history, setHistory] = useState<PriceHistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchHistory = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/prices?page=${pageNumber}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch price history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page, refreshTrigger]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (pagination && page < pagination.totalPages) setPage(page + 1);
  };

  return (
    <Card className="glass-panel overflow-hidden border-white/70 bg-white/82 px-4">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 pb-6">
        <div className="space-y-1">
          <p className="section-label">Audit log</p>
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
            <History className="h-5 w-5 text-primary" />
            Price update history
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={page === 1 || isLoading}
            className="h-8 w-8 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {pagination?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={
              !pagination || page === pagination.totalPages || isLoading
            }
            className="h-8 w-8 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground">
                  Date & Time
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  CNG (m³)
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Diesel (ltr)
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Octane (ltr)
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  LPG (ltr)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : history.length > 0 ? (
                history.map((record) => (
                  <TableRow key={record._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {format(
                        new Date(record.createdAt),
                        "dd MMM yyyy, hh:mm a",
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-primary">
                      ৳{record.CNG.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#bc954e]">
                      ৳{record.DIESEL.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#d97745]">
                      ৳{record.OCTANE.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#cc6b72]">
                      ৳{record.LPG.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No price history records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
