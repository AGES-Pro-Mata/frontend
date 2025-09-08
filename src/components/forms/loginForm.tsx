import { Typography } from "@/components/typography/typography";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useLogin } from "@/hooks/useLogin";
import { TextInput } from "@/components/inputs/textInput";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/authcard";
import { Button } from "@/components/buttons/defaultButton";
import { toast } from "sonner";
import { hashPassword } from "@/lib/utils";

const formSchema = z.object({
  email: z.email("Digite um e-mail válido."),
  password: z.string().min(1, "Digite sua senha."),
});

type FormData = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useLogin();

  const onSubmit = async (data: FormData) => {
    try {
      const hashedPassword = await hashPassword(data.password);
      mutation.mutate(
        { ...data, password: hashedPassword },
        {
          onSuccess: (response) => {
            if (response.statusCode >= 200 && response.statusCode < 300) {
              form.reset();
              toast.success("Login realizado com sucesso!");
              onSuccess?.();
              navigate({ to: "/" });
            } else {
              toast.error(response.message || "Erro ao fazer login");
            }
          },
          onError: () => {
            toast.error("Erro ao fazer login. Tente novamente.");
          },
        }
      );
    } catch (error) {
      toast.error("Erro interno. Tente novamente.");
    }
  };

  return (
    <AuthCard>
      <div className="space-y-4">
        <Typography className="text-xl font-semibold text-left text-on-banner-text">
          Login
        </Typography>
        <div className="h-[1.5px] bg-on-banner-text" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4 items-center w-full">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full max-w-xs">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      type="password"
                      label="Senha"
                      placeholder="Sua senha"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link to="/auth/forgot-password" className="underline">
                <Typography variant="body" className="text-foreground text-sm">
                  Esqueci a senha
                </Typography>
              </Link>
            </div>
          </div>

          {mutation.isError && (
            <div className="text-sm rounded p-2 border text-default-red bg-default-red/4 border-default-red">
              Credenciais inválidas. Tente novamente.
            </div>
          )}

          <div className="flex flex-col items-center gap-2 mt-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-40"
              label={mutation.isPending ? "Entrando..." : "Entrar"}
            />

            <Link to="/auth/register">
              <Button
                variant="secondary"
                className="w-full"
                label="Cadastre-se"
              />
            </Link>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
