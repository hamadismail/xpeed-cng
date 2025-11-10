"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";

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
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

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
      if (!response.ok) throw new Error('Failed to fetch logs');

      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      // TODO: Implement toast notification for error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (newDate?: Date) => {
    setDate(newDate);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleShowInvoice = (log: Log) => {
    const invoiceData = generateInvoiceData(log as unknown as InvoiceData);
    setSelectedInvoice(invoiceData);
  };

  const clearDateFilter = () => {
    setDate(undefined);
    setPagination(prev => ({ ...prev, page: 1 }));
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Daily Logs
          </h1>
          <p className="text-muted-foreground">
            View and manage daily sales reports and invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          {date && (
            <Badge variant="secondary" className="gap-1">
              {format(date, "MMM dd, yyyy")}
              <button
                onClick={clearDateFilter}
                className="ml-1 hover:text-destructive transition-colors"
                aria-label="Clear date filter"
              >
                ×
              </button>
            </Badge>
          )}

          <DatePicker date={date} onDateChange={handleDateChange} />
        </div>
      </div>

      {/* Logs Table Card */}
      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Sales Records</CardTitle>
              <CardDescription>
                {pagination.total} total records found
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-center">Shift A</TableHead>
                  <TableHead className="font-semibold text-center">Shift B</TableHead>
                  <TableHead className="font-semibold text-center">Shift C</TableHead>
                  <TableHead className="font-semibold text-center">Diesel Stock</TableHead>
                  <TableHead className="font-semibold text-center">Octane Stock</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={5} />
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 opacity-20" />
                        <p className="text-lg font-medium">No logs found</p>
                        <p className="text-sm">
                          {date ? 'Try selecting a different date' : 'No records available'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow
                      key={log._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {format(new Date(log.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-center text-foreground/80">
                        {Number(log.shifts.a.sale).toLocaleString()} m³
                      </TableCell>
                      <TableCell className="text-center text-foreground/80">
                        {Number(log.shifts.b.sale).toLocaleString()} m³
                      </TableCell>
                      <TableCell className="text-center text-foreground/80">
                        {Number(log.shifts.c.sale).toLocaleString()} m³
                      </TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">
                        {Number(log.dieselClosing).toLocaleString()} L
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {Number(log.octaneClosing).toLocaleString()} L
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            onClick={() => handleShowInvoice(log)}
                            size="sm"
                            className="gap-2 hover:shadow-md transition-all"
                          >
                            <Download className="h-4 w-4" />
                            Invoice
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && logs.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total.toLocaleString()} entries
          </p>

          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              variant="outline"
              className="min-w-[100px]"
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              variant="outline"
              className="min-w-[100px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Date Picker Component
interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date?: Date) => void;
}

function DatePicker({ date, onDateChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4" />
          {date ? format(date, "PPP") : "Filter by date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}

// Table Skeleton Component
interface TableSkeletonProps {
  rows: number;
}

function TableSkeleton({ rows }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-20 mx-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
