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
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-primary border-b pb-2">
        {title}
      </h2>
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
    <div className="bg-muted/20 p-4 rounded-lg border border-muted shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="font-medium mb-3 text-center text-foreground">
        {title}
      </h3>
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
              className="bg-white focus:ring-2 focus:ring-primary/20"
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
        <FormItem className="bg-muted/20 p-4 rounded-lg border border-muted shadow-sm">
          <FormLabel className="font-medium">{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder={placeholder}
              className="bg-white focus:ring-2 focus:ring-primary/20"
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
        <FormItem className="flex flex-col bg-muted/20 p-4 rounded-lg border border-muted shadow-sm">
          <FormLabel className="font-medium">Pick Date *</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                captionLayout="dropdown"
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
