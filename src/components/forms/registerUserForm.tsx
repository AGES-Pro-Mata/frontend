import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TextInput } from "@/components/input/textInput";
import { PasswordInput } from "@/components/input/passwordInput";
import { Typography } from "@/components/typography/typography";
import { Button } from "@/components/button/defaultButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { COUNTRIES } from "@/lib/countries";
import { appToast } from "@/components/toast/toast";
import {
  digitsOnly,
  hashPassword,
  isValidBrazilZip,
  isValidCpf,
  isValidForeignZip,
  maskCep,
  maskCpf,
  maskPhone,
} from "@/lib/utils";
import type { RegisterUserPayload } from "@/api/user";
import { CanvasCard } from "@/components/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useCepQuery, useRegisterUser } from "@/hooks";

export function RegisterUser() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const formSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, t("validation.nameRequired")),
          email: z.email(t("validation.email")),
          phone: z.string().min(8, t("validation.phoneRequired")),
          document: z.string().optional().default(""),
          rg: z.string().optional().default(""),
          gender: z.string().min(1, t("validation.genderRequired")),
          zipCode: z.string().min(5, t("validation.zipRequired")),
          country: z.string().min(2, t("validation.countryRequired")),
          isForeign: z.boolean().default(false),
          addressLine: z.string().optional().default(""),
          city: z.string().optional(),
          number: z.string().optional(),
          password: z.string().min(6, t("validation.passwordMin")),
          confirmPassword: z.string().min(6, t("validation.passwordMin")),
          institution: z.string().optional().default(""),
          function: z.string().optional().default(""),
          wantsDocencyRegistration: z.boolean().default(false),
          docencyDocument: z.instanceof(File).optional(),
          acceptTerms: z.boolean().refine((val) => val === true, {
            message: t("validation.mustAcceptTerms"),
          }),
        })
        .superRefine((data, ctx) => {
          if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: "custom",
              message: t("validation.passwordsMustMatch"),
              path: ["confirmPassword"],
            });
          }

          if (data.docencyDocument) {
            if (data.docencyDocument.type !== "application/pdf") {
              ctx.addIssue({
                code: "custom",
                message: t("validation.pdfOnly"),
                path: ["docencyDocument"],
              });
            }
            if (data.docencyDocument.size > 20 * 1024 * 1024) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.max20mb"),
                path: ["docencyDocument"],
              });
            }
          }

          if (!data.isForeign) {
            if (!data.city || data.city.length < 2) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.cityRequired"),
                path: ["city"],
              });
            }
            if (!data.number || data.number.length < 1) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.numberRequired"),
                path: ["number"],
              });
            }
            if (!data.addressLine || data.addressLine.length < 2) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.addressRequired"),
                path: ["addressLine"],
              });
            }
            if (!isValidBrazilZip(data.zipCode)) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.cep8"),
                path: ["zipCode"],
              });
            }
            if (!data.document || !isValidCpf(data.document)) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.cpfInvalid"),
                path: ["document"],
              });
            }
            if (!data.rg || digitsOnly(data.rg).length < 5) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.rgInvalid"),
                path: ["rg"],
              });
            }
          } else {
            if (!isValidForeignZip(data.zipCode)) {
              ctx.addIssue({
                code: "custom",
                message: t("validation.zipInvalid"),
                path: ["zipCode"],
              });
            }
          }
        }),
    // Recreate schema when language changes so messages are translated
    [i18n.language],
  );

  type FormData = z.infer<typeof formSchema>;
  const [autoFilled, setAutoFilled] = useState({
    addressLine: false,
    city: false,
  });
  const { mutate: registerUser, isPending } = useRegisterUser();
  const form = useForm<z.input<typeof formSchema>, any, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document: "",
      rg: "",
      gender: "",
      zipCode: "",
      country: "Brasil",
      isForeign: false,
      addressLine: "",
      city: "",
      number: "",
      password: "",
      confirmPassword: "",
      institution: "",
      function: "",
      wantsDocencyRegistration: false,
      docencyDocument: undefined,
      acceptTerms: false,
    },
  });

  const isForeign = form.watch("isForeign");
  const watchedZip = form.watch("zipCode");

  // Re-run validation on language change only for fields that already have errors, and skip on initial mount
  const didMountLang = useRef(false);

  useEffect(() => {
    if (!didMountLang.current) {
      didMountLang.current = true;

      return;
    }
    const errorFields = Object.keys(form.formState.errors || {});

    if (errorFields.length > 0) {
      // retrigger only errored fields to refresh message language
      void form.trigger(errorFields as (keyof FormData)[]);
    }
  }, [i18n.language]);

  const {
    isLoading: isFetchingCep,
    data: cepData,
    isSuccess: isSuccessCep,
  } = useCepQuery(watchedZip || "", {
    enabled: !isForeign,
  });

  useEffect(() => {
    if (isSuccessCep) {
      if (cepData?.addressLine) {
        form.setValue("addressLine", cepData.addressLine, {
          shouldValidate: true,
        });
      }
    }
    if (cepData?.city) {
      form.setValue("city", cepData.city, { shouldValidate: true });
    }
    setAutoFilled({
      addressLine: !!cepData?.addressLine,
      city: !!cepData?.city,
    });
  }, [isSuccessCep, cepData]);

  useEffect(() => {
    if (isForeign) {
      setAutoFilled({ addressLine: false, city: false });
    }
  }, [isForeign]);

  const onSubmit = async (data: FormData) => {
    const sanitizedPhone = digitsOnly(data.phone);

    // Hash passwords
    const hashedPassword = await hashPassword(data.password);
    const hashedConfirmPassword = await hashPassword(data.confirmPassword);

    const payload: RegisterUserPayload = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      phone: sanitizedPhone,
      gender: data.gender,
      document: data.document ? (isForeign ? data.document : maskCpf(data.document)) : undefined,
      rg: data.rg || undefined,
      country: data.country,
      userType: data.wantsDocencyRegistration ? "PROFESSOR" : "GUEST",
      institution: data.institution || "",
      isForeign: data.isForeign,
      addressLine: data.addressLine || "",
      city: data.city || "",
      zipCode: data.zipCode,
      number: data.number ? parseInt(data.number, 10) : undefined,
      teacherDocument: data.docencyDocument,
    };

    registerUser(payload, {
      onSuccess: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          form.reset();
          appToast.success(t("register.toasts.success"));
          setAutoFilled({ addressLine: false, city: false });
          void navigate({ to: "/auth/login" });
        } else {
          appToast.error(t("register.toasts.error"));
        }
      },
      onError: () => {
        appToast.error(t("register.toasts.error"));
      },
    });
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-8 lg:px-16 py-6">
      <CanvasCard className="w-full max-w-[1180px] p-6 sm:p-10 lg:p-12">
        <div className="text-center space-y-2">
          <Typography variant="h2" className="pb-2 text-on-banner-text">
            {t("register.title")}
          </Typography>
          <Typography variant="body">{t("register.subtitle")}</Typography>
        </div>

        <Form {...form}>
          <form
            onSubmit={(event) => {
              void form.handleSubmit(onSubmit)(event);
            }}
            className="mt-6 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-start gap-4">
              <Typography className="font-medium text-foreground text-lg">
                {t("register.sections.personal")}
              </Typography>

              <FormField
                control={form.control}
                name="isForeign"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="isForeign"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("city", "");
                            form.setValue("number", "");
                            form.setValue("document", "");
                            form.setValue("rg", "");
                            form.setValue("country", "");
                          } else {
                            form.setValue("country", "Brasil");
                          }
                          // Re-run validation to clear/set field errors according to new mode
                          setTimeout(
                            () =>
                              void form.trigger([
                                "city",
                                "number",
                                "zipCode",
                                "document",
                                "rg",
                                "addressLine",
                                "country",
                              ]),
                            0,
                          );
                        }}
                      />
                      <Label htmlFor="isForeign">
                        <Typography variant="body" className="text-foreground">
                          {t("register.fields.notBrazilian")}
                        </Typography>
                      </Label>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={t("register.fields.fullName")}
                      required
                      placeholder={t("register.fields.fullName")}
                      {...field}
                      onBlur={field.onBlur}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={t("auth.login.email")}
                      required
                      type="email"
                      placeholder={t("auth.login.emailPlaceholder")}
                      {...field}
                      onBlur={field.onBlur}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={t("register.fields.phone")}
                      required
                      placeholder="(51) 99999-9999"
                      value={maskPhone(field.value || "")}
                      onChange={(e) => {
                        const digits = digitsOnly(e.target.value).slice(0, 11);

                        field.onChange(maskPhone(digits));
                      }}
                      onBlur={field.onBlur}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={
                        isForeign
                          ? t("register.fields.document.passport")
                          : t("register.fields.document.cpf")
                      }
                      required
                      placeholder={
                        isForeign ? t("register.fields.document.passportNumber") : "XXX.XXX.XXX-XX"
                      }
                      value={isForeign ? field.value || "" : maskCpf(field.value || "")}
                      onChange={(e) => {
                        if (isForeign) {
                          field.onChange(e.target.value);
                        } else {
                          const digits = digitsOnly(e.target.value).slice(0, 11);
                          const masked = maskCpf(digits);

                          field.onChange(masked);
                        }
                      }}
                      onBlur={field.onBlur}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-0">
                      <Typography className="text-foreground font-medium mb-1">
                        {t("register.fields.gender.label")}
                      </Typography>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("register.fields.gender.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t("register.fields.gender.male")}</SelectItem>
                          <SelectItem value="female">
                            {t("register.fields.gender.female")}
                          </SelectItem>
                          <SelectItem value="other">{t("register.fields.gender.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label="RG"
                      placeholder="999999999"
                      required
                      disabled={isForeign}
                      value={digitsOnly(field.value || "")}
                      onChange={(e) => {
                        const digits = digitsOnly(e.target.value).slice(0, 15);

                        field.onChange(digits);
                      }}
                      onBlur={field.onBlur}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={t("register.fields.zip")}
                      required
                      placeholder={isForeign ? "12345" : "98460-000"}
                      value={maskCep(field.value || "")}
                      onChange={(e) => {
                        const digits = digitsOnly(e.target.value).slice(0, 8);
                        const masked = maskCep(digits);

                        if (autoFilled.addressLine || autoFilled.city) {
                          setAutoFilled({ addressLine: false, city: false });
                        }
                        field.onChange(masked);
                      }}
                      onBlur={field.onBlur}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-0">
                      <Typography className="text-foreground font-medium">
                        {t("register.fields.country")}
                      </Typography>
                      {isForeign ? (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("register.fields.selectCountry")} />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <TextInput
                          label=""
                          required={false}
                          placeholder=""
                          value={field.value || "Brasil"}
                          disabled
                        />
                      )}
                    </div>
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={t("register.fields.address")}
                      required
                      placeholder={t("register.fields.addressPlaceholder")}
                      disabled={isForeign || autoFilled.addressLine || isFetchingCep}
                      {...field}
                      onBlur={field.onBlur}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={t("register.fields.city")}
                      required={!isForeign}
                      placeholder={t("register.fields.city")}
                      disabled={isForeign || autoFilled.city || isFetchingCep}
                      {...field}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <TextInput
                      label={t("register.fields.number")}
                      required
                      placeholder={t("register.fields.number")}
                      disabled={isForeign}
                      {...field}
                    />
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção de Segurança */}
            <div className="space-y-4">
              <Typography className="font-medium text-foreground text-lg">
                {t("register.sections.security")}
              </Typography>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <PasswordInput
                        label={t("register.fields.password")}
                        required
                        placeholder={t("register.fields.password")}
                        {...field}
                      />
                      <FormMessage className="text-default-red" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <PasswordInput
                        label={t("register.fields.confirmPassword")}
                        required
                        placeholder={t("register.fields.confirmPassword")}
                        {...field}
                      />
                      <FormMessage className="text-default-red" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção de Informações Profissionais */}
            <div className="space-y-4">
              <Typography className="font-medium text-foreground text-lg">
                {t("register.sections.professional")}
              </Typography>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <TextInput
                        label={t("register.fields.institution")}
                        placeholder={t("register.fields.institutionPlaceholder")}
                        {...field}
                      />
                      <FormMessage className="text-default-red" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="function"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-0">
                        <Typography className="text-foreground font-medium mb-1">
                          {t("register.fields.function.label")}
                        </Typography>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("register.fields.function.select")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">
                              {t("register.fields.function.student")}
                            </SelectItem>
                            <SelectItem value="teacher">
                              {t("register.fields.function.teacher")}
                            </SelectItem>
                            <SelectItem value="researcher">
                              {t("register.fields.function.researcher")}
                            </SelectItem>
                            <SelectItem value="employee">
                              {t("register.fields.function.employee")}
                            </SelectItem>
                            <SelectItem value="other">
                              {t("register.fields.function.other")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="text-default-red" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="wantsDocencyRegistration"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="wantsDocencyRegistration"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="wantsDocencyRegistration">
                        <Typography variant="body" className="text-foreground">
                          {t("register.fields.docency.ask")}
                        </Typography>
                      </Label>
                    </div>
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />

              {form.watch("wantsDocencyRegistration") && (
                <FormField
                  control={form.control}
                  name="docencyDocument"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2">
                        <Typography className="text-foreground font-medium">
                          {t("register.fields.docency.receiptLabel")}
                        </Typography>
                        <Typography className="text-sm text-muted-foreground">
                          {t("register.fields.docency.receiptHint")}
                        </Typography>
                        <div className="flex items-center gap-4">
                          <input
                            {...field}
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];

                              onChange(file);
                            }}
                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-900 hover:file:bg-yellow-100"
                          />
                          {value && (
                            <Typography className="text-sm text-contrast-green">
                              {t("register.fields.docency.uploaded", {
                                name: value.name,
                              })}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <FormMessage className="text-default-red" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Aceite de Termos */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="acceptTerms">
                        <Typography variant="body" className="text-foreground">
                          {t("register.fields.terms.accept", {
                            terms: t("register.fields.terms.terms"),
                            privacy: t("register.fields.terms.privacy"),
                          })}
                        </Typography>
                      </Label>
                    </div>
                    <FormMessage className="text-default-red" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full max-w-xs"
                label={t("register.cta.create")}
                disabled={isPending}
              />
              <Typography className="text-sm text-muted-foreground">
                {t("register.cta.haveAccount")}{" "}
                <Link to="/auth/login" className="text-primary underline">
                  {t("register.cta.login")}
                </Link>
              </Typography>
            </div>
          </form>
        </Form>
      </CanvasCard>
    </div>
  );
}
