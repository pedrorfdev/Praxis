"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("praxis:token", response.data?.accessToken ?? "");
      router.push("/");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-2xl border border-border/40 p-6">
        <h1 className="text-2xl font-bold text-primary">Entrar</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Entrando..." : "Acessar"}
        </Button>
      </form>
    </main>
  );
}
