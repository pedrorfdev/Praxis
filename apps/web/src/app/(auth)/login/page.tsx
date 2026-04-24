"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const existingToken = localStorage.getItem("praxis:token");
    if (existingToken) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("praxis:token", response.data?.access_token ?? "");
      toast.success("Login realizado com sucesso.");
      router.replace("/");
    } catch (error) {
      toast.error("Não foi possível entrar. Verifique seu e-mail e senha.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="relative isolate mx-auto flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

      <section className="grid max-w-5xl items-center gap-8 lg:grid-cols-12">
        <div className="w-full space-y-6 lg:col-span-5 lg:-mr-16">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Plataforma segura para clínicas
          </span>
          <h1 className="text-4xl font-black tracking-tight text-primary md:text-5xl">
            Gestão clínica com foco em produtividade.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Centralize prontuários, atendimentos e evolução dos pacientes em um
            fluxo simples, com o mesmo padrão visual do seu painel.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-2 text-xs font-semibold text-muted-foreground ring-1 ring-border/50 backdrop-blur">
            Acesse para continuar do ponto onde parou
            <ArrowRight className="h-3.5 w-3.5 text-secondary" />
          </div>
        </div>

        <Card className="w-full border-border/40 bg-card/90 shadow-[0_20px_80px_-25px_rgba(0,0,0,0.35)] backdrop-blur lg:col-span-7 lg:mx-0 lg:w-[min(100%,680px)] lg:justify-self-end">
          <CardHeader className="space-y-4 px-8 pt-8 md:px-10 md:pt-10">
            <CardTitle className="text-3xl font-bold text-primary md:text-4xl">
              Entrar
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Faça login para abrir o dashboard e continuar seus atendimentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 md:px-10 md:pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@praxis.com.br"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 rounded-xl bg-background/70 px-3.5"
                  required
                />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-secondary hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 rounded-xl bg-background/70 px-3.5"
                  required
                />
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="h-11 w-full gap-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Acessar dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
