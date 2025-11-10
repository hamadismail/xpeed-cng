import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  CalendarIcon,
  PrinterIcon,
  ArrowLeftIcon,
  Building2,
  Receipt,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

import { InvoiceData } from "../types";
import { PRICES } from "../utils/constans";

interface InvoiceProps {
  invoiceData: InvoiceData;
  onBack: () => void;
}

export const Invoice = ({ invoiceData, onBack }: InvoiceProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Xpeed_Invoice_${invoiceData.date.replace(/\//g, "-")}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.2in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .print-break {
          page-break-inside: avoid;
        }
      }
    `,
  });

  // Format currency with Bangladeshi Taka symbol
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace("BDT", "৳");
  };

  // Calculate totals
  const totalDieselLitres = Object.values(invoiceData.shifts).reduce(
    (sum, shift) => sum + shift.diesel,
    0
  );

  const totalOctaneLitres = Object.values(invoiceData.shifts).reduce(
    (sum, shift) => sum + shift.octane,
    0
  );

  const invoiceNumber = `XP${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Buttons - Hidden during print */}
        <div className="no-print flex justify-between items-center mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="gap-2 hover:shadow-md transition-all duration-200"
            size="lg"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Records
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handlePrint}
              className="gap-2 hover:shadow-lg transition-all duration-200 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <PrinterIcon className="h-4 w-4" />
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Container */}
        <div
          ref={contentRef}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-0"
        >
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 print:bg-primary">
            <div className="flex justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Xpeed Energy Resources Ltd.
                  </h1>
                  <p className="text-primary-foreground/90 mt-1 text-sm">
                    Daudkandi, Comilla • +880 000 0000000
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-white text-primary mb-2 font-semibold"
                  >
                    <Receipt className="h-2 w-2 mr-1" />
                    DAILY SALES INVOICE
                  </Badge>
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <CalendarIcon className="h-3 w-3" />
                    <span className="font-semibold">{invoiceData.date}</span>
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    Invoice #: {invoiceNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* CNG Sales Section */}
            <Card className="print-break border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl text-blue-900">
                  <div className="w-2 h-6 bg-blue-500 rounded-full" />
                  CNG Sales Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(["a", "b", "c"] as const).map((shift) => (
                    <ShiftCard
                      key={shift}
                      shift={shift}
                      data={invoiceData.shifts[shift]}
                      price={PRICES.CNG}
                      type="cng"
                    />
                  ))}
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <MetricItem
                      label="Total Sale Volume"
                      value={`${invoiceData.totalCngSaleVolume.toFixed(2)} m³`}
                      className="text-blue-700"
                    />
                    <MetricItem
                      label="Total EVC Volume"
                      value={`${invoiceData.totalCngEvcVolume.toFixed(2)} m³`}
                      className="text-blue-700"
                    />
                    <MetricItem
                      label="Total Add Volume"
                      value={`${invoiceData.totalCngAddVolume.toFixed(2)} m³`}
                      className="text-blue-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fuel Sales Section */}
            <Card className="print-break border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl text-green-900">
                  <div className="w-2 h-6 bg-green-500 rounded-full" />
                  Fuel Sales Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <FuelTypeCard
                    title="Diesel Sales"
                    price={PRICES.DIESEL}
                    shifts={invoiceData.shifts}
                    totalLitres={totalDieselLitres}
                    totalSale={invoiceData.totalDieselSale}
                    closingStock={invoiceData.dieselClosing}
                    type="diesel"
                  />

                  <FuelTypeCard
                    title="Octane Sales"
                    price={PRICES.OCTANE}
                    shifts={invoiceData.shifts}
                    totalLitres={totalOctaneLitres}
                    totalSale={invoiceData.totalOctaneSale}
                    closingStock={invoiceData.octaneClosing}
                    type="octane"
                  />

                  <FuelTypeCard
                    title="LPG Sales"
                    price={PRICES.LPG}
                    lpgData={{
                      sale: invoiceData.lpg,
                      closing: invoiceData.lpgClosing,
                    }}
                    type="lpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary Section */}
            <Card className="print-break border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-purple-900">
                  <div className="w-2 h-6 bg-purple-500 rounded-full" />
                  Daily Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {/* Sales Breakdown */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg text-gray-900">
                      Sales Breakdown
                    </h4>
                    <div className="space-y-3">
                      <SummaryItem
                        label="CNG Sales"
                        value={invoiceData.totalCngSale}
                        formatCurrency={formatCurrency}
                        className="border-l-4 border-l-blue-400"
                      />
                      <SummaryItem
                        label="Diesel Sales"
                        value={invoiceData.totalDieselSale}
                        formatCurrency={formatCurrency}
                        className="border-l-4 border-l-green-400"
                      />
                      <SummaryItem
                        label="Octane Sales"
                        value={invoiceData.totalOctaneSale}
                        formatCurrency={formatCurrency}
                        className="border-l-4 border-l-orange-400"
                      />
                      <SummaryItem
                        label="LPG Sales"
                        value={invoiceData.lpg}
                        formatCurrency={formatCurrency}
                        className="border-l-4 border-l-red-400"
                      />
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-primary">
                        Grand Total
                      </h4>
                      <p className="text-muted-foreground">Net Daily Sales</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Diesel/Octane Sale:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            invoiceData.dieselOctaneSale +
                              invoiceData.dieselOctaneDue
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Diesel/Octane Due:
                        </span>
                        <span className="font-medium text-amber-600">
                          {formatCurrency(invoiceData.dieselOctaneDue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Cash Sale:
                        </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(
                            invoiceData.dieselOctaneSale -
                              invoiceData.dieselOctaneDue
                          )}
                        </span>
                      </div>
                      <Separator />
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatCurrency(invoiceData.totalSale)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total net sales including all fuel types
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center gap-4 text-center md:text-left">
                <div className="text-muted-foreground">
                  <p className="font-medium">
                    Generated by Xpeed CNG Station Management System
                  </p>
                  <p>Email: info@xpeedcng.com • Website: www.xpeedcng.com</p>
                </div>

                <div className="text-muted-foreground">
                  <p className="font-medium">Thank you for your business!</p>
                  <p>
                    © {new Date().getFullYear()} Xpeed Energy Resources Ltd. All
                    rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Supporting Components
interface ShiftCardProps {
  shift: "a" | "b" | "c";
  data: InvoiceData["shifts"][keyof InvoiceData["shifts"]];
  price: number;
  type: "cng";
}

const ShiftCard = ({ shift, data, price }: ShiftCardProps) => (
  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
      <Badge
        variant="outline"
        className="bg-primary text-primary-foreground font-semibold"
      >
        {shift.toUpperCase()} SHIFT
      </Badge>
      <span className="text-sm font-medium text-slate-600">Details</span>
    </div>

    <div className="space-y-2 text-sm">
      <MetricRow label="Sale Volume:" value={`${data.sale.toFixed(2)} m³`} />
      <MetricRow label="EVC Volume:" value={`${data.evc.toFixed(2)} m³`} />
      <MetricRow label="Add Volume:" value={`${data.add.toFixed(2)} m³`} />

      <Separator className="my-3" />

      <div className="bg-white rounded-lg p-3 border border-slate-100">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-700">CNG Sales:</span>
          <span className="text-xs text-slate-500">(x{price})</span>
        </div>
        <div className="text-lg font-bold text-primary mt-1">
          {new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
          })
            .format(data.taka)
            .replace("BDT", "৳")}
        </div>
      </div>
    </div>
  </div>
);

