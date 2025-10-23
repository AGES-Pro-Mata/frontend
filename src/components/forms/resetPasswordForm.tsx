import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { AuthCard } from "../auth";
import { TextInput } from "@/components/input/textInput";
import { Typography } from "../typography";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../button/defaultButton";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import { appToast } from "@/components/toast/toast";
import { hashPassword } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, "validation.passwordMin" as unknown as string)
      .regex(/[A-Z]/, "validation.passwordUpper" as unknown as string)
      .regex(/\d/, "validation.passwordNumber" as unknown as string),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "validation.passwordsMustMatch" as unknown as string,
    path: ["confirm"],
  });

type FormData = z.infer<typeof formSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const mutation = useResetPasswordMutation();
  const navigate = useNavigate();

  if (mutation.isSuccess) {
    appToast.success(t("auth.reset.toastSuccess"));
    navigate({ to: "/auth/login" });
  }

  if (mutation.isError) {
    appToast.error(t("auth.reset.toastError"));
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
          {t("auth.reset.title")}
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
                      label={t("auth.reset.newPassword")}
                      placeholder={t("auth.reset.newPasswordPlaceholder")}
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
                      label={t("auth.reset.confirmPassword")}
                      placeholder={t("auth.reset.confirmPasswordPlaceholder")}
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
              className="w-full sm:w-56"
              label={
                mutation.isPending
                  ? t("auth.reset.submitting")
                  : t("auth.reset.submit")
              }
            />
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
