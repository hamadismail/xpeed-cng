export type ShiftData = {
  sale: number;
  evc: number;
  add: number;
  taka: number;
  diesel: number;
  octane: number;
  dieselPrice: number;
  octanePrice: number;
};

export type InvoiceData = {
  shifts: {
    a: ShiftData;
    b: ShiftData;
    c: ShiftData;
  };
  dieselClosing: number;
  octaneClosing: number;
  lpgClosing: number;
  dieselOctaneDue: number;
  lpg: number;
  totalCngSale: number;
  totalDieselSale: number;
  totalOctaneSale: number;
  totalSale: number;
  date: string;
};
