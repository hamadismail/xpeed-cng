"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Search,
} from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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
    <div className="page-shell space-y-8">
      <section className="page-hero">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="section-label">Archive and invoice history</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Daily logs designed for fast review and clean retrieval.
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Filter records by date, inspect each shift summary, and open
              print-ready invoices without losing context.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <TopMetric
              label="Total records"
              value={pagination.total.toLocaleString()}
            />
            <TopMetric
              label="Current page"
              value={`${pagination.page}/${pagination.totalPages}`}
            />
            <TopMetric
              label="Date filter"
              value={date ? format(date, "dd MMM") : "All"}
            />
          </div>
        </div>
      </section>

      <Card className="glass-panel border-white/70 bg-white/82">
        <CardHeader className="gap-5 border-b border-border/70 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                Report register
              </CardTitle>
              <CardDescription className="max-w-xl text-sm leading-6">
                Browse all station entries and move directly into invoice mode
                when you need a printable daily summary.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {date && (
                <Badge
                  variant="secondary"
                  className="rounded-full border border-border/60 bg-secondary/80 px-4 py-2 text-foreground"
                >
                  {format(date, "MMM dd, yyyy")}
                  <button
                    onClick={clearDateFilter}
                    className="ml-2 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Clear date filter"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <DatePicker date={date} onDateChange={handleDateChange} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-white">
            <Table>
              <TableHeader className="bg-secondary/70">
                <TableRow className="border-border/70 hover:bg-secondary/70">
                  <TableHead className="py-4 font-semibold">Date</TableHead>
                  <TableHead className="py-4 text-center font-semibold">
                    Shift A
                  </TableHead>
                  <TableHead className="py-4 text-center font-semibold">
                    Shift B
                  </TableHead>
                  <TableHead className="py-4 text-center font-semibold">
                    Shift C
                  </TableHead>
                  <TableHead className="py-4 text-center font-semibold">
                    Diesel Stock
                  </TableHead>
                  <TableHead className="py-4 text-center font-semibold">
                    Octane Stock
                  </TableHead>
                  <TableHead className="py-4 text-center font-semibold">
                    Invoice
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={6} />
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-72">
                      <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                          {date ? (
                            <Search className="h-7 w-7" />
                          ) : (
                            <FileText className="h-7 w-7" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-foreground">
                            No logs found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {date
                              ? "Try another date to locate the required report."
                              : "Records will appear here once daily entries are created."}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow
                      key={log._id}
                      className="border-border/60 hover:bg-secondary/35"
                    >
                      <TableCell className="py-4 font-medium text-foreground">
                        {format(new Date(log.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="py-4 text-center font-mono text-sm text-foreground/85">
                        {Number(log.shifts.a.sale).toLocaleString()} m³
                      </TableCell>
                      <TableCell className="py-4 text-center font-mono text-sm text-foreground/85">
                        {Number(log.shifts.b.sale).toLocaleString()} m³
                      </TableCell>
                      <TableCell className="py-4 text-center font-mono text-sm text-foreground/85">
                        {Number(log.shifts.c.sale).toLocaleString()} m³
                      </TableCell>
                      <TableCell className="py-4 text-center font-mono text-sm text-[#0c7866]">
                        {Number(log.dieselClosing).toLocaleString()} L
                      </TableCell>
                      <TableCell className="py-4 text-center font-mono text-sm text-[#bc954e]">
                        {Number(log.octaneClosing).toLocaleString()} L
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center">
                          <Button
                            onClick={() => handleShowInvoice(log)}
                            className="rounded-full px-4"
                            size="sm"
                          >
                            <Download className="h-4 w-4" />
                            Open
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && logs.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total.toLocaleString()} entries
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  variant="outline"
                  className="rounded-full border-white/80 bg-white/80 px-4"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  variant="outline"
                  className="rounded-full border-white/80 bg-white/80 px-4"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
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
          className={cn(
            "h-11 min-w-55 justify-start rounded-full border-white/80 bg-white/80 px-4 text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4" />
          {date ? format(date, "PPP") : "Filter by report date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-[1.25rem] border-white/80 p-0"
        align="end"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="rounded-[1.25rem] bg-white p-3"
        />
      </PopoverContent>
    </Popover>
  );
}

function TopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.55)]">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
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
          <TableCell className="py-4">
            <Skeleton className="h-5 w-28 rounded-full" />
          </TableCell>
          <TableCell className="py-4">
            <Skeleton className="mx-auto h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell className="py-4">
            <Skeleton className="mx-auto h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell className="py-4">
            <Skeleton className="mx-auto h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell className="py-4">
            <Skeleton className="mx-auto h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell className="py-4">
            <Skeleton className="mx-auto h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell className="py-4">
            <Skeleton className="mx-auto h-9 w-24 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
