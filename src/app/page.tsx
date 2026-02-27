"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Settings2, Fuel } from "lucide-react";
import { PriceUpdateModal } from "@/src/components/modules/home/PriceUpdateModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { PRICES } from "@/src/utils/constans";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function HomePage() {
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prices, setPrices] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/prices");
      const data = await response.json();
      if (data.success && data.data) {
        setPrices(data.data);
      } else {
        setPrices(PRICES); // Fallback to constants
      }
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setPrices(PRICES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Station Dashboard</h1>
          <p className="text-muted-foreground">Monitor current rates and manage station operations</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsPriceModalOpen(true)}
          >
            <Settings2 className="h-4 w-4" />
            Update Prices
          </Button>
          <Button
            asChild
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Link href="/logs/new">
              <Plus className="h-4 w-4" />
              Add New Entry
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </>
        ) : (
          <>
            <PriceCard label="CNG" price={prices?.CNG} unit="m³" color="blue" />
            <PriceCard label="DIESEL" price={prices?.DIESEL} unit="ltr" color="green" />
            <PriceCard label="OCTANE" price={prices?.OCTANE} unit="ltr" color="orange" />
            <PriceCard label="LPG" price={prices?.LPG} unit="ltr" color="red" />
          </>
        )}
      </div>

      <PriceUpdateModal
        isOpen={isPriceModalOpen}
        onOpenChange={setIsPriceModalOpen}
        currentPrices={prices}
        onSuccess={fetchPrices}
      />
    </div>
  );
}

function PriceCard({ label, price, unit, color }: { label: string, price: number, unit: string, color: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorVariants: any = {
    blue: "border-l-blue-500 bg-blue-50/50",
    green: "border-l-green-500 bg-green-50/50",
    orange: "border-l-orange-500 bg-orange-50/50",
    red: "border-l-red-500 bg-red-50/50",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textVariants: any = {
    blue: "text-blue-700",
    green: "text-green-700",
    orange: "text-orange-700",
    red: "text-red-700",
  };

  return (
    <Card className={`border-l-4 shadow-sm ${colorVariants[color]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Fuel className="h-4 w-4" />
          {label} RATE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textVariants[color]}`}>
          ৳{price?.toFixed(2)}
          <span className="text-xs font-normal text-muted-foreground ml-1">per {unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}
