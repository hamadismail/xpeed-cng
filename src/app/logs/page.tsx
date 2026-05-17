"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { cn } from "@/src/lib/utils";
import { Invoice } from "@/src/modules/invoice";
import { InvoiceData } from "@/src/types";
import { generateInvoiceData } from "@/src/utils/generate-invoice-data";

interface Log {
  _id: string;
  date: string;
  shifts: {
    a: { sale: string };
    b: { sale: string };
    c: { sale: string };
  };
  dieselClosing: string;
  octaneClosing: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null,
  );

  useEffect(() => {
    fetchLogs(pagination.page, date);
  }, [pagination.page, date]);

  const fetchLogs = async (page: number, selectedDate?: Date) => {
    setIsLoading(true);
    const limit = 10;
    let url = `/api/logs?page=${page}&limit=${limit}`;

    if (selectedDate) {
      url += `&date=${selectedDate.toISOString()}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (newDate?: Date) => {
    setDate(newDate);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleShowInvoice = (log: Log) => {
    const invoiceData = generateInvoiceData(log as unknown as InvoiceData);
    setSelectedInvoice(invoiceData);
  };

  const clearDateFilter = () => {
    setDate(undefined);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (selectedInvoice) {
    return (
      <Invoice
        invoiceData={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
      />
    );
  }

  return (
    <div className="page-shell space-y-4">
      <section className="page-hero p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Daily logs
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Station operations archive
              </p>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <DatePicker date={date} onDateChange={handleDateChange} />
            {date && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateFilter}
                className="h-8 rounded-full px-2 text-[10px] font-bold text-destructive hover:bg-destructive/10"
              >
                CLEAR
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 lg:w-auto">
            <TopMetric
              label="Entries"
              value={pagination.total.toLocaleString()}
            />
            <TopMetric
              label="Page"
              value={`${pagination.page}/${pagination.totalPages}`}
            />
            <TopMetric
              label="Selected"
              value={date ? format(date, "dd MMM") : "All"}
            />
          </div>
        </div>
      </section>

      <Card className="p-0 glass-panel border-white/70 bg-white/82 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="h-10 text-center text-[11px] font-bold uppercase tracking-wider">
                    Shift A
                  </TableHead>
                  <TableHead className="h-10 text-center text-[11px] font-bold uppercase tracking-wider">
                    Shift B
                  </TableHead>
                  <TableHead className="h-10 text-center text-[11px] font-bold uppercase tracking-wider">
                    Shift C
                  </TableHead>
                  <TableHead className="h-10 text-center text-[11px] font-bold uppercase tracking-wider">
                    Diesel
                  </TableHead>
                  <TableHead className="h-10 text-center text-[11px] font-bold uppercase tracking-wider">
                    Octane
                  </TableHead>
                  <TableHead className="h-10 text-right text-[11px] font-bold uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={5} />
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <Search className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">
                          No logs found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log._id} className="group hover:bg-muted/30">
                      <TableCell className="py-3 text-sm font-medium">
                        {format(new Date(log.date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="py-3 text-center font-mono">
                        {Number(log.shifts.a.sale).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3 text-center font-mono">
                        {Number(log.shifts.b.sale).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3 text-center font-mono">
                        {Number(log.shifts.c.sale).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3 text-center font-mono text-[#0c7866]">
                        {Number(log.dieselClosing).toLocaleString()}L
                      </TableCell>
                      <TableCell className="py-3 text-center font-mono text-[#bc954e]">
                        {Number(log.octaneClosing).toLocaleString()}L
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Button
                          onClick={() => handleShowInvoice(log)}
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-full bg-primary/5 px-3 text-[11px] font-bold text-primary hover:bg-primary hover:text-white"
                        >
                          <Download className="mr-1 h-3 w-3" />
                          INVOICE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && logs.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/70 p-4">
              <p className="text-[11px] font-medium text-muted-foreground">
                Showing{" "}
                {Math.min(
                  pagination.total,
                  (pagination.page - 1) * pagination.limit + 1,
                )}{" "}
                -{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </p>

              <div className="flex gap-1.5">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full px-3 text-[11px]"
                >
                  <ChevronLeft className="mr-1 h-3 w-3" />
                  Prev
                </Button>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full px-3 text-[11px]"
                >
                  Next
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DatePicker({
  date,
  onDateChange,
}: {
  date: Date | undefined;
  onDateChange: (date?: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 min-w-36 justify-start rounded-lg border-white/50 bg-white/80 px-3 text-left text-[11px] font-bold uppercase tracking-tight",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {date ? format(date, "dd MMM yyyy") : "Filter by date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-xl border-white/80 p-0 shadow-2xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="rounded-xl bg-white p-2"
        />
      </PopoverContent>
    </Popover>
  );
}

function TopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/75 px-3 py-1.5 shadow-sm min-w-20 text-center">
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-bold tracking-tight text-foreground leading-none">
        {value}
      </p>
    </div>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="border-border/60">
          <TableCell className="py-3">
            <Skeleton className="h-4 w-20 rounded-full" />
          </TableCell>
          <TableCell className="py-3">
            <Skeleton className="mx-auto h-4 w-12 rounded-full" />
          </TableCell>
          <TableCell className="py-3">
            <Skeleton className="mx-auto h-4 w-12 rounded-full" />
          </TableCell>
          <TableCell className="py-3">
            <Skeleton className="mx-auto h-4 w-12 rounded-full" />
          </TableCell>
          <TableCell className="py-3">
            <Skeleton className="mx-auto h-4 w-16 rounded-full" />
          </TableCell>
          <TableCell className="py-3">
            <Skeleton className="mx-auto h-4 w-16 rounded-full" />
          </TableCell>
          <TableCell className="py-3 text-right">
            <Skeleton className="ml-auto h-7 w-20 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
