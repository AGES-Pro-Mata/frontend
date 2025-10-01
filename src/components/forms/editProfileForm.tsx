import { CanvasCard } from "@/components/cards";
import { Typography } from "@/components/typography/typography";
import { TextInput } from "@/components/inputs/textInput";
import { Button } from "@/components/buttons/defaultButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type FC, useEffect, useRef, useState } from "react";
import { useCurrentUserProfile } from "@/hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { digitsOnly, maskCep, maskPhone } from "@/lib/utils";
import { appToast } from "@/components/toast/toast";
import { useCepQuery } from "@/hooks/useCepQuery";
import { useTranslation } from "react-i18next";

// Normalize multiple backend gender variants into consistent internal values
function normalizeGender(raw?: string | null): string {
  if (!raw) return "";
  const g = raw.toString().trim().toLowerCase();
  if (["m", "male", "masculino"].includes(g)) return "male";
  if (["f", "female", "feminino"].includes(g)) return "female";
  if (
    [
      "o",
      "other",
      "outro",
      "nao-binario",
      "não-binário",
      "nao binario",
      "não binario",
    ].includes(g)
  )
    return "other";
  return ""; // unknown -> let user select
}

const schema = z
  .object({
    name: z.string().min(2, "validation.nameRequired"),
    addressLine: z.string().optional().default(""),
    country: z.string().min(1, "validation.countryRequired"),
    phone: z.string().min(8, "validation.phoneRequired"),
    zipCode: z.string().min(4, "validation.zipRequired"),
    gender: z.string().min(1, "validation.genderRequired"),
    number: z.string().optional().default(""),
    city: z.string().optional().default(""),
    institution: z.string().optional(),
  function: z.string().optional(),
  docencyDocument: z.instanceof(File).optional(),
    wantsDocencyRegistration: z.boolean().default(false),
    isForeign: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isForeign) {
      if (!data.addressLine || data.addressLine.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "validation.addressRequired",
          path: ["addressLine"],
        });
      }
      if (!data.city || data.city.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "validation.cityRequired",
          path: ["city"],
        });
      }
      if (!data.number || data.number.length < 1) {
        ctx.addIssue({
          code: "custom",
          message: "validation.numberRequired",
          path: ["number"],
        });
      }
    }
  });
type FormData = z.infer<typeof schema>;

export interface EditProfileLayoutProps {
  onBack?: () => void;
}

