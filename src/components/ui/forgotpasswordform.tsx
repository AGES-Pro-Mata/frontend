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
import { useForgotPasswordMutation } from "@/hooks/useForgotPasswordMutation";
import { TextInput } from "@/components/ui/textInput";
import { Link } from "@tanstack/react-router";
import { AuthCard } from "./authcard";
import { Button } from "./defaultButton";

const formSchema = z.object({
  email: z.email("Digite um e-mail válido."),
});

type FormData = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const mutation = useForgotPasswordMutation();

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <AuthCard>
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
                      Você receberá um email para redefinir sua senha caso haja
                      uma conta cadastrada.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {mutation.isError && (
            <div className="text-sm text-default-red bg-default-red/4 border border-default-red rounded p-2">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Não foi possível enviar o email. Tente novamente."}
            </div>
          )}
          {mutation.isSuccess && (
            <div className="text-sm text-contrast-green bg-contrast-green/4 border border-contrast-green rounded p-2">
              Email enviado! Verifique sua caixa de entrada.
            </div>
          )}
          <div className="flex flex-col items-center gap-2 mt-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-40"
              label={mutation.isPending ? "Enviando..." : "Enviar"}
            />
            <Link
              to="/auth/login"
              className="w-40 mt-2 text-on-banner-text cursor-pointer text-center block"
            >
              <Button variant="ghost" className="w-full" label="Voltar" />
            </Link>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
