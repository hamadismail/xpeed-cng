"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";

import { PriceUpdateModal } from "@/src/components/modules/home/PriceUpdateModal";
import { PriceHistoryTable } from "@/src/components/modules/home/PriceHistoryTable";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { IPrices } from "@/src/models/Prices";
import { PRICES } from "@/src/utils/constans";

type FuelKey = keyof typeof PRICES;

type PriceRecord = Pick<IPrices, FuelKey>;

const fuelMeta: Array<{
  key: FuelKey;
  unit: string;
  tint: string;
  accent: string;
  description: string;
}> = [
  {
    key: "CNG",
    unit: "m³",
    tint: "from-[#dff6f1] to-[#f6fbf8]",
    accent: "bg-[#0c7866]",
    description: "Compressed natural gas",
  },
  {
    key: "DIESEL",
    unit: "ltr",
    tint: "from-[#fef2dc] to-[#fffaf1]",
    accent: "bg-[#bc954e]",
    description: "Primary fleet fueling",
  },
  {
    key: "OCTANE",
    unit: "ltr",
    tint: "from-[#ffe7da] to-[#fff7f2]",
    accent: "bg-[#d97745]",
    description: "High-performance retail fuel",
  },
  {
    key: "LPG",
    unit: "ltr",
    tint: "from-[#fbe5e6] to-[#fff9f9]",
    accent: "bg-[#cc6b72]",
    description: "Cylinder and vehicle supply",
  },
];

export default function HomePage() {
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [prices, setPrices] = useState<PriceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/prices?limit=1");
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setPrices(data.data[0]);
      } else {
        setPrices(PRICES);
      }
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setPrices(PRICES);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceUpdateSuccess = () => {
    fetchPrices();
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div className="page-shell space-y-6">
      <section className="page-hero">
        <div className="absolute inset-y-0 right-0 hidden w-md bg-[radial-gradient(circle_at_center,rgba(12,120,102,0.18),transparent_62%)] lg:block" />
        <div className="relative grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge className="rounded-full border-0 bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/10">
                Live command center
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Station operations & pricing
              </h1>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Today&apos;s fuel rates
                </h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-9 rounded-full px-4 text-xs shadow-md"
                    onClick={() => setIsPriceModalOpen(true)}
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    Update prices
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-full border-white/80 bg-white/70 px-4 text-xs"
                  >
                    <Link href="/logs/new">
                      <Plus className="h-3.5 w-3.5" />
                      New entry
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {isLoading
                  ? fuelMeta.map((item) => (
                      <Skeleton
                        key={item.key}
                        className="h-32 rounded-2xl"
                      />
                    ))
                  : fuelMeta.map((item) => (
                      <PriceCard
                        key={item.key}
                        label={item.key}
                        price={prices?.[item.key] ?? PRICES[item.key]}
                        unit={item.unit}
                        tint={item.tint}
                        accent={item.accent}
                        description={item.description}
                        compact
                      />
                    ))}
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-0 bg-[#16332e] text-white shadow-xl">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Operations status
                </p>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-white/90">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>

              <h2 className="text-xl font-semibold tracking-tight">
                Reporting pulse
              </h2>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Sparkles className="h-3.5 w-3.5" />
                    Recommended action
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">
                    Confirm rates, then start a daily report for clean invoice generation.
                  </p>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="mt-4 h-9 w-full rounded-full border-0 bg-white text-[#16332e] hover:bg-white/90 text-xs"
                  >
                    <Link href="/logs">
                      Open daily logs
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <PriceHistoryTable refreshTrigger={refreshTrigger} />

      <PriceUpdateModal
        isOpen={isPriceModalOpen}
        onOpenChange={setIsPriceModalOpen}
        currentPrices={prices}
        onSuccess={handlePriceUpdateSuccess}
      />
    </div>
  );
}

function PriceCard({
  label,
  price,
  unit,
  tint,
  accent,
  // description,
  compact = false,
}: {
  label: string;
  price: number;
  unit: string;
  tint: string;
  accent: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <Card className={`overflow-hidden border-white/80 bg-linear-to-br ${tint}`}>
      <CardContent
        className={`flex h-full flex-col ${compact ? "gap-4 p-4" : "gap-8 p-6"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label">{label}</p>
            {/* <h3
              className={`mt-2 font-semibold text-foreground ${compact ? "text-base" : "text-xl"}`}
            >
              {description}
            </h3> */}
          </div>
          <span className={`mt-1 h-3 w-3 rounded-full ${accent}`} />
        </div>

        <div className="space-y-2">
          <div className={compact ? "font-mono text-2xl font-semibold tracking-tight text-foreground" : "metric-value"}>
            ৳{price.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">Applied per {unit}</p>
        </div>
      </CardContent>
    </Card>
  );
}


// function HighlightCard({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-[1.3rem] border border-white/10 bg-white/8 p-4">
//       <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
//         {label}
//       </p>
//       <p className="mt-2 text-base font-medium leading-6 text-white">{value}</p>
//     </div>
//   );
// }
