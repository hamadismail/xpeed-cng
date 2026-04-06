"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleDollarSign, SlidersHorizontal } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
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
import { IPrices } from "@/src/models/Prices";

const priceSchema = z.object({
  CNG: z.string().min(1, "Required"),
  DIESEL: z.string().min(1, "Required"),
  OCTANE: z.string().min(1, "Required"),
  LPG: z.string().min(1, "Required"),
});

type PriceFormValues = z.infer<typeof priceSchema>;

interface PriceUpdateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPrices: Pick<IPrices, "CNG" | "DIESEL" | "OCTANE" | "LPG"> | null;
  onSuccess: () => void;
}

const fields: Array<{
  name: keyof PriceFormValues;
  label: string;
  unit: string;
}> = [
  { name: "CNG", label: "CNG", unit: "per m³" },
  { name: "DIESEL", label: "Diesel", unit: "per litre" },
  { name: "OCTANE", label: "Octane", unit: "per litre" },
  { name: "LPG", label: "LPG", unit: "per litre" },
];

export function PriceUpdateModal({
  isOpen,
  onOpenChange,
  currentPrices,
  onSuccess,
}: PriceUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      CNG: currentPrices?.CNG?.toString() || "",
      DIESEL: currentPrices?.DIESEL?.toString() || "",
      OCTANE: currentPrices?.OCTANE?.toString() || "",
      LPG: currentPrices?.LPG?.toString() || "",
    },
  });

  useEffect(() => {
    if (currentPrices) {
      form.reset({
        CNG: currentPrices.CNG?.toString() || "",
        DIESEL: currentPrices.DIESEL?.toString() || "",
        OCTANE: currentPrices.OCTANE?.toString() || "",
        LPG: currentPrices.LPG?.toString() || "",
      });
    }
  }, [currentPrices, form]);

  const onSubmit = async (data: PriceFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CNG: parseFloat(data.CNG),
          DIESEL: parseFloat(data.DIESEL),
          OCTANE: parseFloat(data.OCTANE),
          LPG: parseFloat(data.LPG),
        }),
      });

      if (response.ok) {
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to update prices:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-l-white/80 bg-[rgba(250,248,242,0.97)] px-6 sm:max-w-xl overflow-y-auto">
        <SheetHeader className="gap-4 border-b border-border/70 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <SheetTitle className="text-2xl font-semibold tracking-tight text-foreground">
              Update fuel pricing
            </SheetTitle>
            <SheetDescription className="text-sm leading-6 text-muted-foreground">
              Adjust the active rates used across new reports and generated
              invoices.
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-6 rounded-3xl border border-white/80 bg-white/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <CircleDollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Pricing policy
              </p>
              <p className="text-sm text-muted-foreground">
                Keep values aligned with the current retail board before opening
                a new daily entry.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            {fields.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem className="rounded-[1.4rem] border border-border/70 bg-white/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <FormLabel className="text-base font-semibold text-foreground">
                          {item.label}
                        </FormLabel>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.unit}
                        </p>
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Active
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="mt-4 h-12 rounded-xl border-white bg-secondary/35 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <SheetFooter className="border-t border-border/70 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full"
              >
                {isSubmitting ? "Updating prices..." : "Save updated rates"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
