"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DailyReportForm from "@/src/components/modules/home/Form";
import { Button } from "@/src/components/ui/button";

export default function NewEntryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <DailyReportForm />
    </div>
  );
}
