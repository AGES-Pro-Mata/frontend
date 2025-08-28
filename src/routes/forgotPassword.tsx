import React, { useState } from "react";
import CanvasCard from "@/components/ui/CanvasCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { FooterLayout } from "@/components/layouts/dashboard/footer.layout";
import { HeaderLayout } from "@/components/layouts/dashboard/header.layout";

export const Route = createFileRoute("/forgotPassword")({
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
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderLayout />
      <div className="flex-grow flex items-center justify-center">
        <CanvasCard className="w-full max-w-lg p-8 flex flex-col gap-8">
          <div className="space-y-4 ">
            <h2 className="text-xl font-semibold text-left -ml-8" style={{ color: "#484848" }}>
              Esqueci a senha
            </h2>
            <div className="h-[1.5px] bg-gray-600 -mx-8 w-auto" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500">
              Você receberá um email para redefinir sua senha caso haja uma
              conta cadastrada.
            </p>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
                {success}
              </div>
            )}
            <div className="flex flex-col items-center gap-2 mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-56 h-11 text-base font-medium cursor-pointer bg-green-600 hover:bg-green-800 text-white"
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-40 mt-2 text-gray-600 cursor-pointer "
                onClick={() => window.history.back()}
              >
                Voltar
              </Button>
            </div>
          </form>
        </CanvasCard>
      </div>
      <FooterLayout />
    </div>
  );
}
