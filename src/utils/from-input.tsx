import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { Input } from "../components/ui/input";

interface InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
  placeholder: string;
}

// Reusable Section Component
export function Section({
  title,
  description,
  children,
  compact = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={cn(
      "rounded-3xl border border-white/70 bg-white/75 shadow-sm",
      compact ? "space-y-4 p-4" : "space-y-5 p-5 sm:p-6"
    )}>
      <div className={cn(
        "border-b border-border/70",
        compact ? "pb-2" : "space-y-2 pb-4"
      )}>
        {!compact && <p className="section-label text-[10px]">Report section</p>}
        <h2 className={cn(
          "font-semibold tracking-tight text-foreground",
          compact ? "text-lg" : "text-2xl"
        )}>{title}</h2>
        {description && !compact ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

// Reusable Shift Card Component
export function ShiftCard({
  title,
  children,
  compact = false,
}: {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-2xl border border-border/70 bg-secondary/45 shadow-sm",
      compact ? "p-3" : "p-4"
    )}>
      <div className={cn(
        "flex items-center justify-between gap-4",
        compact ? "mb-3" : "mb-4"
      )}>
        <h3 className={cn(
          "font-semibold text-foreground",
          compact ? "text-sm" : "text-base"
        )}>{title}</h3>
        {!compact && (
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Shift
          </span>
        )}
      </div>
      <div className={compact ? "space-y-2" : "space-y-3"}>{children}</div>
    </div>
  );
}

// Reusable Shift Input Component
export function ShiftInput({ control, name, label, placeholder }: InputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder={placeholder}
              className="h-9 rounded-lg border-white/50 bg-white/90 text-sm"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-[10px]" />
        </FormItem>
      )}
    />
  );
}

// Reusable Form Input Component
export function FormInput({ control, name, label, placeholder }: InputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="rounded-2xl border border-border/70 bg-secondary/45 p-3 shadow-sm space-y-1.5">
          <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder={placeholder}
              className="h-9 rounded-lg border-white/50 bg-white/90 text-sm"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-[10px]" />
        </FormItem>
      )}
    />
  );
}

// Date Picker Field Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DatePickerField({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col rounded-2xl border border-border/70 bg-secondary/45 p-3 shadow-sm space-y-1.5">
          <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Pick Date *
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start rounded-lg border-white/50 bg-white/90 pl-3 text-left text-sm font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd MMM yyyy")
                  ) : (
                    <span>Select a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto rounded-xl border-white/80 p-0 shadow-2xl" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                captionLayout="dropdown"
                className="rounded-xl bg-white p-2"
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-[10px]" />
        </FormItem>
      )}
    />
  );
}
