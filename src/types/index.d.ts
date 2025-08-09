export type ShiftData = {
  sale: number;
  evc: number;
  add: number;
  taka: number;
};

export type InvoiceData = {
  shifts: {
    a: ShiftData;
    b: ShiftData;
    c: ShiftData;
  };
  diesel: number;
  octane: number;
  lpg: number;
  total: number;
  date: string;
};
