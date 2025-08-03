"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Dynamically import the client component
const RegisterClient = dynamic(() => import("./register-client"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Skeleton className="w-full max-w-md h-[600px]" />
    </div>
  ),
  ssr: false
});

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="w-full max-w-md h-[600px]" />
      </div>
    }>
      <RegisterClient />
    </Suspense>
  );
}