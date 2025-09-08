import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { AuthCard } from "../auth";
import { TextInput } from "../inputs";
import { Typography } from "../typography";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../buttons/defaultButton";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import { toast } from "sonner";
import { hashPassword } from "@/lib/utils";

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

export function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const mutation = useResetPasswordMutation();
  const navigate = useNavigate();

  if (mutation.isSuccess) {
    toast.success("Senha redefinida com sucesso");
    navigate({ to: "/auth/login" });
  }

  if (mutation.isError) {
    toast.error("Erro ao redefinir senha");
  }

  const onSubmit = async (data: FormData) => {
    // Hash passwords
    const hashedPassword = await hashPassword(data.password);
    const hashedConfirmPassword = await hashPassword(data.confirm);

    mutation.mutate({
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      token,
    });
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
        </form>
      </Form>
    </AuthCard>
  );
}
