"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      toast.error("Token de recuperação ausente.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    // Validação seguindo as regras do domínio core
    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("A senha deve conter pelo menos uma letra maiúscula.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      toast.error("A senha deve conter pelo menos um número.");
      return;
    }

    setIsPending(true);

    try {
      await api.post("/auth/reset", {
        token,
        password,
      });

      setIsSuccess(true);
      toast.success("Senha redefinida com sucesso!");
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao redefinir senha.";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full border-border/40 bg-card/80 shadow-xl backdrop-blur text-center p-6">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Tudo pronto!
          </CardTitle>
          <CardDescription>
            Sua senha foi atualizada com sucesso. Você será redirecionado para o login em instantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/login")} className="w-full font-semibold">
            Ir para Login agora
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border/40 bg-card/80 shadow-xl backdrop-blur">
      <CardHeader className="space-y-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
          <KeyRound className="h-3.5 w-3.5" />
          Nova senha
        </span>
        <CardTitle className="text-3xl font-bold text-primary">
          Redefinir senha
        </CardTitle>
        <CardDescription>
          Escolha uma senha forte para proteger seu acesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isPending || !token}
            className="h-10 w-full gap-2 rounded-lg font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Redefinir senha"
            )}
          </Button>
          {!token && (
            <p className="text-center text-xs font-medium text-destructive mt-4">
              Atenção: Link de recuperação inválido ou incompleto.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center w-full gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Carregando formulário...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
