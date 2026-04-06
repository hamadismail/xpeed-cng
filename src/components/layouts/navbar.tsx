"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FilePlus2,
  Fuel,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/src/lib/utils";

const navigationLinks = [
  {
    href: "/",
    label: "Overview",
    icon: Home,
    description: "Rates, actions and live station view",
  },
  {
    href: "/logs",
    label: "Daily Logs",
    icon: BarChart3,
    description: "Historical reports and invoice access",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const closeSheet = () => setIsOpen(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[1.75rem] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3 group"
              onClick={closeSheet}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(12,120,102,1),rgba(9,82,70,0.92))] shadow-[0_18px_30px_-20px_rgba(9,82,70,0.8)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Fuel className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary/70">
                  Station Operations
                </p>
                <span className="block truncate text-lg font-semibold tracking-tight text-foreground">
                  Xpeed Energy Resources
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <NavigationMenuItem key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-[0_12px_30px_-18px_rgba(9,82,70,0.85)]"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="hidden xl:flex items-center gap-2 rounded-full border border-border/80 bg-secondary/65 px-3 py-2 text-xs text-muted-foreground">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
                Live forecourt and pricing control online
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {/* <Button asChild variant="outline" className="rounded-full border-white/70 bg-white/70 px-4">
                <Link href="/logs">
                  Review Logs
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button> */}
              <Button
                asChild
                className="rounded-full px-5 shadow-[0_18px_30px_-18px_rgba(9,82,70,0.85)]"
              >
                <Link href="/logs/new">
                  <FilePlus2 className="h-4 w-4" />
                  New Entry
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="rounded-full px-4 text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Signing out..." : "Logout"}
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:block">
                Live station
              </div>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-white/70 bg-white/80"
                    aria-label="Toggle menu"
                  >
                    {isOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-75 border-l-white/70 bg-[rgba(250,248,242,0.96)] px-6 backdrop-blur"
                >
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Access dashboard pages and account actions.
                  </SheetDescription>
                  <div className="flex h-full flex-col gap-6 pt-8">
                    <div className="space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <Fuel className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                          Xpeed CNG
                        </p>
                        <h2 className="text-xl font-semibold text-foreground">
                          Operations workspace
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Daily reporting, current pricing and invoice
                          generation in one place.
                        </p>
                      </div>
                    </div>

                    <nav className="space-y-2">
                      {navigationLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeSheet}
                            className={cn(
                              "flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors",
                              isActive
                                ? "border-primary/20 bg-primary/10"
                                : "border-transparent bg-white/70 hover:border-border hover:bg-white",
                            )}
                          >
                            <div
                              className={cn(
                                "mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-foreground",
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground">
                                {link.label}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {link.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </nav>

                    <div className="mt-auto space-y-3 rounded-3xl border border-border/80 bg-white/75 p-4">
                      <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-center text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Station operational
                      </div>
                      <Button asChild className="w-full rounded-full">
                        <Link href="/logs/new" onClick={closeSheet}>
                          <FilePlus2 className="h-4 w-4" />
                          Create daily entry
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full rounded-full"
                        onClick={() => {
                          closeSheet();
                          void handleLogout();
                        }}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Signing out..." : "Logout"}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
