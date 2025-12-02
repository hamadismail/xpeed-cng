"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Invoice } from "@/src/modules/invoice";
import { formSchema } from "@/src/lib/schema";
import { PRICES, SHIFT_LABELS } from "@/src/utils/constans";
import { generateInvoiceData } from "@/src/utils/generate-invoice-data";
import { InvoiceData } from "@/src/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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

    const payload = {
      ...data,
      cngPrice: PRICES.CNG,
      dieselPrice: PRICES.DIESEL,
      octanePrice: PRICES.OCTANE,
      lpgPrice: PRICES.LPG,
    };

    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    <div className="max-w-7xl mx-auto p-4">
      <Card className="border-none shadow-xl rounded-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-primary">
            Xpeed Energy Resources Report
          </CardTitle>
          <p className="text-muted-foreground font-medium">
            {format(new Date(), "MMMM do, yyyy")}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
              noValidate
            >
              <CNGShiftsSection form={form} />
              <FuelSalesSection form={form} />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting ? "Generating..." : "Generate Invoice"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// CNG Shifts Section Component
interface CNGShiftsSectionProps {
  form: ReturnType<typeof useForm<FormValues>>;
}

function CNGShiftsSection({ form }: CNGShiftsSectionProps) {
  return (
    <Section title="CNG Data">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["a", "b", "c"] as const).map((shift) => (
          <ShiftCard key={shift} title={SHIFT_LABELS[shift]}>
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

// Fuel Sales Section Component
interface FuelSalesSectionProps {
  form: ReturnType<typeof useForm<FormValues>>;
}

function FuelSalesSection({ form }: FuelSalesSectionProps) {
  return (
    <Section title="Fuel Sales">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["a", "b", "c"] as const).map((shift) => (
          <ShiftCard key={shift} title={SHIFT_LABELS[shift]}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <FormInput
          control={form.control}
          name="dieselClosing"
          label="Diesel Closing Stock (ltr)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="octaneClosing"
          label="Octane Closing Stock (ltr)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="dieselOctaneDue"
          label="Dues Taka (Diesel + Octane)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="lpg"
          label="LPG (ltr)"
          placeholder="0.00"
        />
        <FormInput
          control={form.control}
          name="lpgClosing"
          label="LPG Closing Stock (ltr)"
          placeholder="0.00"
        />
        <DatePickerField control={form.control} />
      </div>
    </Section>
  );
}
