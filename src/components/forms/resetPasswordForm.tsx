/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { AuthCard } from "../auth";
import { PasswordInput } from "@/components/input/passwordInput";
import { Typography } from "../typography";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../button/defaultButton";
import { appToast } from "@/components/toast/toast";
import { hashPassword } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useResetPasswordMutation } from "@/hooks";
import { useEffect, useMemo, useRef, useState } from "react";

export function ResetPasswordForm({ token }: { token: string }) {
  const { t, i18n } = useTranslation();
  const formSchema = useMemo(
    () =>
      z
        .object({
          password: z
            .string()
            .min(8),
          confirm: z.string(),
        })
        .refine((data) => data.password === data.confirm, {
          message: t("validation.passwordsMustMatch"),
          path: ["confirm"],
        }),
    [t],
  );

  // Estado para controlar se o formulário foi enviado
  const [submitted, setSubmitted] = useState(false);

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const didMountLang = useRef(false);

  useEffect(() => {
    form.clearErrors();
    form.trigger();

    if (!didMountLang.current) {
      didMountLang.current = true;

      return;
    }

    const fields = Object.keys(form.formState.errors);

    if (fields.length > 0) {
      form.trigger(fields as (keyof FormData)[]);
    }
  }, [i18n.language, form]);

  const mutation = useResetPasswordMutation();
  const navigate = useNavigate();

  if (mutation.isError) {
    appToast.error(t("auth.reset.toastError"));
  }

  const onSubmit = async (data: FormData) => {
    setSubmitted(true);
    // Hash passwords
    const hashedPassword = await hashPassword(data.password);
    const hashedConfirmPassword = await hashPassword(data.confirm);

    mutation.mutate(
      {
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
        token,
      },
      {
        onSuccess: () => {
          appToast.success(t("auth.reset.toastSuccess"));
          navigate({ to: "/auth/login" });
        },
        onError: () => {
          appToast.error(t("auth.reset.toastError"));
        },
      }
    );
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="w-full max-w-xs flex flex-col gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <PasswordInput
                      label={t("auth.reset.newPassword")}
                      required
                      placeholder={t("auth.reset.newPasswordPlaceholder")}
                      {...field}
                    />
                    {/* Só mostra mensagem de erro se o formulário foi enviado */}
                    {submitted && <FormMessage />}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <PasswordInput
                      label={t("auth.reset.confirmPassword")}
                      required
                      placeholder={t("auth.reset.confirmPasswordPlaceholder")}
                      {...field}
                    />
                    {/* Só mostra mensagem de erro se o formulário foi enviado */}
                    {submitted && <FormMessage />}
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-56"
              label={mutation.isPending ? t("auth.reset.submitting") : t("auth.reset.submit")}
            />
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
