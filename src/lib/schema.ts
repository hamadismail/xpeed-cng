import { z } from "zod";

export const formSchema = z.object({
  shifts: z.object({
    a: z.object({
      sale: z.string().min(1, "Sales is required"),
      evc: z.string().min(1, "Evc is required"),
      diesel: z.string().min(1, "Diesel is required"),
      octane: z.string().min(1, "Octane is required"),
    }),
    b: z.object({
      sale: z.string().min(1, "Sales is required"),
      evc: z.string().min(1, "Evc is required"),
      diesel: z.string().min(1, "Diesel is required"),
      octane: z.string().min(1, "Octane is required"),
    }),
    c: z.object({
      sale: z.string().min(1, "Sales is required"),
      evc: z.string().min(1, "Evc is required"),
      diesel: z.string().min(1, "Diesel is required"),
      octane: z.string().min(1, "Octane is required"),
    }),
  }),
  dieselClosing: z.string().min(1, "diesel closing is required"),
  octaneClosing: z.string().min(1, "octane closing is required"),
  lpg: z.string().min(1, "lpg is required"),
  lpgClosing: z.string().min(1, "lpg Closing is required"),
  dieselOctaneDue: z.string().min(1, "Dues is required"),
  date: z.date("Date is required"),
});
