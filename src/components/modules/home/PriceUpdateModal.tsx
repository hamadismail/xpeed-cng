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
      <SheetContent className="w-full border-l-white/80 bg-[rgba(250,248,242,0.97)] px-6 sm:max-w-md overflow-y-auto">
        <SheetHeader className="gap-2 border-b border-border/70 pb-4">
          <SheetTitle className="text-xl font-semibold tracking-tight text-foreground">
            Update fuel prices
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Adjust active rates for reports and invoices.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-3"
          >
            {fields.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem className="rounded-2xl border border-border/50 bg-white/60 p-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-foreground">
                        {item.label} <span className="text-[10px] text-muted-foreground uppercase">({item.unit.replace('per ', '')})</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          className="h-9 w-24 rounded-lg border-white/50 bg-secondary/20 text-right text-sm font-mono"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <SheetFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full rounded-full shadow-lg"
              >
                {isSubmitting ? "Updating..." : "Save updated rates"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
