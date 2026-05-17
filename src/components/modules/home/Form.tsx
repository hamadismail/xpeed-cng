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
    <div className="page-shell space-y-6">
      <Card className="glass-panel overflow-hidden border-white/70 bg-white/82">
        <CardHeader className="gap-4 border-b border-border/70 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1">
              <Badge className="rounded-full border-0 bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/10">
                Data entry mode
              </Badge>
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                Daily operations report
              </CardTitle>
            </div>

            <div className="flex gap-2">
              <SummaryChip icon={Fuel} label="Shifts" value="A/B/C" />
              <SummaryChip
                icon={ReceiptText}
                label="Date"
                value={format(new Date(), "dd MMM yyyy")}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
              <CNGShiftsSection form={form} />
              <FuelSalesSection form={form} />

              <div className="rounded-2xl border border-white/70 bg-[linear-gradient(135deg,rgba(12,120,102,0.08),rgba(188,149,78,0.12))] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      Finalize & generate invoice
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Review all values before saving. The station invoice will open automatically.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 rounded-full px-6 text-xs shadow-lg"
                  >
                    <Send className="mr-2 h-3.5 w-3.5" />
                    {isSubmitting ? "Generating..." : "Save and generate invoice"}
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
      title="CNG performance"
      compact
    >
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {(["a", "b", "c"] as const).map((shift) => (
          <ShiftCard key={shift} title={SHIFT_LABELS[shift]} compact>
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.sale`}
              label="Sale (m³)"
              placeholder="0.00"
            />
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.evc`}
              label="EVC (m³)"
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
      title="Fuel & stock"
      compact
    >
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {(["a", "b", "c"] as const).map((shift) => (
          <ShiftCard key={shift} title={SHIFT_LABELS[shift]} compact>
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.diesel`}
              label="Diesel (ltr)"
              placeholder="0.00"
            />
            <ShiftInput
              control={form.control}
              name={`shifts.${shift}.octane`}
              label="Octane (ltr)"
              placeholder="0.00"
            />
          </ShiftCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2 xl:grid-cols-3">
        <FormInput
          control={form.control}
          name="dieselClosing"
          label="Diesel closing (ltr)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="octaneClosing"
          label="Octane closing (ltr)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="dieselOctaneDue"
          label="D+O due (taka)"
          placeholder="0.00"
        />
        <FormInput control={form.control} name="lpg" label="LPG amount (taka)" placeholder="0.00" />
        <FormInput
          control={form.control}
          name="lpgClosing"
          label="LPG closing (ltr)"
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
    <div className="rounded-2xl border border-border/50 bg-secondary/40 px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none">{label}</p>
          <p className="mt-1 font-mono text-xs font-bold text-foreground leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}
