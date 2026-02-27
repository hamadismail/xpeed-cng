"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
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
  currentPrices: IPrices;
  onSuccess: () => void;
}

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

  // Reset form when currentPrices changes
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Fuel Prices</SheetTitle>
          <SheetDescription>
            Set the current prices for each fuel type. These will be used for new entries.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="CNG"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNG (per m³)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="DIESEL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DIESEL (per ltr)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="OCTANE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OCTANE (per ltr)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LPG"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LPG (per ltr)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Updating..." : "Update Prices"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
