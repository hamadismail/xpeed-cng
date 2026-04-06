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

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/prices");
      const data = await response.json();

      if (data.success && data.data) {
        setPrices(data.data);
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

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div className="page-shell space-y-8">
      <section className="page-hero">
        <div className="absolute inset-y-0 right-0 hidden w-md bg-[radial-gradient(circle_at_center,rgba(12,120,102,0.18),transparent_62%)] lg:block" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <Badge className="rounded-full border-0 bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/10">
              Live operations dashboard
            </Badge>
            <div className="max-w-2xl space-y-4">
              <p className="section-label">Xpeed CNG station control</p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A cleaner command center for pricing, reporting, and daily
                station rhythm.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Monitor every fuel rate at a glance, launch new shift reports
                quickly, and keep the station team working from one polished
                operational surface.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="section-label">Current rates</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                    Today&apos;s fuel pricing board
                  </h2>
                </div>
                <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                  Live values used for new entries and invoice generation.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {isLoading
                  ? fuelMeta.map((item) => (
                      <Skeleton
                        key={item.key}
                        className="h-36 rounded-3xl"
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 rounded-full px-6 text-sm shadow-[0_20px_35px_-22px_rgba(9,82,70,0.85)]"
                onClick={() => setIsPriceModalOpen(true)}
              >
                <Settings2 className="h-4 w-4" />
                Update fuel prices
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-white/80 bg-white/70 px-6 text-sm"
              >
                <Link href="/logs/new">
                  <Plus className="h-4 w-4" />
                  Create daily entry
                </Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border-0 bg-[#16332e] text-white shadow-[0_28px_80px_-42px_rgba(9,82,70,0.95)]">
            <CardContent className="space-y-6 p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label text-white/65">
                    Operations pulse
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Station ready for daily reporting
                  </h2>
                </div>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                  Live
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <HighlightCard
                  label="Quick access"
                  value="Generate invoice-ready reports"
                />
                <HighlightCard
                  label="Control"
                  value="Update retail rates instantly"
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Sparkles className="h-4 w-4" />
                  Workflow recommendation
                </div>
                <p className="mt-3 text-lg font-medium leading-7 text-white">
                  Start the day by confirming rates, then move into a new daily
                  report for clean invoice generation and audit-friendly logs.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="mt-5 rounded-full border-0 bg-white text-[#16332e] hover:bg-white/90"
                >
                  <Link href="/logs">
                    Open daily logs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <PriceUpdateModal
        isOpen={isPriceModalOpen}
        onOpenChange={setIsPriceModalOpen}
        currentPrices={prices}
        onSuccess={fetchPrices}
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


function HighlightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-white/8 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
        {label}
      </p>
      <p className="mt-2 text-base font-medium leading-6 text-white">{value}</p>
    </div>
  );
}
