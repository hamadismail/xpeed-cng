import React from "react";

export default function Loading() {
  return (
    <div className="page-shell">
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="glass-panel flex items-center gap-4 rounded-full px-6 py-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
          </div>
          <div>
            <p className="section-label">Loading</p>
            <p className="text-sm text-muted-foreground">Preparing the station workspace...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
