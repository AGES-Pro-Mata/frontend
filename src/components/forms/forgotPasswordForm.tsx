import { Typography } from "@/components/typography/typography";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForgotPasswordMutation } from "@/hooks/useForgotPasswordMutation";
import { TextInput } from "@/components/input/textInput";
import { Link } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/authcard";
import { Button } from "@/components/button/defaultButton";
import { useTranslation } from "react-i18next";
import { appToast } from "@/components/toast/toast";
import { useMemo, useEffect } from "react";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { t, i18n } = useTranslation();
  const formSchema = useMemo(
    () => 
      z
        .object({
  email: z.email(t("validation.email")),
  }),  
  [i18n.language]);
  type FormData = z.infer<typeof formSchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
  form.clearErrors();
  form.trigger();
  }, [i18n.language]);

  const mutation = useForgotPasswordMutation();

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { email: data.email },
      {
        onSuccess: (response) => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            form.reset();
            onSuccess?.();
            appToast.success(t("auth.forgot.resultSuccess"));
          } else {
            appToast.error(t("auth.forgot.resultError"));
          }
        },
        onError: () => {
          appToast.error(t("auth.forgot.resultError"));
        },
      }
    );
  };

  return (
    <AuthCard className="">
      <div className="space-y-4">
        <Typography className="text-xl font-semibold text-left text-on-banner-text">
          {t("auth.forgot.title")}
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
                      label={t("auth.forgot.email")}
                      placeholder={t("auth.forgot.emailPlaceholder")}
                      required
                      {...field}
                    />
                    <FormDescription>{t("auth.forgot.helper")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {mutation.isSuccess && mutation.data && (
            <div
              className={`text-sm rounded p-2 border ${
                mutation.data.statusCode != 500
                  ? "text-contrast-green bg-contrast-green/4 border-contrast-green"
                  : "text-default-red bg-default-red/4 border-default-red"
              }`}
            >
              {mutation.data.statusCode != 500
                ? t("auth.forgot.resultSuccess")
                : t("auth.forgot.resultError")}
            </div>
          )}
          <div className="flex flex-col items-center gap-3 mt-4 w-full">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-56"
              label={
                mutation.isPending
                  ? t("auth.forgot.submitting")
                  : t("auth.forgot.submit")
              }
            />
            <Link
              to="/auth/login"
              className="w-full sm:w-56 text-on-banner-text cursor-pointer text-center block"
            >
              <Button
                variant="ghost"
                className="w-full"
                label={t("common.back")}
              />
            </Link>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
