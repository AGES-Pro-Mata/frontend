import { useNavigate } from "@tanstack/react-router";
import { Typography } from "@/components/ui/typography";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/ui/textInput";
import { Button } from "@/components/ui/defaultButton";
import { AuthCard } from "./authcard";
import { useResetPasswordMutation } from "@/hooks/UseResetPasswordMutation";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres.")
      .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula.")
      .regex(/\d/, "A senha deve conter ao menos um número."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas devem ser iguais.",
    path: ["confirm"],
  });

type FormData = z.infer<typeof formSchema>;

interface ResetPasswordProps {
  onSuccess?: () => void;
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const mutation = useResetPasswordMutation();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { password: data.password, confirmPassword: data.confirm },
      {
        onSuccess: (response) => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            form.reset();
            onSuccess?.();
            navigate({ to: "/auth/login" });
          }
        },
      }
    );
  };

  return (
    <AuthCard>
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
                      label="Nova senha*"
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
                      label="Confirme a senha*"
                      placeholder="Confirme a senha"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-40"
              label={mutation.isPending ? "Confirmando..." : "Confirmar"}
            />
          </div>
          {mutation.isSuccess && mutation.data && mutation.data.statusCode !== 500 && (
            <div className="text-sm text-contrast-green bg-contrast-green/4 border border-contrast-green rounded p-2">
              Senha redefinida com sucesso. Tente fazer login novamente.
            </div>
          )}
          {mutation.isError && (
            <div className="text-sm text-default-red bg-default-red/4 border border-default-red rounded p-2">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Ocorreu um erro ao redefinir a senha. Tente novamente."}
            </div>
          )}
          <div className="flex flex-col items-center gap-2 mt-2"></div>
        </form>
      </Form>
    </AuthCard>
  );
}

