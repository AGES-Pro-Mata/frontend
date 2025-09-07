import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography/typography";
import { Separator } from "@/components/ui/separator";

// Schema com validações customizadas
const formSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.email("E-mail inválido"),
    idade: z.coerce
      .number()
      .min(18, "Idade mínima é 18 anos")
      .max(120, "Idade máxima é 120 anos"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
    termos: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormData = z.infer<typeof formSchema>;

export function AdvancedFeaturesExample() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  const form = useForm<
    z.input<typeof formSchema>,
    any,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      idade: 18,
      senha: "",
      confirmarSenha: "",
      termos: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setCustomError(null);

    try {
      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Sucesso
      setSubmittedData(data);
      form.reset();
    } catch (error) {
      // Tratamento de erro global
      form.setError("root", {
        type: "manual",
        message: "Erro ao enviar formulário. Tente novamente.",
      });
      setCustomError(
        "Erro interno do servidor. Tente novamente em alguns minutos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setSubmittedData(null);
    setCustomError(null);
  };

  const handleCustomValidation = () => {
    const idade = Number(form.getValues("idade"));
    if (idade < 25) {
      form.setError("idade", {
        type: "manual",
        message: "Para esta funcionalidade, idade mínima é 25 anos",
      });
    } else {
      form.clearErrors("idade");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h3" className="text-lg font-semibold mb-2">
          🔧 Funcionalidades Avançadas
        </Typography>
        <p className="text-sm text-muted-foreground">
          Este exemplo demonstra funcionalidades avançadas do Form:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-4">
          <li>Estados de loading e submissão</li>
          <li>Reset do formulário</li>
          <li>Validação customizada</li>
          <li>Tratamento de erros globais</li>
          <li>Validação cross-field (senhas)</li>
          <li>Feedback visual durante operações</li>
        </ul>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Grid responsivo para campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Idade */}
            <FormField
              control={form.control}
              name="idade"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Idade *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="18"
                      {...field}
                      value={field.value as number | undefined}
                      onChange={(e) =>
                        field.onChange(
                          e.currentTarget.value === ""
                            ? undefined
                            : Number(e.currentTarget.value)
                        )
                      }
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormDescription>Idade mínima: 18 anos</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão de validação customizada */}
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCustomValidation}
                className="w-full"
              >
                Validar Idade
              </Button>
            </div>
          </div>

          {/* Senhas - validação cross-field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Mínimo de 6 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirme sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Digite a mesma senha novamente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Termos */}
          <FormField
            control={form.control}
            name="termos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Li e aceito os termos de uso</FormLabel>
                  <FormDescription>
                    Você deve aceitar os termos para continuar
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Erro global */}
          {form.formState.errors.root && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <Typography
                variant="h4"
                className="text-sm font-medium text-red-800 mb-1"
              >
                Erro do Formulário
              </Typography>
              <p className="text-sm text-red-700">
                {form.formState.errors.root.message}
              </p>
            </div>
          )}

          {/* Erro customizado */}
          {customError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <Typography
                variant="h4"
                className="text-sm font-medium text-red-800 mb-1"
              >
                Erro do Sistema
              </Typography>
              <p className="text-sm text-red-700">{customError}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Enviando...
                </>
              ) : (
                "Enviar Formulário"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Limpar
            </Button>
          </div>
        </form>
      </Form>

      {/* Dados enviados */}
      {submittedData && (
        <>
          <Separator />
          <div className="space-y-4">
            <Typography
              variant="h3"
              className="text-lg font-semibold text-green-600"
            >
              ✅ Formulário enviado com sucesso!
            </Typography>

            <div className="rounded-lg border bg-muted p-4">
              <Typography variant="h4" className="text-sm font-medium mb-3">
                Dados enviados:
              </Typography>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}

      <Separator />

      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h4" className="text-sm font-medium mb-2">
          🔧 Funcionalidades Demonstradas:
        </Typography>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li>
            <strong>Estados de Loading:</strong> Botão desabilitado e spinner
            durante envio
          </li>
          <li>
            <strong>Validação Cross-field:</strong> Senha e confirmação devem
            ser iguais
          </li>
          <li>
            <strong>Validação Customizada:</strong> Botão para validar idade com
            regras específicas
          </li>
          <li>
            <strong>Tratamento de Erros:</strong> Erros globais e por campo
          </li>
          <li>
            <strong>Feedback Visual:</strong> Campos com erro destacados em
            vermelho
          </li>
          <li>
            <strong>Reset Inteligente:</strong> Limpa formulário e estados após
            sucesso
          </li>
        </ul>
      </div>
    </div>
  );
}
