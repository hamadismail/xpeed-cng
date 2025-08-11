import { useRef } from "react";
import { Button } from "../components/ui/button";
import { useReactToPrint } from "react-to-print";
import { InvoiceData } from "../types";
import { CalendarIcon, PrinterIcon, ArrowLeftIcon } from "lucide-react";
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
          margin: 0;
          size: auto;
        }
        @page :footer { display: none; }
        @page :header { display: none; }
      }
    `,
  });

  // Format currency with Bangladeshi Taka symbol
  const formatCurrency = (value: number) => {
    return value
      .toLocaleString("en-IN", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div
        ref={contentRef}
        className="bg-white p-8 rounded-lg shadow-xl border border-gray-100"
      >
        {/* Invoice Header */}
        <div className="flex sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-primary">
                Xpeed Energy Resources Ltd.
              </h1>
              <Badge variant="secondary" className="text-xs">
                Daily Sales Invoice
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Daudkandi, Comilla
            </p>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <div className="flex text-sm items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">{invoiceData.date}</span>
            </div>
            <div className="mt-2 text-xs">
              <p>Invoice #: {Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>
        </div>

        {/* CNG Shifts Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            CNG Sales Breakdown
          </h2>

          <div className="grid sm:grid-cols-3 gap-2 mb-4">
            {(["a", "b", "c"] as const).map((shift) => (
              <div
                key={shift}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h3 className="font-medium mb-2 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {shift.toUpperCase()}
                  </span>
                  <span>Shift Details</span>
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sale Volume:</span>
                    <span className="font-medium">
                      {invoiceData.shifts[shift].sale.toFixed(2)} m³
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">EVC Volume:</span>
                    <span className="font-medium">
                      {invoiceData.shifts[shift].evc.toFixed(2)} m³
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Add Volume:</span>
                    <span className="font-medium">
                      {invoiceData.shifts[shift].add.toFixed(2)} m³
                    </span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold">CNG Sales:</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(invoiceData.shifts[shift].taka)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex justify-center items-center gap-4">
              <span className="font-bold text-blue-900">
                Total Sale {invoiceData.totalCngSaleVolume} m³ |
              </span>
              <span className="font-bold text-blue-900">
                Total Evc {invoiceData.totalCngEvcVolume} m³ |
              </span>
              <span className="font-bold text-blue-900">
                Total Add {invoiceData.totalCngAddVolume} m³
              </span>
            </div>
          </div>
        </div>

        {/* Fuel Sales Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Fuel Sales Breakdown
          </h2>

          <div className="grid sm:grid-cols-3 gap-2 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-4 pb-2 border-b border-gray-200">
                Diesel Sales
              </h3>

              <div className="space-y-2">
                {(["a", "b", "c"] as const).map((shift) => (
                  <div key={shift} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Shift {shift.toUpperCase()}:
                    </span>
                    <span>
                      {invoiceData.shifts[shift].diesel.toFixed(2)} L
                      <span className="ml-2 font-medium">
                        ({formatCurrency(invoiceData.shifts[shift].dieselPrice)}
                        )
                      </span>
                    </span>
                  </div>
                ))}

                <div className="pt-3 text-sm mt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Litres:</span>
                    <span className="font-medium">
                      {totalDieselLitres.toFixed(2)} L
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(invoiceData.totalDieselSale)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">Closing Stock:</span>
                    <span>{invoiceData.dieselClosing.toFixed(2)} L</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-4 pb-2 border-b border-gray-200">
                Octane Sales
              </h3>

              <div className="space-y-2">
                {(["a", "b", "c"] as const).map((shift) => (
                  <div key={shift} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Shift {shift.toUpperCase()}:
                    </span>
                    <span>
                      {invoiceData.shifts[shift].octane.toFixed(2)} L
                      <span className="ml-2 font-medium">
                        ({formatCurrency(invoiceData.shifts[shift].octanePrice)}
                        )
                      </span>
                    </span>
                  </div>
                ))}

                <div className="pt-3 mt-3 text-sm border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Litres:</span>
                    <span className="font-medium">
                      {totalOctaneLitres.toFixed(2)} L
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(invoiceData.totalOctaneSale)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">Closing Stock:</span>
                    <span>{invoiceData.octaneClosing.toFixed(2)} L</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-4 pb-2 border-b border-gray-200">
                LPG Sales
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sale:</span>
                  <span className="font-medium">
                    {(invoiceData.lpg / 62.459).toFixed(2)} L
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(invoiceData.lpg)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">Closing Stock:</span>
                    <span>{invoiceData.lpgClosing.toFixed(2)} L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Daily Summary
          </h2>

          <div className="grid sm:grid-cols-2 gap-2">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-medium mb-3 text-green-800">
                Sales Breakdown
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total CNG:</span>
                  <span className="font-medium">
                    {formatCurrency(invoiceData.totalCngSale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Diesel:</span>
                  <span className="font-medium">
                    {formatCurrency(invoiceData.totalDieselSale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Octane:</span>
                  <span className="font-medium">
                    {formatCurrency(invoiceData.totalOctaneSale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total LPG:</span>
                  <span className="font-medium">
                    {formatCurrency(invoiceData.lpg)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <h3 className="font-medium text-lg mb-1 text-primary">
                Grand Total
              </h3>

              <div className="pt-1 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diesel/Octane Sale:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        invoiceData.dieselOctaneSale +
                          invoiceData.dieselOctaneDue
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diesel/Octane Due:</span>
                    <span className="font-medium">
                      {formatCurrency(invoiceData.dieselOctaneDue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm my-1">
                    <span className="text-gray-600">
                      Diesel/Octane Cash Sale:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        invoiceData.dieselOctaneSale -
                          invoiceData.dieselOctaneDue
                      )}
                    </span>
                  </div>
                </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Net Sales:</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(invoiceData.totalSale)}
                </span>
              </div>

              <div className="mt-1 pt-1 border-t border-primary/20 text-sm text-muted-foreground">
                <p>Includes all fuel types and CNG sales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 text-xs border-t border-gray-200">
          <div className="flex sm:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground">
              <p>Generated by Xpeed CNG Station Management System</p>
              <p>Contact: +880 000 0000000 • info@xpeedcng.com</p>
            </div>

            <div className="text-muted-foreground text-center md:text-right">
              <p>Thank you for your business!</p>
              <p>
                © {new Date().getFullYear()} Xpeed CNG. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-8">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Form
        </Button>
        <Button onClick={handlePrint} className="gap-2">
          <PrinterIcon className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>
    </div>
  );
};
