"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { InvoiceData } from "@/src/types";
import { Invoice } from "@/src/modules/invoice";
import { formSchema } from "@/src/lib/schema";
import { PRICES, SHIFT_LABELS } from "@/src/utils/constans";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { Calendar } from "@/src/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

type FormValues = z.infer<typeof formSchema>;

export default function DailyReportForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shifts: {
        a: { sale: "", evc: "", diesel: "", octane: "" },
        b: { sale: "", evc: "", diesel: "", octane: "" },
        c: { sale: "", evc: "", diesel: "", octane: "" },
      },
      dieselClosing: "",
      octaneClosing: "",
      lpg: "",
      lpgClosing: "",
      dieselOctaneDue: "",
      date: new Date(),
    },
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  /**
   * Processes form data and generates invoice data
   */
  const onSubmit = (data: FormValues) => {
    const parseFloatOrZero = (value: string) => parseFloat(value) || 0;

    // Calculate shift totals
    const shifts = Object.entries(data.shifts).reduce(
      (acc, [shift, values]) => {
        const sale = parseFloatOrZero(values.sale);
        const evc = parseFloatOrZero(values.evc);
        const diesel = parseFloatOrZero(values.diesel);
        const octane = parseFloatOrZero(values.octane);

        acc[shift as "a" | "b" | "c"] = {
          sale,
          evc,
          add: evc - sale,
          taka: sale * PRICES.CNG,
          diesel,
          octane,
          dieselPrice: diesel * PRICES.DIESEL,
          octanePrice: octane * PRICES.OCTANE,
        };
        return acc;
      },
      {} as InvoiceData["shifts"]
    );

    // Calculate totals
    const totalCngSale = Object.values(shifts).reduce(
      (sum, shift) => sum + shift.taka,
      0
    );

    const totalCngSaleVolume = Object.values(shifts).reduce(
      (sum, shift) => sum + shift.sale,
      0
    );

    const totalCngEvcVolume = Object.values(shifts).reduce(
      (sum, shift) => sum + shift.evc,
      0
    );

    const totalCngAddVolume = Object.values(shifts).reduce(
      (sum, shift) => sum + shift.add,
      0
    );

    const totalDieselSale = Object.values(shifts).reduce(
      (sum, shift) => sum + shift.diesel * PRICES.DIESEL,
      0
    );

    const totalOctaneSale = Object.values(shifts).reduce(
      (sum, shift) => sum + shift.octane * PRICES.OCTANE,
      0
    );

    const lpgSale = parseFloatOrZero(data.lpg) * PRICES.LPG;

    const invoice: InvoiceData = {
      shifts,
      dieselClosing: parseFloatOrZero(data.dieselClosing),
      octaneClosing: parseFloatOrZero(data.octaneClosing),
      lpg: lpgSale,
      lpgClosing: parseFloatOrZero(data.lpgClosing),
      dieselOctaneDue: parseFloatOrZero(data.dieselOctaneDue),
      dieselOctaneSale: totalDieselSale + totalOctaneSale,
      totalCngSale,
      totalDieselSale,
      totalOctaneSale,
      totalCngSaleVolume,
      totalCngEvcVolume,
      totalCngAddVolume,
      totalSale: totalCngSale + totalDieselSale + totalOctaneSale + lpgSale,
      date: format(new Date(data.date ), "PPP"),
    };

    setInvoiceData(invoice);
  };

  if (invoiceData) {
    return (
      <Invoice invoiceData={invoiceData} onBack={() => setInvoiceData(null)} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="border-none shadow-xl rounded-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Xpeed Energy Resources Report
          </CardTitle>
          <p className="text-muted-foreground">
            {format(new Date(), "MMMM do, yyyy")}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* CNG Shifts Section */}
              <Section title="CNG Data">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["a", "b", "c"] as const).map((shift) => (
                    <ShiftCard key={shift} title={SHIFT_LABELS[shift]}>
                      <FormField
                        control={form.control}
                        name={`shifts.${shift}.sale`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sale (m³)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`shifts.${shift}.evc`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EVC (m³)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </ShiftCard>
                  ))}
                </div>
              </Section>

              {/* Fuel Sales Section */}
              <Section title="Fuel Sales">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["a", "b", "c"] as const).map((shift) => (
                    <ShiftCard key={shift} title={SHIFT_LABELS[shift]}>
                      <FormField
                        control={form.control}
                        name={`shifts.${shift}.diesel`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Diesel (ltr)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`shifts.${shift}.octane`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Octane (ltr)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </ShiftCard>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="dieselClosing"
                    render={({ field }) => (
                      <InputField
                        label="Diesel Closing Stock (ltr)"
                        placeholder="0.00"
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="octaneClosing"
                    render={({ field }) => (
                      <InputField
                        label="Octane Closing Stock (ltr)"
                        placeholder="0.00"
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dieselOctaneDue"
                    render={({ field }) => (
                      <InputField
                        label="Dues Taka (Diesel + Octane)"
                        placeholder="0.00"
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lpg"
                    render={({ field }) => (
                      <InputField
                        label="LPG (ltr)"
                        placeholder="0.00"
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lpgClosing"
                    render={({ field }) => (
                      <InputField
                        label="LPG Closing Stock (ltr)"
                        placeholder="0.00"
                        {...field}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Pick Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription className="sr-only">
                          Your date is used.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Section>

              <Button
                type="submit"
                className="w-full py-6 text-lg font-bold hover:shadow-md transition-all"
                size="lg"
              >
                Generate Invoice
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components for better organization
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary border-b pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ShiftCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/20 p-4 rounded-lg border border-muted shadow-sm">
      <h3 className="font-medium mb-3 text-center">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  ...props
}: {
  label: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) {
  return (
    <FormItem className="bg-muted/20 p-4 rounded-lg border border-muted shadow-sm">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="number"
          step="0.01"
          placeholder={placeholder}
          className="bg-white"
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
