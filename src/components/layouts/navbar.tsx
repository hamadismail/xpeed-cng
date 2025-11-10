"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, LogIn, Menu, X, Zap, Fuel } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/src/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

// Navigation links array with icons
const navigationLinks = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
    description: "View overview and create reports",
  },
  {
    href: "/logs",
    label: "Sales Logs",
    icon: BarChart3,
    description: "View historical sales data",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onClick={closeSheet}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 -z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Xpeed Energy
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Resources Ltd.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-1">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <NavigationMenuItem key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                            : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-primary rounded-full ml-1" />
                        )}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <Fuel className="h-3 w-3" />
              Live Station
            </Badge>

            <Button
              asChild
              size="sm"
              className="gap-2 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <a href="#">
                <LogIn className="h-4 w-4" />
                Sign In
              </a>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 bg-green-50 text-green-700 border-green-200 mr-2"
            >
              <Fuel className="h-3 w-3" />
              Live
            </Badge>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 hover:bg-accent/50"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <X className="h-5 w-5 transition-all duration-200" />
                  ) : (
                    <Menu className="h-5 w-5 transition-all duration-200" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[350px] border-l bg-background/95 backdrop-blur"
              >
                {/* Mobile Navigation Header */}
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        Xpeed Energy
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Resources Ltd.
                      </span>
                    </div>
                  </div>

                  <div className="border-t" />

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-1">
                    {navigationLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeSheet}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200",
                            "hover:bg-accent hover:text-accent-foreground",
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <div className="flex flex-col">
                            <span>{link.label}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {link.description}
                            </span>
                          </div>
                          {isActive && (
                            <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="border-t" />

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-3 px-2">
                    <Button
                      className="w-full gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                      size="lg"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In to Dashboard
                    </Button>

                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 text-xs"
                      >
                        <Fuel className="h-3 w-3 mr-1" />
                        Station Operational
                      </Badge>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
