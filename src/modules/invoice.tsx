import type { ComponentType } from "react";
import {
  ArrowLeftIcon,
  CalendarIcon,
  Fuel,
  PrinterIcon,
  ReceiptText,
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

interface InvoiceProps {
  invoiceData: InvoiceData;
  onBack: () => void;
}

export const Invoice = ({ invoiceData, onBack }: InvoiceProps) => {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Xpeed_Invoice_${invoiceData.date.replace(/\//g, "-")}`;

    requestAnimationFrame(() => {
      window.print();
      window.setTimeout(() => {
        document.title = originalTitle;
      }, 300);
    });
  };

  const formatNumber = (value: number): string =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace("BDT", "৳");

  const totalDieselLitres = Object.values(invoiceData.shifts).reduce(
    (sum, shift) => sum + shift.diesel,
    0,
  );
  const totalOctaneLitres = Object.values(invoiceData.shifts).reduce(
    (sum, shift) => sum + shift.octane,
    0,
  );
  const cashSale = invoiceData.dieselOctaneSale - invoiceData.dieselOctaneDue;

  return (
    <div className="page-shell space-y-6 print:max-w-none print:px-0 print:py-0">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-11 rounded-full border-white/80 bg-white/80 px-4"
          size="lg"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to records
        </Button>
        <Button
          onClick={handlePrint}
          className="h-11 rounded-full px-5 shadow-[0_18px_30px_-18px_rgba(9,82,70,0.85)]"
          size="lg"
        >
          <PrinterIcon className="h-4 w-4" />
          Print invoice
        </Button>
      </div>

      <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_100px_-58px_rgba(15,23,42,0.55)] print:rounded-none print:border-0 print:shadow-none">
        <div className="border-b border-border/70 bg-[linear-gradient(135deg,rgba(12,120,102,0.1),rgba(188,149,78,0.12))] px-6 py-6 sm:px-8 print:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between print:flex-col">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <p className="section-label text-primary/70">
                  Xpeed Energy Resources Ltd.
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  Daily station invoice
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Daudkandi, Comilla. Consolidated statement of station
                  activity, fuel sales, and closing balances for the selected
                  day.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-2">
              <InvoiceInfo
                icon={ReceiptText}
                label="Invoice reference"
                value={invoiceData?._id?.toUpperCase() || "N/A"}
              />
              <InvoiceInfo
                icon={CalendarIcon}
                label="Report date"
                value={invoiceData.date}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8 print:p-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3">
            <MetricPanel
              label="Total CNG sale"
              value={formatCurrency(invoiceData.totalCngSale)}
            />
            <MetricPanel
              label="Diesel + octane sale"
              value={formatCurrency(invoiceData.dieselOctaneSale)}
            />
            <MetricPanel
              label="Grand total"
              value={formatCurrency(invoiceData.totalSale)}
            />
          </div>

          <Card className="border-border/70 bg-secondary/35 shadow-none print:break-after-page">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                CNG shift breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-3 print:grid-cols-3">
                {(["a", "b", "c"] as const).map((shift) => (
                  <ShiftCard
                    key={shift}
                    shift={shift}
                    data={invoiceData.shifts[shift]}
                    price={invoiceData.cngPrice}
                    formatNumber={formatNumber}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-3 print:grid-cols-3">
                <SummaryBox
                  label="Sale volume"
                  value={`${formatNumber(invoiceData.totalCngSaleVolume)} m³`}
                />
                <SummaryBox
                  label="EVC volume"
                  value={`${formatNumber(invoiceData.totalCngEvcVolume)} m³`}
                />
                <SummaryBox
                  label="Add volume"
                  value={`${formatNumber(invoiceData.totalCngAddVolume)} m³`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-3 print:grid-cols-3">
            <FuelTypeCard
              title="Diesel"
              price={invoiceData.dieselPrice}
              shifts={invoiceData.shifts}
              totalLitres={totalDieselLitres}
              totalSale={invoiceData.totalDieselSale}
              closingStock={invoiceData.dieselClosing}
              type="diesel"
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
            />
            <FuelTypeCard
              title="Octane"
              price={invoiceData.octanePrice}
              shifts={invoiceData.shifts}
              totalLitres={totalOctaneLitres}
              totalSale={invoiceData.totalOctaneSale}
              closingStock={invoiceData.octaneClosing}
              type="octane"
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
            />
            <FuelTypeCard
              title="LPG"
              price={invoiceData.lpgPrice}
              lpgData={{
                sale: invoiceData.lpg,
                closing: invoiceData.lpgClosing,
              }}
              type="lpg"
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
            />
          </div>

          <Card className="border-border/70 bg-white shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                Financial summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] print:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-3">
                  <SummaryLine
                    label="CNG sales"
                    value={formatCurrency(invoiceData.totalCngSale)}
                  />
                  <SummaryLine
                    label="Diesel sales"
                    value={formatCurrency(invoiceData.totalDieselSale)}
                  />
                  <SummaryLine
                    label="Octane sales"
                    value={formatCurrency(invoiceData.totalOctaneSale)}
                  />
                  <SummaryLine
                    label="LPG amount"
                    value={formatCurrency(invoiceData.lpg)}
                  />
                  <SummaryLine
                    label="Diesel + octane due"
                    value={formatCurrency(invoiceData.dieselOctaneDue)}
                  />
                </div>

                <div className="rounded-[1.6rem] border border-border/70 bg-secondary/40 p-6">
                  <p className="section-label">Cash position</p>
                  <div className="mt-4 space-y-3 text-sm">
                    <KeyValue
                      label="Fuel sale total"
                      value={formatCurrency(invoiceData.dieselOctaneSale)}
                    />
                    <KeyValue
                      label="Outstanding due"
                      value={formatCurrency(invoiceData.dieselOctaneDue)}
                    />
                    <KeyValue
                      label="Cash sale"
                      value={formatCurrency(cashSale)}
                    />
                  </div>
                  <Separator className="my-5" />
                  <p className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                    {formatCurrency(invoiceData.totalSale)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Total net sales including CNG, diesel, octane, and LPG.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 border-t border-border/70 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between print:flex-row print:items-center print:justify-between">
            <p>Generated by the Xpeed CNG station management system.</p>
            <p>© {new Date().getFullYear()} Xpeed Energy Resources Ltd.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function InvoiceInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/80 bg-white/85 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-mono text-sm font-semibold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-secondary/35 p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function ShiftCard({
  shift,
  data,
  price,
  formatNumber,
  formatCurrency,
}: {
  shift: "a" | "b" | "c";
  data: InvoiceData["shifts"][keyof InvoiceData["shifts"]];
  price: number;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <Badge className="rounded-full border-0 bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">
          Shift {shift.toUpperCase()}
        </Badge>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          x {formatNumber(price)}
        </span>
      </div>
      <div className="space-y-3 text-sm">
        <KeyValue label="Sale volume" value={`${formatNumber(data.sale)} m³`} />
        <KeyValue label="EVC volume" value={`${formatNumber(data.evc)} m³`} />
        <KeyValue label="Add volume" value={`${formatNumber(data.add)} m³`} />
        <Separator />
        <KeyValue label="Shift sale" value={formatCurrency(data.taka)} bold />
      </div>
    </div>
  );
}

function FuelTypeCard({
  title,
  price,
  shifts,
  totalLitres,
  totalSale,
  closingStock,
  lpgData,
  type,
  formatNumber,
  formatCurrency,
}: {
  title: string;
  price: number;
  shifts?: InvoiceData["shifts"];
  totalLitres?: number;
  totalSale?: number;
  closingStock?: number;
  lpgData?: { sale: number; closing: number };
  type: "diesel" | "octane" | "lpg";
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
}) {
  const tone =
    type === "diesel"
      ? "bg-[#f2faf7]"
      : type === "octane"
        ? "bg-[#fff8ef]"
        : "bg-[#fff5f5]";

  return (
    <Card className={`border-border/70 ${tone} shadow-none`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between gap-3 text-xl font-semibold tracking-tight text-foreground">
          <span>{title}</span>
          <span className="font-mono text-sm text-muted-foreground">
            x {formatNumber(price)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {shifts
          ? (["a", "b", "c"] as const).map((shift) => {
              const litres =
                type === "diesel" ? shifts[shift].diesel : shifts[shift].octane;
              const pricePer =
                type === "diesel"
                  ? shifts[shift].dieselPrice
                  : shifts[shift].octanePrice;

              return (
                <KeyValue
                  key={shift}
                  label={`Shift ${shift.toUpperCase()}`}
                  value={`${formatNumber(litres)} L (৳${formatNumber(pricePer)})`}
                />
              );
            })
          : null}

        {lpgData ? (
          <KeyValue
            label="Equivalent litres"
            value={`${formatNumber(lpgData.sale / price)} L`}
          />
        ) : null}

        <Separator />

        {totalLitres !== undefined ? (
          <KeyValue
            label="Total litres"
            value={`${formatNumber(totalLitres)} L`}
          />
        ) : null}
        {totalSale !== undefined ? (
          <KeyValue
            label="Total amount"
            value={formatCurrency(totalSale)}
            bold
          />
        ) : (
          <KeyValue
            label="Total amount"
            value={formatCurrency(lpgData?.sale || 0)}
            bold
          />
        )}
        <KeyValue
          label="Closing stock"
          value={`${formatNumber(lpgData?.closing || closingStock || 0)} L`}
        />
      </CardContent>
    </Card>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border/70 bg-white p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-lg font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-secondary/25 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function KeyValue({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          bold
            ? "font-mono font-semibold text-foreground"
            : "font-mono text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
