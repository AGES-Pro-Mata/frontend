/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button } from "@/components/button/defaultButton";
import { TextInput } from "@/components/input/textInput";
import { Typography } from "@/components/typography/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { COUNTRIES } from "@/lib/countries";
import {
  digitsOnly,
  isValidBrazilZip,
  isValidCpf,
  isValidForeignZip,
  maskCep,
  maskCpf,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "../form";
import { t } from "i18next";
import type { UpdateUserAdminPayload } from "@/api/user";
import { MoonLoader } from "react-spinners";
import { appToast } from "../toast/toast";
import { useCepQuery, useGetAdminUser, useUpdateAdminUser } from "@/hooks";

const EditUserAdminSchema = z
  .object({
    name: z.string().min(2, "Informe o nome completo"),
    email: z.email("Digite um e-mail válido"),
    phone: z.string().min(8, "Informe o telefone"),
    document: z.string().min(1, "Informe o documento"),
    rg: z.string().optional().default(""),
    gender: z.string(),
    zipCode: z.string().min(5, "Informe o CEP/ZIP"),
    country: z.string().min(2, "Informe o país"),
    isForeign: z.boolean().default(false),
    addressLine: z.string().optional().default(""),
    city: z.string().optional(),
    number: z.string().optional(),
    isAdmin: z.boolean().default(false),
    isProfessor: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isForeign) {
      if (!data.city || data.city.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Cidade e número são obrigatórios para brasileiros",
          path: ["city"],
        });
      }
      if (!data.number || data.number.length < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Cidade e número são obrigatórios para brasileiros",
          path: ["number"],
        });
      }
      if (!data.addressLine || data.addressLine.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Endereço é obrigatório",
          path: ["addressLine"],
        });
      }
      if (!isValidBrazilZip(data.zipCode)) {
        ctx.addIssue({
          code: "custom",
          message: "CEP deve conter 8 dígitos",
          path: ["zipCode"],
        });
      }
      if (!data.document || !isValidCpf(data.document)) {
        ctx.addIssue({
          code: "custom",
          message: "Documento Inválido",
          path: ["document"],
        });
      }
      if (!data.rg || digitsOnly(data.rg).length < 5) {
        ctx.addIssue({
          code: "custom",
          message: "RG inválido",
          path: ["rg"],
        });
      }
    } else {
      if (!isValidForeignZip(data.zipCode)) {
        ctx.addIssue({
          code: "custom",
          message: "ZIP inválido",
          path: ["zipCode"],
        });
      }
    }
  });

export type TEditUserAdminSchema = z.infer<typeof EditUserAdminSchema>;