export const EditProfileCard: FC<EditProfileLayoutProps> = ({ onBack }) => {
  const { mapped, verified } = useCurrentUserProfile();
  const { mutate, isPending } = useUpdateUser();
  const { t } = useTranslation();
  const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
    resolver: zodResolver(schema.transform((d) => d)),
    defaultValues: {
      name: mapped?.name || "",
      addressLine: mapped?.addressLine || "",
      country: mapped?.country || "",
      phone: mapped?.phone || "",
      zipCode: mapped?.zipCode || "",
      gender: normalizeGender(mapped?.gender),
      number: mapped?.number ? String(mapped.number) : "",
      city: mapped?.city || "",
  institution: mapped?.institution || "",
  function: (mapped as any)?.function || "",
      wantsDocencyRegistration: false,
      isForeign: !!mapped?.isForeign,
    },
  });

  const [autoFilled, setAutoFilled] = useState({
    addressLine: false,
    city: false,
  });
  const originalInstitutionRef = useRef(mapped?.institution || "");
  const watchedZip = form.watch("zipCode");
  const {
    data: cepData,
    isSuccess: cepSuccess,
    isLoading: isFetchingCep,
  } = useCepQuery(watchedZip || "", { enabled: true });
  useEffect(() => {
    if (cepSuccess) {
      if (cepData?.addressLine) {
        form.setValue("addressLine", cepData.addressLine, {
          shouldValidate: true,
        });
      }
      if (cepData?.city) {
        form.setValue("city", cepData.city, { shouldValidate: true });
      }
      if (cepData?.addressLine || cepData?.city) {
        form.setValue("country", "Brasil", { shouldValidate: true });
      }
      setAutoFilled({
        addressLine: !!cepData?.addressLine,
        city: !!cepData?.city,
      });
    }
  }, [cepSuccess, cepData, form]);

  // When mapped user data loads (async), sync it into the form
  const didSetInitialValues = useRef(false);
  useEffect(() => {
    if (!mapped) return;
    // Avoid unnecessary reset if already synced
    if (didSetInitialValues.current && form.getValues("name") === mapped.name) {
      return; // already synced
    }
    // Do not overwrite user edits already in progress
    if (form.formState.isDirty) return;
    form.reset({
      name: mapped.name || "",
      addressLine: mapped.addressLine || "",
      country: mapped.country || "",
      phone: mapped.phone || "",
      zipCode: mapped.zipCode || "",
      gender: normalizeGender(mapped.gender),
      number: mapped.number ? String(mapped.number) : "",
      city: mapped.city || "",
      institution: mapped.institution || "",
      function: (mapped as any)?.function || form.getValues("function") || "",
      wantsDocencyRegistration:
        form.getValues("wantsDocencyRegistration") || false,
      isForeign: form.getValues("isForeign") || false,
    });
    didSetInitialValues.current = true;
  }, [mapped, form]);

  const submit = (data: FormData) => {
    const payload = {
      name: data.name,
      phone: digitsOnly(data.phone),
      gender: data.gender,
      addressLine: data.addressLine,
      country: data.country,
      city: data.city,
      number: data.number,
      zipCode: digitsOnly(data.zipCode),
      institution: data.institution,
      isForeign: data.isForeign,
    };
    // If user requested docency and has provided a document (institution changed or not verified) include file
    const wantsDocency = data.wantsDocencyRegistration;
    const institutionChanged =
      (data.institution || "") !== (originalInstitutionRef.current || "");
    const file = (data as any).docencyDocument as File | undefined;
    if (wantsDocency && file && (institutionChanged || !verified)) {
      // Build multipart form data manually
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v));
      });
      formData.append("teacherDocument", file);
      mutate(formData as any, {
        onSuccess: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            appToast.success(t("profile.edit.toasts.success"));
            setTimeout(() => onBack?.(), 600);
          } else appToast.error(t("profile.edit.toasts.error"));
        },
  onError: () => appToast.error(t("profile.edit.toasts.error")),
      });
      return;
    }
    mutate(payload, {
      onSuccess: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          appToast.success(t("profile.edit.toasts.success"));
          // Small delay so user sees the toast, then navigate back
          setTimeout(() => {
            onBack?.();
          }, 600);
        } else {
          appToast.error(t("profile.edit.toasts.error"));
        }
      },
  onError: () => appToast.error(t("profile.edit.toasts.error")),
    });
  };
  return (
    <CanvasCard className="w-full max-w-[clamp(40rem,82vw,980px)] mx-auto p-8 sm:p-12 bg-card shadow-md rounded-[20px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => submit(data as FormData))}
          className="flex flex-col gap-8"
          noValidate
        >
          <header className="flex flex-col items-center gap-2">
            <Typography className="text-[clamp(1.9rem,4vw,2.4rem)] font-bold text-on-banner-text m-0">
              {t("profile.edit.title")}
            </Typography>
            <Typography
              variant="body"
              className="text-center text-foreground/80"
            >
              {t("profile.edit.subtitle")}
            </Typography>
          </header>

          {/* Informações pessoais */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-start gap-4 flex-wrap">
                <Typography className="text-[clamp(1.05rem,2.2vw,1.35rem)] font-semibold text-on-banner-text m-0 select-none">
                  {t("register.sections.personal")}
                </Typography>
                <FormField
                  control={form.control}
                  name="isForeign"
                  render={({ field }) => (
                    <FormItem className="m-0 p-0">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="isForeignEdit"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("country", "");
                              form.setValue("addressLine", "");
                              form.setValue("city", "");
                              form.setValue("number", "");
                            } else {
                              form.setValue("country", "Brasil");
                            }
                            setAutoFilled({ addressLine: false, city: false });
                          }}
                        />
                        <label
                          htmlFor="isForeignEdit"
                          className="text-sm text-foreground cursor-pointer"
                        >
                          {t("register.fields.notBrazilian")}
                        </label>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full h-px bg-on-banner-text/60" />
            </div>
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
                    />
                    <FormMessage className="text-default-red text-xs" />
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
                        {t("register.fields.gender.label")} *
                      </Typography>
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("register.fields.gender.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">{t("register.fields.gender.female")}</SelectItem>
                          <SelectItem value="male">{t("register.fields.gender.male")}</SelectItem>
                          <SelectItem value="other">{t("register.fields.gender.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="text-default-red text-xs" />
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
                    />
                    <FormMessage className="text-default-red text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => {
                  const isForeign = form.watch("isForeign");
                  return (
                    <FormItem>
                      <TextInput
                        label={t("register.fields.zip")}
                        required
                        placeholder={isForeign ? "12345" : "00000-000"}
                        value={maskCep(digitsOnly(field.value || ""))}
                        onChange={(e) => {
                          const digits = digitsOnly(e.target.value).slice(0, 8);
                          const masked = maskCep(digits);
                          if (autoFilled.addressLine || autoFilled.city) {
                            setAutoFilled({ addressLine: false, city: false });
                          }
                          field.onChange(masked);
                        }}
                      />
                      <FormMessage className="text-default-red text-xs" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="addressLine"
                render={({ field }) => {
                  const isForeign = form.watch("isForeign");
                  return (
                    <FormItem>
                      <TextInput
                        label={t("register.fields.address")}
                        required={!isForeign}
                        placeholder={t("register.fields.addressPlaceholder")}
                        disabled={
                          isForeign || autoFilled.addressLine || isFetchingCep
                        }
                        {...field}
                      />
                      <FormMessage className="text-default-red text-xs" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => {
                  const isForeign = form.watch("isForeign");
                  return (
                    <FormItem>
                      <TextInput
                        label={t("register.fields.country")}
                        required
                        placeholder={isForeign ? t("register.fields.country") : "Brasil"}
                        value={field.value || (isForeign ? "" : "Brasil")}
                        disabled={!isForeign}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <FormMessage className="text-default-red text-xs" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => {
                  const isForeign = form.watch("isForeign");
                  return (
                    <FormItem>
                      <TextInput
                        label={t("register.fields.number")}
                        required={!isForeign}
                        placeholder={t("register.fields.number")}
                        disabled={isForeign}
                        {...field}
                      />
                      <FormMessage className="text-default-red text-xs" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => {
                  const isForeign = form.watch("isForeign");
                  return (
                    <FormItem>
                      <TextInput
                        label={t("register.fields.city")}
                        required={!isForeign}
                        placeholder={t("register.fields.city")}
                        disabled={isForeign || autoFilled.city || isFetchingCep}
                        {...field}
                      />
                      <FormMessage className="text-default-red text-xs" />
                    </FormItem>
                  );
                }}
              />
            </div>
          </section>

          {/* Professional Information */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Typography className="text-[clamp(1.05rem,2.2vw,1.35rem)] font-semibold text-on-banner-text">
                {t("register.sections.professional")}
              </Typography>
              <div className="w-full h-px bg-on-banner-text/60" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
                    <FormMessage className="text-default-red text-xs" />
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("register.fields.function.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">{t("register.fields.function.student")}</SelectItem>
                          <SelectItem value="teacher">{t("register.fields.function.teacher")}</SelectItem>
                          <SelectItem value="researcher">{t("register.fields.function.researcher")}</SelectItem>
                          <SelectItem value="employee">{t("register.fields.function.employee")}</SelectItem>
                          <SelectItem value="other">{t("register.fields.function.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="text-default-red text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="wantsDocencyRegistration"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3 pt-2">
                    <Checkbox
                      id="docency"
                      checked={!!field.value}
                      onCheckedChange={(c) => field.onChange(!!c)}
                    />
                    <label
                      htmlFor="docency"
                      className="text-sm text-foreground"
                    >
                      {t("register.fields.docency.ask")}
                    </label>
                  </div>
                  <FormMessage className="text-default-red text-xs" />
                </FormItem>
              )}
            />
            {form.watch("wantsDocencyRegistration") && (
              <FormField
                control={form.control}
                name="docencyDocument"
                render={({ field: { value, onChange, ...rest } }) => {
                  const institutionChanged =
                    (form.watch("institution") || "") !==
                    (originalInstitutionRef.current || "");
                  const canUpload = institutionChanged || !verified;
                  return (
                    <FormItem>
                      <div className="flex flex-col gap-2">
                        <Typography className="text-foreground font-medium">
                          {t("register.fields.docency.receiptLabel")}
                        </Typography>
                        <Typography className="text-sm text-muted-foreground">
                          {canUpload
                            ? t("profile.edit.docency.canUploadHint")
                            : t("profile.edit.docency.alreadyVerified")}
                        </Typography>
                        <div className="flex items-center gap-4">
                          <input
                            {...rest}
                            type="file"
                            accept=".pdf"
                            disabled={!canUpload}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-900 hover:file:bg-yellow-100 disabled:opacity-60"
                          />
                          {value && (
                            <Typography className="text-sm text-contrast-green">
                              {t("register.fields.docency.uploaded", { name: (value as File).name })}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <FormMessage className="text-default-red text-xs" />
                    </FormItem>
                  );
                }}
              />
            )}
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="gray"
              label={t("common.back")}
              onClick={onBack}
              className="min-w-[100px]"
            />
            <Button
              type="submit"
              label={isPending ? t("common.saving") : t("common.save")}
              disabled={isPending}
            />
          </div>
        </form>
      </Form>
    </CanvasCard>
  );
};

export default EditProfileCard;
