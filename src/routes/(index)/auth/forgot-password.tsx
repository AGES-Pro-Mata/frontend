import React, { useState } from "react";
import CanvasCard from "@/components/ui/canvasCard";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TextInput } from "@/components/ui/textInput";
import { Typography } from "@/components/ui/typography";


export const Route = createFileRoute("/(index)/auth/forgot-password")({
  component: ForgotPasswordPage,
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("O campo email é obrigatório.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSuccess(
          "Email enviado com sucesso! Verifique sua caixa de entrada."
        );
      } else {
        setError("Não foi possível enviar o email. Tente novamente.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-background">
  <div className="flex justify-center pt-16 pb-20">
        <CanvasCard className="w-full max-w-lg p-8 flex flex-col gap-8 shadow-md">
          <div className="space-y-4">
            <Typography className="text-xl font-semibold text-left text-on-banner-text">
              Esqueci a senha
            </Typography>
            <div className="h-[1.5px] bg-on-banner-text" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2 items-center w-full">
              <div className="w-full max-w-xs">
                <TextInput
                  type="email"
                  label="Email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Typography className="text-xs text-on-banner-text w-full mt-2">
                  Você receberá um email para redefinir sua senha caso haja uma conta cadastrada.
                </Typography>
              </div>
            </div>
            {error && (
              <div className="text-sm text-default-red bg-default-red/4 border border-default-red rounded p-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-contrast-green bg-contrast-green/4 border border-contrast-green rounded p-2">
                {success}
              </div>
            )}
            <div className="flex flex-col items-center gap-2 mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-56 h-11 text-base font-medium cursor-pointer bg-contrast-green hover:bg-contrast-green/80 text-white"
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-40 mt-2 text-on-banner-text cursor-pointer"
                onClick={() => <Link to="/auth/login">Voltar</Link>}
              >
                Voltar
              </Button>
            </div>
          </form>
        </CanvasCard>
      </div>
    </div>
  );
}
