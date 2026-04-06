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
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.55)] sm:p-6">
      <div className="space-y-2 border-b border-border/70 pb-4">
        <p className="section-label">Report section</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

// Reusable Shift Card Component
export function ShiftCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-secondary/45 p-4 shadow-[0_18px_55px_-44px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Shift
        </span>
      </div>
      <div className="space-y-3">{children}</div>
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
        <FormItem>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder={placeholder}
              className="h-11 rounded-xl border-white bg-white/90"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-xs" />
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
        <FormItem className="rounded-[1.4rem] border border-border/70 bg-secondary/45 p-4 shadow-[0_18px_55px_-44px_rgba(15,23,42,0.45)]">
          <FormLabel className="font-medium text-foreground">{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder={placeholder}
              className="mt-2 h-11 rounded-xl border-white bg-white/90"
              {...field}
            />
          </FormControl>
          <FormMessage />
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
        <FormItem className="flex flex-col rounded-[1.4rem] border border-border/70 bg-secondary/45 p-4 shadow-[0_18px_55px_-44px_rgba(15,23,42,0.45)]">
          <FormLabel className="font-medium text-foreground">Pick Date *</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "mt-2 h-11 w-full justify-start rounded-xl border-white bg-white/90 pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Select a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto rounded-[1.25rem] border-white/80 p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                captionLayout="dropdown"
                className="rounded-[1.25rem] bg-white p-3"
              />
            </PopoverContent>
          </Popover>
          <FormDescription className="sr-only">
            Select the report date
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
