"use client";

import { CaregiverForm } from "@/components/caregivers/caregivers-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCaregiverPage() {

  const handleSave = (data: any) => {
    console.log("Payload enviado:", data);
  };

  return (
    <div className="space-y-8 p-8 pt-6 w-5xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">
      <Link 
        href="/caregivers" 
        className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <CaregiverForm onSubmit={handleSave} />
    </div>
  );
}