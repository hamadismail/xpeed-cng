"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LockKeyhole, LogIn } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: LoginValues) => {
    setErrorMessage("");

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    });
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-xl mx-auto">
        {/* <section className="page-hero hidden lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <p className="section-label">Secure access</p>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground">
              Xpeed CNG operations sign in
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Access to pricing, reporting, logs, and invoice generation is
              restricted to approved operators only.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPanel
              title="Protected workspace"
              text="Every page and API route is locked unless a valid authenticated session exists."
            />
            <InfoPanel
              title="Admin seed"
              text="A default admin is created only when the database does not already contain one."
            />
          </div>
        </section> */}

        <Card className="glass-panel border-white/80 bg-white/84">
          <CardHeader className="space-y-4 border-b border-border/70 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="section-label">Login</p>
              <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
                Welcome back
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Sign in with your existing operator account to continue.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          className="h-12 rounded-xl border-white bg-white/90"
                          placeholder="admin@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          className="h-12 rounded-xl border-white bg-white/90"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 w-full rounded-full text-sm shadow-[0_18px_30px_-18px_rgba(9,82,70,0.85)]"
                >
                  <LogIn className="h-4 w-4" />
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// function InfoPanel({ title, text }: { title: string; text: string }) {
//   return (
//     <div className="rounded-3xl border border-white/70 bg-white/72 p-5">
//       <h2 className="text-lg font-semibold text-foreground">{title}</h2>
//       <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
//     </div>
//   );
// }
