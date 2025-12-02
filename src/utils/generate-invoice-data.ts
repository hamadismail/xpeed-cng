import { format } from "date-fns";
import { InvoiceData } from "../types";

export const generateInvoiceData = (log: InvoiceData): InvoiceData => {
  const parseFloatOrZero = (value?: string | number) =>
    parseFloat(String(value)) || 0;

  const shifts = Object.entries(log.shifts).reduce(
    (
      acc,
      [shift, values]: [
        string,
        {
          sale?: string | number;
          evc?: string | number;
          diesel?: string | number;
          octane?: string | number;
        }
      ]
    ) => {
      const sale = parseFloatOrZero(values?.sale);
      const evc = parseFloatOrZero(values?.evc);
      const diesel = parseFloatOrZero(values?.diesel);
      const octane = parseFloatOrZero(values?.octane);

      acc[shift as "a" | "b" | "c"] = {
        sale,
        evc,
        add: evc - sale,
        taka: sale * log.cngPrice,
        diesel,
        octane,
        dieselPrice: diesel * log.dieselPrice,
        octanePrice: octane * log.octanePrice,
      };
      return acc;
    },
    {} as InvoiceData["shifts"]
  );

  const totalDieselSale = Object.values(shifts).reduce(
    (sum, shift) => sum + shift.dieselPrice,
    0
  );
  const totalOctaneSale = Object.values(shifts).reduce(
    (sum, shift) => sum + shift.octanePrice,
    0
  );
  const totalCngSale = Object.values(shifts).reduce(
    (sum, shift) => sum + shift.taka,
    0
  );
  const lpgSale = parseFloatOrZero(log.lpg) * log.lpgPrice;

  return {
    shifts,
    cngPrice: log.cngPrice,
    dieselPrice: log.dieselPrice,
    octanePrice: log.octanePrice,
    lpgPrice: log.lpgPrice,
    dieselClosing: parseFloatOrZero(log.dieselClosing),
    octaneClosing: parseFloatOrZero(log.octaneClosing),
    lpg: lpgSale,
    lpgClosing: parseFloatOrZero(log.lpgClosing),
    dieselOctaneDue: parseFloatOrZero(log.dieselOctaneDue),
    dieselOctaneSale: totalDieselSale + totalOctaneSale,
    totalCngSale,
    totalDieselSale,
    totalOctaneSale,
    totalCngSaleVolume: Object.values(shifts).reduce(
      (sum, shift) => sum + shift.sale,
      0
    ),
    totalCngEvcVolume: Object.values(shifts).reduce(
      (sum, shift) => sum + shift.evc,
      0
    ),
    totalCngAddVolume: Object.values(shifts).reduce(
      (sum, shift) => sum + shift.add,
      0
    ),
    totalSale: totalCngSale + totalDieselSale + totalOctaneSale + lpgSale,
    date: format(new Date(log.date), "PPP"),
  };
};
