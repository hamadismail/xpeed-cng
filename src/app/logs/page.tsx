import { Construction, Hammer } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-center">
          <div className="p-4 bg-yellow-100 rounded-full">
            <Construction className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Under Construction
        </h1>

        <p className="text-gray-600">
          We are working hard to bring you an amazing experience. This page will be available soon!
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Hammer className="h-4 w-4" />
          <span>Hard at work</span>
        </div>

        <div className="pt-4">
          <Button asChild>
            <Link href="/" className="w-full">
              Return Home
            </Link>
          </Button>
        </div>
      </div>

      <footer className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Xpeed Group. All rights reserved.
      </footer>
    </div>
  );
}
