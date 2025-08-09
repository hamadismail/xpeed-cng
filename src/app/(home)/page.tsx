"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
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

// Define form schema with proper validation

type FormValues = z.infer<typeof formSchema>;

export default function Home() {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shifts: {
        a: { sale: "", evc: "" },
        b: { sale: "", evc: "" },
        c: { sale: "", evc: "" },
      },
      diesel: "",
      octane: "",
      lpg: "",
    },
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const onSubmit = (data: FormValues) => {
    const invoice: InvoiceData = {
      shifts: {
        a: {
          sale: parseFloat(data.shifts.a.sale),
          evc: parseFloat(data.shifts.a.evc),
          add: parseFloat(data.shifts.a.evc) - parseFloat(data.shifts.a.sale),
          taka: parseFloat(data.shifts.a.sale) * 43,
        },
        b: {
          sale: parseFloat(data.shifts.a.sale),
          evc: parseFloat(data.shifts.a.evc),
          add: parseFloat(data.shifts.a.evc) - parseFloat(data.shifts.a.sale),
          taka: parseFloat(data.shifts.a.sale) * 43,
        },
        c: {
          sale: parseFloat(data.shifts.a.sale),
          evc: parseFloat(data.shifts.a.evc),
          add: parseFloat(data.shifts.a.evc) - parseFloat(data.shifts.a.sale),
          taka: parseFloat(data.shifts.a.sale) * 43,
        },
      },
      diesel: parseFloat(data.diesel) * 102,
      octane: parseFloat(data.octane) * 102,
      lpg: parseFloat(data.lpg) * 62.459,
      total:
        parseFloat(data.shifts.a.sale) * 43 +
        parseFloat(data.shifts.b.sale) * 43 +
        parseFloat(data.shifts.c.sale) * 43 +
        parseFloat(data.diesel) * 102 +
        parseFloat(data.octane) * 102 +
        parseFloat(data.lpg) * 62.459,
      date: format(new Date(), "PPP"),
    };
    setInvoiceData(invoice);
  };

  if (invoiceData) {
    return (
      <Invoice invoiceData={invoiceData} onBack={() => setInvoiceData(null)} />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Xpeed CNG Daily Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* CNG Shifts */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary">CNG Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {(["a", "b", "c"] as const).map((shift) => (
                    <div key={shift} className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">
                        Shift {shift.toUpperCase()}
                      </h3>
                      <FormField
                        control={form.control}
                        name={`shifts.${shift}.sale`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sale (m³)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                className="bg-white mb-2"
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
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fuel Sales */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary">
                  Fuel Sales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="diesel"
                    render={({ field }) => (
                      <FormItem className="bg-muted/50 p-4 rounded-lg">
                        <FormLabel>Diesel (ltr)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                    name="octane"
                    render={({ field }) => (
                      <FormItem className="bg-muted/50 p-4 rounded-lg">
                        <FormLabel>Octane (ltr)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                    name="lpg"
                    render={({ field }) => (
                      <FormItem className="bg-muted/50 p-4 rounded-lg">
                        <FormLabel>LPG (ltr)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-6 text-lg">
                Generate Invoice
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
