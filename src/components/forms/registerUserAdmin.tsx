import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
  FormLabel,
} from "@/components/ui/form";
import { TextInput } from "@/components/inputs/textInput";
import { Typography } from "@/components/typography/typography";
import { Button } from "@/components/buttons/defaultButton";
import { useRegisterAdmin } from "@/hooks/useRegisterAdmin";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { COUNTRIES } from "@/lib/countries";
import { toast } from "sonner";
import { useCepQuery } from "@/hooks/useCepQuery";
import {
  isValidBrazilZip,
  isValidCpf,
  digitsOnly,
  isValidForeignZip,
  generateRandomPassword,
  maskCpf,
  maskCep,
} from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";

const formSchema = z
  .object({
    name: z.string().min(2, "Informe o nome completo"),
    email: z.email("Digite um e-mail válido"),
    phone: z.string().min(8, "Informe o telefone"),
    cpf: z.string().optional().default(""),
    rg: z.string().optional().default(""),
    gender: z.string().min(1, "Informe o gênero"),
    zipCode: z.string().min(5, "Informe o CEP/ZIP"),
    country: z.string().min(2, "Informe o país"),
    isForeign: z.boolean().default(false),
    addressLine: z.string().optional().default(""),
    city: z.string().optional(),
    number: z.string().optional(),
    isAdmin: z.boolean().default(false),
    isProfessor: z.boolean().default(false),
    password: z.string().min(6, "Senha mínima de 6 caracteres"),
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
      if (!data.cpf || !isValidCpf(data.cpf)) {
        ctx.addIssue({
          code: "custom",
          message: "CPF inválido",
          path: ["cpf"],
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

type FormData = z.infer<typeof formSchema>;

export function RegisterUserAdmin() {
  const navigate = useNavigate();
  const [autoFilled, setAutoFilled] = useState({
    addressLine: false,
    city: false,
  });
  const { mutate: registerAdmin, isPending } = useRegisterAdmin();
  const form = useForm<
    z.input<typeof formSchema>,
    any,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      rg: "",
      gender: "",
      zipCode: "",
      country: "Brasil",
      isForeign: false,
      addressLine: "",
      city: "",
      number: "",
      isAdmin: false,
      isProfessor: false,
      password: generateRandomPassword(),
    },
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
    }
  }, [isForeign]);

  const onSubmit = async (data: FormData) => {
    const sanitizedPhone = digitsOnly(data.phone);

    const payload = {
      ...data,
      phone: sanitizedPhone,
      password: data.password,
      cpf: data.cpf ? maskCpf(data.cpf) : undefined,
      rg: data.rg ? data.rg : undefined,
      userType: data.isAdmin
        ? "ADMIN"
        : data.isProfessor
          ? "PROFESSOR"
          : "GUEST",
      institution: data.isProfessor ? "PUCRS" : undefined,
    };

    registerAdmin(payload as any, {
      onSuccess: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          form.reset();
          toast.success("Usuário cadastrado com sucesso", {});
          navigate({ to: "/admin/users" });
          setAutoFilled({ addressLine: false, city: false });
        } else {
          toast.error("Erro ao cadastrar usuário", {});
        }
      },
      onError: () => {
        toast.error("Erro ao cadastrar usuário");
      },
    });
  };

  return (
    <div className="p-6 md:p-8 justify-items-center">
      <div className="space-y-2">
        <Typography className="text-2xl font-semibold text-on-banner-text">
          Cadastro de Usuário
        </Typography>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-3">
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
                          form.setValue("cpf", "");
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
                  <TextInput
                    label="Telefone"
                    required
                    placeholder="(55) 99999-9999"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="CPF"
                    placeholder="XXX.XXX.XXX-XX"
                    disabled={isForeign}
                    value={maskCpf(field.value || "")}
                    onChange={(e) => {
                      const digits = digitsOnly(e.target.value).slice(0, 11);
                      const masked = maskCpf(digits);
                      field.onChange(masked);
                    }}
                  />
                  <FormMessage />
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
                      Gênero
                    </Typography>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
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
                    <Typography className="text-foreground font-medium">
                      País
                    </Typography>
                    {isForeign ? (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                    disabled={
                      isForeign || autoFilled.addressLine || isFetchingCep
                    }
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
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel className="text-sm font-medium text-foreground">
                      Professor PUCRS
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Senha"
                    required
                    type="password"
                    placeholder="Senha"
                    {...field}
                  />
                  <FormDescription className="text-sm text-red-400">
                    A senha foi gerada automaticamente. No primeiro acesso será
                    solicitado que o usuário a altere.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <Link to="/admin/users">
              <Button
                type="button"
                variant="ghost"
                label="Voltar"
                className="w-36"
              />
            </Link>
            <Button
              type="submit"
              variant="primary"
              className="w-36"
              label="Criar"
              disabled={isPending}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
