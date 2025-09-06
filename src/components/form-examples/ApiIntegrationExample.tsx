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

// Schema para usuário com upload de arquivo
const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("E-mail inválido"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  avatar: z.instanceof(File).optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  redesSociais: z.object({
    twitter: z
      .string()
      .url("URL do Twitter inválida")
      .optional()
      .or(z.literal("")),
    linkedin: z
      .string()
      .url("URL do LinkedIn inválida")
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .url("URL do GitHub inválida")
      .optional()
      .or(z.literal("")),
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ApiIntegrationExample() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      bio: "",
      website: "",
      redesSociais: {
        twitter: "",
        linkedin: "",
        github: "",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setApiResponse(null);

    try {
      // Simular envio para API
      const response = await simulateApiCall(data);

      if (response.success) {
        setApiResponse(response);
        setSubmittedData(data);
        form.reset();
      } else {
        throw new Error(response.message || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro na API:", error);
      setError(
        error instanceof Error ? error.message : "Erro interno do servidor"
      );

      // Simular erro de validação da API
      if (error instanceof Error && error.message.includes("email")) {
        form.setError("email", {
          type: "manual",
          message: "Este e-mail já está em uso",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateApiCall = async (data: FormData): Promise<any> => {
    // Simular delay da API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular validações da API
    if (data.email === "admin@teste.com") {
      throw new Error("E-mail já está em uso");
    }

    if (data.nome.toLowerCase().includes("teste")) {
      throw new Error("Nome não pode conter a palavra 'teste'");
    }

    // Simular sucesso
    return {
      success: true,
      message: "Usuário criado com sucesso!",
      data: {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      },
    };
  };

  const handleReset = () => {
    form.reset();
    setSubmittedData(null);
    setApiResponse(null);
    setError(null);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo e tamanho do arquivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        alert("Arquivo muito grande. Tamanho máximo: 5MB");
        return;
      }

      field.onChange(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h3" className="text-lg font-semibold mb-2">
          🔄 Integração com APIs
        </Typography>
        <p className="text-sm text-muted-foreground">
          Este exemplo demonstra como integrar formulários com APIs:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-4">
          <li>Envio de dados para API</li>
          <li>Upload de arquivos</li>
          <li>Tratamento de respostas da API</li>
          <li>Validação de dados do servidor</li>
          <li>Tratamento de erros de API</li>
          <li>Estados de loading e sucesso</li>
        </ul>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Website */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://seusite.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  URL do seu site pessoal ou profissional
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
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
                <FormDescription>Máximo de 500 caracteres</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload de arquivo */}
          <FormField
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto de Perfil</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, field)}
                  />
                </FormControl>
                <FormDescription>
                  Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Redes sociais */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-sm font-medium">
              Redes Sociais
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="redesSociais.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://twitter.com/seuusuario"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="redesSociais.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/seuusuario"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="redesSociais.github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://github.com/seuusuario"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Erro da API */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <Typography
                variant="h4"
                className="text-sm font-medium text-red-800 mb-1"
              >
                Erro da API
              </Typography>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Enviando para API...
                </>
              ) : (
                "Criar Usuário"
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

      {/* Resposta da API */}
      {apiResponse && (
        <>
          <Separator />
          <div className="space-y-4">
            <Typography
              variant="h3"
              className="text-lg font-semibold text-green-600"
            >
              ✅ API Response
            </Typography>

            <div className="rounded-lg border bg-muted p-4">
              <Typography variant="h4" className="text-sm font-medium mb-3">
                Resposta da API:
              </Typography>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}

      {/* Dados enviados */}
      {submittedData && (
        <>
          <Separator />
          <div className="space-y-4">
            <Typography
              variant="h3"
              className="text-lg font-semibold text-blue-600"
            >
              📤 Dados Enviados
            </Typography>

            <div className="rounded-lg border bg-muted p-4">
              <Typography variant="h4" className="text-sm font-medium mb-3">
                Dados do formulário:
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
          🔄 Funcionalidades de API Demonstradas:
        </Typography>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li>
            <strong>Simulação de API:</strong> Delay de 2 segundos para simular
            chamada real
          </li>
          <li>
            <strong>Validação do Servidor:</strong> E-mail "admin@teste.com"
            retorna erro
          </li>
          <li>
            <strong>Upload de Arquivos:</strong> Validação de tipo e tamanho
          </li>
          <li>
            <strong>Tratamento de Erros:</strong> Diferentes tipos de erro da
            API
          </li>
          <li>
            <strong>Estados de Loading:</strong> Feedback visual durante
            chamadas
          </li>
          <li>
            <strong>Resposta Estruturada:</strong> Dados retornados pela API
          </li>
        </ul>
      </div>

      <div className="rounded-lg border bg-blue-50 p-4">
        <Typography
          variant="h4"
          className="text-sm font-medium text-blue-800 mb-2"
        >
          💡 Dicas para Integração Real:
        </Typography>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1 ml-4">
          <li>
            Use <code>fetch</code> ou <code>axios</code> para chamadas HTTP
          </li>
          <li>Implemente retry logic para falhas temporárias</li>
          <li>Use interceptors para tratamento global de erros</li>
          <li>Implemente cache para dados frequentemente acessados</li>
          <li>Use FormData para upload de arquivos</li>
        </ul>
      </div>
    </div>
  );
}
