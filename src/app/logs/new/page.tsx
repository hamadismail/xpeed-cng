"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, ReceiptText } from "lucide-react";
import DailyReportForm from "@/src/components/modules/home/Form";
import { Button } from "@/src/components/ui/button";

export default function NewEntryPage() {
  return (
    <div className="page-shell space-y-8">
      <section className="page-hero">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div className="space-y-4">
            <Button
              variant="outline"
              asChild
              className="h-11 rounded-full border-white/80 bg-white/75 px-4"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>

            <div className="space-y-3">
              <p className="section-label">Daily report workspace</p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground">
                Capture the station day once, then move straight into invoice output.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                This form keeps CNG shifts, liquid fuel activity, stock closing values, and dues in
                a single structured report for clean record keeping.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={FileText}
              title="Structured entry"
              text="Separate shift capture for CNG, diesel, and octane with clear field grouping."
            />
            <InfoCard
              icon={ReceiptText}
              title="Invoice ready"
              text="Submitting generates the invoice view immediately from the saved station data."
            />
          </div>
        </div>
      </section>

      <DailyReportForm />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_18px_55px_-42px_rgba(15,23,42,0.55)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