type EditUserAdminProps = {
  userId: string;
};
export function EditUserAdmin({ userId }: EditUserAdminProps) {
  const { data, isFetching, isLoading } = useGetAdminUser({ id: userId });

  const navigate = useNavigate();
  const [autoFilled, setAutoFilled] = useState({
    addressLine: false,
    city: false,
  });
  const { mutate, isPending } = useUpdateAdminUser();
  const form = useForm<
    z.input<typeof EditUserAdminSchema>,
    unknown,
    z.output<typeof EditUserAdminSchema>
  >({
    resolver: zodResolver(EditUserAdminSchema),
    defaultValues: React.useMemo(
      () => ({
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        document: data?.document,
        rg: data?.rg ?? undefined,
        gender: data?.gender,
        zipCode: data?.zipCode,
        country: data?.country,
        isForeign: data?.isForeign,
        addressLine: data?.addressLine,
        city: data?.city,
        number: data?.number?.toString(),
        isAdmin: data?.isAdmin,
        isProfessor: data?.isProfessor,
      }),
      [data],
    ),
  });

  const isForeign = form.watch("isForeign");
  const watchedZip = form.watch("zipCode");

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
      if (cepData?.city) {
        form.setValue("city", cepData.city, { shouldValidate: true });
      }
      setAutoFilled({
        addressLine: !!cepData?.addressLine,
        city: !!cepData?.city,
      });
    }
  }, [isSuccessCep, cepData]);

  useEffect(() => {
    if (isForeign) {
      setAutoFilled({ addressLine: false, city: false });
    } else {
      if (cepData?.addressLine) {
        form.setValue("addressLine", cepData.addressLine, {
          shouldValidate: true,
        });
      }
      if (cepData?.city) {
        form.setValue("city", cepData.city, { shouldValidate: true });
      }
      setAutoFilled({
        addressLine: !!cepData?.addressLine,
        city: !!cepData?.city,
      });
    }
  }, [isForeign]);

  const onSubmit = (data: TEditUserAdminSchema) => {
    const sanitizedPhone = digitsOnly(data.phone);

    // Hash password

    const payload = {
      ...data,
      phone: sanitizedPhone,
      document: data.document ? (isForeign ? data.document : maskCpf(data.document)) : undefined,
      rg: data.rg ? data.rg : undefined,
      userType: data.isAdmin ? "ADMIN" : data.isProfessor ? "PROFESSOR" : "GUEST",
      institution: data.isProfessor ? "PUCRS" : "",
    };

    if (data.isAdmin && data.isProfessor) {
      return appToast.error("Um usuário não pode ser administrador e professor ao mesmo tempo.");
    }
    mutate(
      { id: userId, payload: payload as UpdateUserAdminPayload },
      {
        onSuccess: (response) => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            form.reset();
            appToast.success("Usuário editado com sucesso", {});
            navigate({ to: "/admin/users" });
            setAutoFilled({ addressLine: false, city: false });
          } else {
            appToast.error("Erro ao editar usuário", {});
          }
        },
        onError: () => {
          appToast.error("Erro ao editar usuário");
        },
      },
    );
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="h-full flex flex-col px-4 overflow-x-hidden overflow-y-auto">
      <div className="space-y-2">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/10 z-10">
            <MoonLoader size={40} color="#22c55e" />
          </div>
        )}
        <Typography className="text-2xl font-semibold text-on-banner-text">
          Edição de Usuário
        </Typography>
      </div>
      <Form {...form}>
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-start gap-4">
            <Typography className="font-medium text-foreground text-lg">
              Informações pessoais
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
                          form.setValue("addressLine", "");
                          form.setValue("document", "");
                          form.setValue("rg", "");
                          form.setValue("country", "");
                        } else {
                          form.setValue("country", "Brasil");
                        }
                      }}
                    />
                    <Label htmlFor="isForeign">
                      <Typography variant="body" className="text-foreground">
                        Não sou brasileiro
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
                    label="Nome completo"
                    required
                    placeholder="Nome completo"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Email"
                    required
                    type="email"
                    placeholder="email@email.com"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <TextInput label="Telefone" required placeholder="(55) 99999-9999" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label={isForeign ? "Passaporte" : "CPF"}
                    required
                    placeholder={isForeign ? "Número do passaporte" : "XXX.XXX.XXX-XX"}
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
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex flex-col gap-0">
                      <Typography className="text-foreground font-medium mb-1">
                        {t("register.fields.gender.label")} *
                      </Typography>
                      <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("register.fields.gender.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Feminino">
                            {t("register.fields.gender.female")}
                          </SelectItem>
                          <SelectItem value="Masculino">{t("register.fields.gender.male")}</SelectItem>
                          <SelectItem value="Outros">{t("register.fields.gender.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="text-default-red text-xs" />
                  </FormItem>
                );
              }}
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
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label={isForeign ? "ZIP CODE" : "CEP"}
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
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-0">
                    <Typography className="text-foreground font-medium">País</Typography>
                    {isForeign ? (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o país" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Endereço"
                    required
                    placeholder="Rua"
                    disabled={isForeign || autoFilled.addressLine || isFetchingCep}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Cidade"
                    required={!isForeign}
                    placeholder="Cidade"
                    disabled={isForeign || autoFilled.city || isFetchingCep}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Número"
                    required
                    placeholder="Número"
                    disabled={isForeign}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <FormLabel className="text-sm font-medium text-foreground">
                      Administrador
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isProfessor"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <FormLabel className="text-sm font-medium text-foreground">
                      Professor PUCRS
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <Link to="/admin/users">
              <Button type="button" variant="ghost" label="Voltar" className="w-36" />
            </Link>
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="w-36"
              label="Salvar"
              disabled={isPending}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
