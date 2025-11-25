import { Typography } from "@/components/typography/typography";
import { z } from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TextInput } from "@/components/input/textInput";
import { PasswordInput } from "@/components/input/passwordInput";
import { Link } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/authcard";
import { Button } from "@/components/button/defaultButton";
import { hashPassword } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, type MutableRefObject } from "react";
import { useLogin } from "@/hooks";

export type LoginFormData = {
  email: string;
  password: string;
};

export const revalidateErrorsOnLanguageChange = (
  form: Pick<UseFormReturn<LoginFormData>, "formState" | "trigger">,
  didMountRef: MutableRefObject<boolean>,
) => {
  if (!didMountRef.current) {
    didMountRef.current = true;

    return;
  }
  const errorFields = Object.keys(form.formState.errors || {});

  if (errorFields.length > 0) {
    void form.trigger(errorFields as (keyof LoginFormData)[]);
  }
};

export function LoginForm() {
  const { t, i18n } = useTranslation();
  const formSchema = z.object({
    email: z.string().email(t("validation.email")),
    password: z.string().min(1, t("validation.passwordMin")),
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    const hashedPassword = await hashPassword(data.password);

    mutation.mutate({ ...data, password: hashedPassword });
  };

  const didMountLang = useRef(false);

  useEffect(() => {
    revalidateErrorsOnLanguageChange(form, didMountLang);
  }, [form, i18n.language]);

  return (
    <AuthCard>
      <div className="space-y-4">
        <Typography className="text-xl font-semibold text-left text-on-banner-text">
          {t("auth.login.title")}
        </Typography>
        <div className="h-[1.5px] bg-on-banner-text" />
      </div>
      <Form {...form}>
        <form onSubmit={(event) => void form.handleSubmit(onSubmit)(event)} className="space-y-4">
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="w-full max-w-xs">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      type="email"
                      label={t("auth.login.email")}
                      placeholder={t("auth.login.emailPlaceholder")}
                      required
                      {...field}
                    />
                    <FormMessage className="text-default-red" />
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
                    <PasswordInput
                      label={t("auth.login.password")}
                      placeholder={t("auth.login.passwordPlaceholder")}
                      required
                      {...field}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />
              <Link to="/auth/forgot-password" className="underline">
                <Typography variant="body" className="text-foreground text-sm">
                  {t("auth.login.forgot")}
                </Typography>
              </Link>
            </div>
          </div>

          {mutation.isError && (
            <div className="text-sm rounded p-2 border text-default-red bg-default-red/4 border-default-red">
              {t("auth.login.invalidCredentials")}
            </div>
          )}

          <div className="flex flex-col items-center gap-3 mt-4 w-full">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-56"
              label={mutation.isPending ? t("auth.login.submitting") : t("auth.login.submit")}
            />

            <Link to="/auth/register" className="w-full sm:w-56">
              <Button variant="secondary" className="w-full" label={t("auth.login.register")} />
            </Link>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
