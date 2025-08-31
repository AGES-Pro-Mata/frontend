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
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

// Schema com todos os tipos de campos
const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  idade: z.coerce.number().min(18, "Idade mínima é 18 anos").max(120, "Idade máxima é 120 anos"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  newsletter: z.boolean().default(false),
  categoria: z.enum(["pessoal", "trabalho", "estudo"], {
    required_error: "Selecione uma categoria",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function FieldTypesExample() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      idade: 18,
      bio: "",
      newsletter: false,
      categoria: "pessoal",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Dados do formulário:", data);
    setSubmittedData(data);
  };

  const handleReset = () => {
    form.reset();
    setSubmittedData(null);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h3" className="text-lg font-semibold mb-2">
          🎯 Tipos de Campos Disponíveis
        </Typography>
        <p className="text-sm text-muted-foreground">
          Este exemplo demonstra todos os tipos de campos mencionados no README:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-4">
          <li>Campo de texto simples</li>
          <li>Campo de e-mail</li>
          <li>Campo numérico</li>
          <li>Campo de seleção (select)</li>
          <li>Campo de texto longo (textarea)</li>
          <li>Campo checkbox</li>
        </ul>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Grid responsivo para os campos */}
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
                  <FormDescription>
                    Digite seu nome completo como aparece no documento.
                  </FormDescription>
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
                  <FormDescription>
                    Este e-mail será usado para contato.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefone */}
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Inclua o código da área.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Idade */}
            <FormField
              control={form.control}
              name="idade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="18"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Idade mínima: 18 anos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Categoria - ocupa toda a largura */}
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="pessoal">Pessoal</option>
                    <option value="trabalho">Trabalho</option>
                    <option value="estudo">Estudo</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Selecione a categoria que melhor descreve seu perfil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio - ocupa toda a largura */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografia</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Conte um pouco sobre você..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Máximo de 500 caracteres.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Newsletter */}
          <FormField
            control={form.control}
            name="newsletter"
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
                  <FormLabel>Receber newsletter</FormLabel>
                  <FormDescription>
                    Receba atualizações e novidades por e-mail.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Enviar Formulário
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
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
            <Typography variant="h3" className="text-lg font-semibold text-green-600">
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
          🎨 Características dos Campos:
        </Typography>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li><strong>Grid Responsivo:</strong> Campos organizados em 2 colunas em telas médias</li>
          <li><strong>Validação em Tempo Real:</strong> Erros aparecem conforme o usuário digita</li>
          <li><strong>Descrições:</strong> Cada campo tem uma descrição explicativa</li>
          <li><strong>Mensagens de Erro:</strong> Feedback claro sobre problemas de validação</li>
          <li><strong>Layout Adaptativo:</strong> Campos de texto longo ocupam toda a largura</li>
        </ul>
      </div>
    </div>
  );
}
