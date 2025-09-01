import React, { useState } from "react";
import CanvasCard from "@/components/ui/CanvasCard";
import { DefaultButton } from "@/components/ui/defaultButton";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export const Route = createFileRoute("/(index)/reset-password")({
  component: ResetPasswordPage,
});

function validatePassword(password: string) {
  // Pelo menos uma letra maiúscula e um número
  return /[A-Z]/.test(password) && /\d/.test(password);
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!validatePassword(password)) {
      setError("A senha deve conter ao menos uma letra maiúscula e um número.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas devem ser iguais.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setSuccess("Senha redefinida com sucesso!");
      } else {
        setError("Não foi possível redefinir a senha. Tente novamente.");
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
                Redefinir senha
            </Typography>
              
            <div className="h-[1.5px] bg-on-banner-text" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-4 items-center w-full">
              <div className="w-full max-w-xs flex flex-col gap-4">
                <label
                  className="text-sm font-medium text-left"
                  htmlFor="password"
                >
                  Nova senha*
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-100"
                />
                <label
                  className="text-sm font-medium text-left"
                  htmlFor="confirm"
                >
                  Confirme a senha*
                </label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirme a senha"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="bg-gray-100"
                />
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
              <DefaultButton
                label={loading ? "Confirmando..." : "Confirmar"}
                variant="primary"
                onClick={() => handleSubmit({} as React.FormEvent)}
              />
            </div>
          </form>
        </CanvasCard>
      </div>
    </div>
  );
}
