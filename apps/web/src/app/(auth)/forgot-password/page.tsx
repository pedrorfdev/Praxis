"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      await api.post("/auth/forgot", { email });
      toast.success("Se o e-mail existir, enviaremos instruções de recuperação.");
    } catch (error: any) {
      toast.error("Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <Card className="w-full border-border/40 bg-card/80 shadow-xl backdrop-blur">
        <CardHeader className="space-y-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            <MailCheck className="h-3.5 w-3.5" />
            Recuperação de acesso
          </span>
          <CardTitle className="text-3xl font-bold text-primary">
            Esqueci minha senha
          </CardTitle>
          <CardDescription>
            Informe seu e-mail para receber orientações de redefinição.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@praxis.com.br"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 w-full gap-2 rounded-lg font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar instruções"
              )}
            </Button>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar para login
            </Link>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
