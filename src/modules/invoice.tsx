import { useRef } from "react";
import { Button } from "../components/ui/button";
import { useReactToPrint } from "react-to-print";
import { InvoiceData } from "../types";
import { CalendarIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";

export const Invoice = ({
  invoiceData,
  onBack,
}: {
  invoiceData: InvoiceData;
  onBack: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `
    @page {
      size: A4;
      margin: 1cm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
      }
      @page {
        /* Remove header and footer */
        margin: 0;
        size: auto;
      }
      /* Hide URL and page info */
      @page :footer {
        display: none;
      }
      @page :header {
        display: none;
      }
    }
  `,
    // removeAfterPrint: true,
    // suppressErrors: true,
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div ref={contentRef} className="bg-white p-8 rounded-lg shadow-lg">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Xpeed CNG</h1>
            <p className="text-muted-foreground">Daily Sales Invoice</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{invoiceData.date}</span>
            </div>
            <Badge variant="secondary" className="mt-2">
              Invoice
            </Badge>
          </div>
        </div>

        {/* CNG Shifts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            CNG Sales
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {(["a", "b", "c"] as const).map((shift) => (
              <div key={shift} className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-3">
                  Shift {shift.toUpperCase()}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sale (m³):</span>
                    <span className="font-medium">
                      {invoiceData.shifts[shift].sale.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>EVC (m³):</span>
                    <span className="font-medium">
                      {invoiceData.shifts[shift].evc.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Add (m³):</span>
                    <span className="font-medium">
                      {invoiceData.shifts[shift].add.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-semibold">Taka:</span>
                    <span className="font-bold">
                      ৳
                      {invoiceData.shifts[shift].taka.toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Sales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Fuel Sales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-3">Diesel</h3>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">
                  ৳
                  {invoiceData.diesel.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-3">Octane</h3>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">
                  ৳
                  {invoiceData.octane.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-3">LPG</h3>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">
                  ৳
                  {invoiceData.lpg.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grand Total */}
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Grand Total</h3>
            <span className="text-2xl font-bold text-primary">
              ৳
              {invoiceData.total.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-sm text-muted-foreground text-center">
          <p>Thank you for your business!</p>
          <p>Xpeed CNG Station • contact@xpeedcng.com</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <Button onClick={onBack} variant="outline">
          Back to Form
        </Button>
        <Button onClick={handlePrint}>Print Invoice</Button>
      </div>
    </div>
  );
};
