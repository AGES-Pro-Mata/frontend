import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Typography } from "@/components/ui/typography";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { TextInput } from "@/components/ui/textInput";
import { Button } from "@/components/ui/defaultButton";
import CanvasCard from "@/components/ui/canvasCard";

export const Route = createFileRoute("/(index)/auth/forgot-password")({
  component: ForgotPasswordPage,
});

const formSchema = z.object({
  email: z.email("Digite um e-mail válido."),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-2 items-center w-full">
                <div className="w-full max-w-xs">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <TextInput
                          type="email"
                          label="Email"
                          placeholder="seu@email.com"
                          required
                          {...field}
                        />
                        <FormDescription>
                          Você receberá um email para redefinir sua senha caso
                          haja uma conta cadastrada.
                        </FormDescription>
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-40"
                  label={loading ? "Enviando..." : "Enviar"}
                  onClick={() => {}}
                />
                <Link
                  to="/auth/login"
                  className="w-40 mt-2 text-on-banner-text cursor-pointer text-center block"
                >
                  <Button
                    variant="ghost"
                    className="w-full"
                    label="Voltar"
                    onClick={() => <Link to="/auth/login" />}
                  />
                </Link>
              </div>
            </form>
          </Form>
        </CanvasCard>
      </div>
    </div>
  );
}
