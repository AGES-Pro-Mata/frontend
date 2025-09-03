import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Card from "@/components/ui/Card";
import { DefaultButton } from "@/components/ui/defaultButton";
import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "@/components/ui/typography";
import { TextInput } from "@/components/ui/textInput";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

export const Route = createFileRoute("/(index)/reset-password")({
  component: ResetPasswordPage,
});

function validatePassword(password: string) {
  // Pelo menos uma letra maiúscula e um número
  return /[A-Z]/.test(password) && /\d/.test(password);
}

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (data: { password: string; confirm: string }) => {
    setError("");
    setSuccess("");

    if (!data.password || !data.confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!validatePassword(data.password)) {
      setError("A senha deve conter ao menos uma letra maiúscula e um número.");
      return;
    }
    if (data.password !== data.confirm) {
      setError("As senhas devem ser iguais.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
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
        <Card className="w-full max-w-lg p-8 flex flex-col gap-8 shadow-md">
          <div className="space-y-4">
            <Typography className="text-xl font-semibold text-left text-on-banner-text">
              Redefinir senha
            </Typography>

            <div className="h-[1.5px] bg-on-banner-text" />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-4 items-center w-full">
                <div className="w-full max-w-xs flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <TextInput
                          type="password"
                          label="Nova senha"
                          placeholder="Nova senha"
                          required
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <TextInput
                          type="password"
                          label="Confirme a senha"
                          placeholder="Confirme a senha"
                          required
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
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
                  type="submit"
                  className={loading ? "opacity-50 pointer-events-none" : ""}
                />
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