interface FuelTypeCardProps {
  title: string;
  price: number;
  shifts?: InvoiceData["shifts"];
  totalLitres?: number;
  totalSale?: number;
  closingStock?: number;
  lpgData?: { sale: number; closing: number };
  type: "diesel" | "octane" | "lpg";
}

const FuelTypeCard = ({
  title,
  price,
  shifts,
  totalLitres,
  totalSale,
  closingStock,
  lpgData,
  type,
}: FuelTypeCardProps) => {
  const colorMap = {
    diesel: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    },
    octane: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
    },
    lpg: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  };

  const colors = colorMap[type];

  return (
    <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
      <h3 className="font-semibold mb-3 pb-2 border-b border-slate-200 flex items-center gap-2">
        <span className={colors.text}>{title}</span>
        <span className="text-xs text-slate-500">(x{price})</span>
      </h3>

      <div className="space-y-2">
        {shifts &&
          (["a", "b", "c"] as const).map((shift) => {
            if (type === "lpg") {
              // LPG does not exist on per-shift data structure; show placeholder
              return (
                <div
                  key={shift}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-slate-600">
                    Shift {shift.toUpperCase()}:
                  </span>
                  <span className="font-medium">-</span>
                </div>
              );
            }

            // Narrow type to diesel | octane so we can safely access fields
            const litres =
              type === "diesel" ? shifts[shift].diesel : shifts[shift].octane;
            const pricePer =
              type === "diesel"
                ? shifts[shift].dieselPrice
                : shifts[shift].octanePrice;

            return (
              <div
                key={shift}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-600">
                  Shift {shift.toUpperCase()}:
                </span>
                <span className="font-medium">
                  {litres.toFixed(2)} L
                  <span className="ml-2 text-xs text-slate-500">
                    (৳{pricePer.toLocaleString()})
                  </span>
                </span>
              </div>
            );
          })}

        {lpgData && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Total Sale:</span>
            <span className="font-medium">
              {(lpgData.sale / price).toFixed(2)} L
            </span>
          </div>
        )}

        <Separator className="my-3" />

        <div className="space-y-2 text-sm">
          {totalLitres !== undefined && (
            <MetricRow
              label="Total Litres:"
              value={`${totalLitres.toFixed(2)} L`}
            />
          )}
          {totalSale !== undefined && (
            <MetricRow
              label="Total Amount:"
              value={new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
              })
                .format(totalSale)
                .replace("BDT", "৳")}
              className="font-bold text-lg"
            />
          )}
          <MetricRow
            label="Closing Stock:"
            value={`${(lpgData?.closing || closingStock || 0).toFixed(2)} L`}
            className="text-slate-500"
          />
        </div>
      </div>
    </div>
  );
};

// Utility Components
const MetricRow = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-600">{label}</span>
    <span className={`font-medium ${className}`}>{value}</span>
  </div>
);

const MetricItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div>
    <p className="text-sm text-slate-600 mb-1">{label}</p>
    <p className={`font-bold ${className}`}>{value}</p>
  </div>
);

const SummaryItem = ({
  label,
  value,
  formatCurrency,
  className = "",
}: {
  label: string;
  value: number;
  formatCurrency: (value: number) => string;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-lg p-3 border border-slate-100 ${className}`}
  >
    <div className="flex justify-between items-center">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="font-bold text-slate-900">{formatCurrency(value)}</span>
    </div>
  </div>
);
