"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Fuel, ReceiptText, Send } from "lucide-react";

import { Invoice } from "@/src/modules/invoice";
import { formSchema } from "@/src/lib/schema";
import { SHIFT_LABELS } from "@/src/utils/constans";
import { generateInvoiceData } from "@/src/utils/generate-invoice-data";
import { InvoiceData } from "@/src/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  DatePickerField,
  FormInput,
  Section,
  ShiftCard,
  ShiftInput,
} from "@/src/utils/from-input";

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_FORM_VALUES: FormValues = {
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
};

export default function DailyReportForm() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const generatedInvoiceData = generateInvoiceData(result.data);
      setInvoiceData(generatedInvoiceData);
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setInvoiceData(null);
    form.reset();
  };

  if (invoiceData) {
    return <Invoice invoiceData={invoiceData} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel overflow-hidden border-white/70 bg-white/82">
        <CardHeader className="gap-5 border-b border-border/70 pb-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <p className="section-label">Entry form</p>
              <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
                Xpeed daily operations report
              </CardTitle>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Record each shift with enough clarity for station review, invoice generation, and
                audit follow-up.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryChip icon={Fuel} label="Shifts captured" value="A / B / C" />
              <SummaryChip
                icon={ReceiptText}
                label="Report date"
                value={format(new Date(), "dd MMM yyyy")}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
              <CNGShiftsSection form={form} />
              <FuelSalesSection form={form} />

              <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(12,120,102,0.08),rgba(188,149,78,0.12))] p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl space-y-2">
                    <p className="section-label text-primary/70">Submit report</p>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      Generate the station invoice from this saved report.
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Once submitted, the report is stored and opened directly in the invoice view
                      for printing or review.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 rounded-full px-6 text-sm shadow-[0_18px_30px_-18px_rgba(9,82,70,0.85)]"
                    size="lg"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Generating invoice..." : "Save and generate invoice"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function CNGShiftsSection({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  return (
    <Section
      title="CNG shift performance"
      description="Capture sale and EVC volume for each operational shift. Add volume is calculated in the invoice output."
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {(["a", "b", "c"] as const).map((shift) => (
          <ShiftCard key={shift} title={SHIFT_LABELS[shift]}>
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.sale`}
              label="Sale volume (m³)"
              placeholder="0.00"
            />
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.evc`}
              label="EVC volume (m³)"
              placeholder="0.00"
            />
          </ShiftCard>
        ))}
      </div>
    </Section>
  );
}

function FuelSalesSection({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  return (
    <Section
      title="Liquid fuel and closing values"
      description="Record diesel and octane sales per shift, then confirm closing stock, LPG details, outstanding dues, and report date."
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {(["a", "b", "c"] as const).map((shift) => (
          <ShiftCard key={shift} title={SHIFT_LABELS[shift]}>
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.diesel`}
              label="Diesel sale (ltr)"
              placeholder="0.00"
            />
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.octane`}
              label="Octane sale (ltr)"
              placeholder="0.00"
            />
          </ShiftCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FormInput
          control={form.control}
          name="dieselClosing"
          label="Diesel closing stock (ltr)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="octaneClosing"
          label="Octane closing stock (ltr)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="dieselOctaneDue"
          label="Diesel + octane due (taka)"
          placeholder="0.00"
        />
        <FormInput control={form.control} name="lpg" label="LPG amount (taka)" placeholder="0.00" />
        <FormInput
          control={form.control}
          name="lpgClosing"
          label="LPG closing stock (ltr)"
          placeholder="0.00"
        />
        <DatePickerField control={form.control} />
      </div>
    </Section>
  );
}

function SummaryChip({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-secondary/55 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-mono text-base font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}
