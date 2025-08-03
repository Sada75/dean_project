"use client";

import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPageClient() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  
  return <RegisterForm role={role} />;
}
