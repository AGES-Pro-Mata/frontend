import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TextInput } from "@/components/inputs/textInput";
import { Typography } from "@/components/typography/typography";
import { Button } from "@/components/buttons/defaultButton";
import { useRegisterUser } from "@/hooks/useRegisterUser";
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
import { toast } from "sonner";
import { useCepQuery } from "@/hooks/useCepQuery";
import {
  isValidBrazilZip,
  isValidCpf,
  digitsOnly,
  isValidForeignZip,
  maskCpf,
  maskCep,
} from "@/lib/utils";
import type { RegisterUserPayload } from "@/api/user";
import { CanvasCard } from "../cards";
import { Link } from "@tanstack/react-router";

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
    number: z.number().optional(),
    password: z.string().min(6, "Senha mínima de 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
    institution: z.string().optional().default(""),
    function: z.string().optional().default(""),
    wantsDocencyRegistration: z.boolean().default(false),
    docencyDocument: z.instanceof(File).optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }

    if (data.docencyDocument) {
      if (data.docencyDocument.type !== "application/pdf") {
        ctx.addIssue({
          code: "custom",
          message: "Apenas arquivos PDF são aceitos",
          path: ["docencyDocument"],
        });
      }
      if (data.docencyDocument.size > 20 * 1024 * 1024) {
        ctx.addIssue({
          code: "custom",
          message: "Arquivo deve ter no máximo 20MB",
          path: ["docencyDocument"],
        });
      }
    }

    if (!data.isForeign) {
      if (!data.city || data.city.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Cidade e número são obrigatórios para brasileiros",
          path: ["city"],
        });
      }
      if (!data.number || data.number < 1) {
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

export function RegisterUser() {
  const [autoFilled, setAutoFilled] = useState({
    addressLine: false,
    city: false,
  });
  const { mutate: registerUser, isPending } = useRegisterUser();
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
      number: undefined,
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

    const payload: RegisterUserPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phone: sanitizedPhone,
      gender: data.gender,
      cpf: data.cpf ? maskCpf(data.cpf) : undefined,
      rg: data.rg || undefined,
      country: data.country,
      userType: data.wantsDocencyRegistration ? "PROFESSOR" : "GUEST",
      institution: data.institution,
      isForeign: data.isForeign,
      addressLine: data.addressLine || "",
      city: data.city || "",
      zipCode: data.zipCode,
      number: data.number,
      teacherDocument: data.docencyDocument,
    };

    registerUser(payload, {
      onSuccess: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          form.reset();
          toast.success("Usuário cadastrado com sucesso", {});
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
    <div className="p-6 justify-center px-80">
      <CanvasCard className="p-12">
        <div className="text-center space-y-2">
          <Typography variant="h2" className="pb-2 text-on-banner-text">
            Cadastro
          </Typography>
          <Typography variant="body">
            Preencha os dados abaixo para criar sua conta
          </Typography>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-3"
          >
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
                            form.setValue("number", undefined);
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
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
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção de Segurança */}
            <div className="space-y-4">
              <Typography className="font-medium text-foreground text-lg">
                Segurança
              </Typography>
              <Separator />

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
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <TextInput
                        label="Confirmar senha"
                        required
                        type="password"
                        placeholder="Confirmar senha"
                        {...field}
                      />
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção de Informações Profissionais */}
            <div className="space-y-4">
              <Typography className="font-medium text-foreground text-lg">
                Informações Profissionais
              </Typography>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <TextInput
                        label="Instituição"
                        placeholder="Universidade/Empresa"
                        {...field}
                      />
                      <FormMessage className="text-red-400" />
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
                          Selecione sua Função
                        </Typography>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua Função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Estudante</SelectItem>
                            <SelectItem value="teacher">Professor</SelectItem>
                            <SelectItem value="researcher">
                              Pesquisador
                            </SelectItem>
                            <SelectItem value="employee">
                              Funcionário
                            </SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="text-red-400" />
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
                          Gostaria de solicitar um cadastro de docente
                        </Typography>
                      </Label>
                    </div>
                    <FormMessage className="text-red-400" />
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
                          Comprovante de Docência (PDF) - Opcional
                        </Typography>
                        <Typography className="text-sm text-muted-foreground">
                          Você pode enviar o comprovante agora ou posteriormente
                          na edição do perfil. Máximo 20MB.
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
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-900 hover:file:bg-yellow-100"
                          />
                          {value && (
                            <Typography className="text-sm text-green-600">
                              ✓ {value.name}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <FormMessage className="text-red-400" />
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
                          Eu aceito os{" "}
                          <Link to="/terms" className="text-blue-600 underline">
                            Termos de Uso
                          </Link>{" "}
                          e a{" "}
                          <Link
                            to="/privacy"
                            className="text-blue-600 underline"
                          >
                            Política de Privacidade
                          </Link>{" "}
                          do PRÓ-MATA *
                        </Typography>
                      </Label>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full max-w-xs"
                label="Criar Conta"
                disabled={isPending}
              />
              <Typography className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/auth/login" className="text-primary underline">
                  Fazer login
                </Link>
              </Typography>
            </div>
          </form>
        </Form>
      </CanvasCard>
    </div>
  );
}
