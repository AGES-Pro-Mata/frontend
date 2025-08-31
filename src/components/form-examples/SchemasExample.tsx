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

// Schema de Login
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  lembrar: z.boolean().default(false),
});

// Schema de Endereço
const addressSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  logradouro: z.string().min(3, "Logradouro deve ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  estado: z.enum([
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR",
    "SC", "SP", "SE", "TO"
  ], {
    required_error: "Selecione um estado",
  }),
});

type LoginData = z.infer<typeof loginSchema>;
type AddressData = z.infer<typeof addressSchema>;

export function SchemasExample() {
  const [activeForm, setActiveForm] = useState<"login" | "address">("login");
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
      lembrar: false,
    },
  });

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "SP",
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    console.log("Login:", data);
    setLoginData(data);
    loginForm.reset();
  };

  const onAddressSubmit = (data: AddressData) => {
    console.log("Endereço:", data);
    setAddressData(data);
    addressForm.reset();
  };

  const handleReset = () => {
    if (activeForm === "login") {
      loginForm.reset();
      setLoginData(null);
    } else {
      addressForm.reset();
      setAddressData(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h3" className="text-lg font-semibold mb-2">
          📚 Exemplos de Schemas
        </Typography>
        <p className="text-sm text-muted-foreground">
          Este exemplo demonstra diferentes schemas de validação para casos de uso comuns:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-4">
          <li><strong>Schema de Login:</strong> E-mail, senha e checkbox "lembrar"</li>
          <li><strong>Schema de Endereço:</strong> CEP, logradouro, número, complemento, bairro, cidade e estado</li>
          <li><strong>Validações Específicas:</strong> Regex para CEP, enum para estados</li>
          <li><strong>Campos Opcionais:</strong> Complemento é opcional</li>
        </ul>
      </div>

      {/* Seletor de Formulário */}
      <div className="flex gap-2">
        <Button
          variant={activeForm === "login" ? "default" : "outline"}
          onClick={() => setActiveForm("login")}
        >
          🔐 Formulário de Login
        </Button>
        <Button
          variant={activeForm === "address" ? "default" : "outline"}
          onClick={() => setActiveForm("address")}
        >
          🏠 Formulário de Endereço
        </Button>
      </div>

      {/* Formulário de Login */}
      {activeForm === "login" && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-blue-50 p-4">
            <Typography variant="h4" className="text-sm font-medium text-blue-800 mb-2">
              🔐 Schema de Login
            </Typography>
            <pre className="text-xs text-blue-700 overflow-auto">
              {`const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  lembrar: z.boolean().default(false),
});`}
            </pre>
          </div>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Digite seu e-mail de acesso
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo de 6 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="lembrar"
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
                      <FormLabel>Lembrar de mim</FormLabel>
                      <FormDescription>
                        Mantenha-me conectado por 30 dias
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Entrar
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

          {/* Dados do login */}
          {loginData && (
            <>
              <Separator />
              <div className="space-y-4">
                <Typography variant="h3" className="text-lg font-semibold text-green-600">
                  ✅ Login realizado com sucesso!
                </Typography>

                <div className="rounded-lg border bg-muted p-4">
                  <Typography variant="h4" className="text-sm font-medium mb-3">
                    Dados do login:
                  </Typography>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(loginData, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Formulário de Endereço */}
      {activeForm === "address" && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-green-50 p-4">
            <Typography variant="h4" className="text-sm font-medium text-green-800 mb-2">
              🏠 Schema de Endereço
            </Typography>
            <pre className="text-xs text-green-700 overflow-auto">
              {`const addressSchema = z.object({
  cep: z.string().regex(/^\\d{5}-?\\d{3}$/, "CEP inválido"),
  logradouro: z.string().min(3, "Logradouro deve ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  estado: z.enum(["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]),
});`}
            </pre>
          </div>

          <Form {...addressForm}>
            <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-6">
              {/* CEP e Logradouro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={addressForm.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345-678"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Formato: 12345-678 ou 12345678
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="logradouro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua das Flores"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome da rua, avenida, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Número e Complemento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={addressForm.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Número do endereço
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apto 45, Bloco B"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Apartamento, bloco, etc. (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bairro e Cidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={addressForm.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Centro"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome do bairro
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="São Paulo"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome da cidade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Estado */}
              <FormField
                control={addressForm.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Selecione um estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Selecione o estado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Salvar Endereço
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

          {/* Dados do endereço */}
          {addressData && (
            <>
              <Separator />
              <div className="space-y-4">
                <Typography variant="h3" className="text-lg font-semibold text-green-600">
                  ✅ Endereço salvo com sucesso!
                </Typography>

                <div className="rounded-lg border bg-muted p-4">
                  <Typography variant="h4" className="text-sm font-medium mb-3">
                    Dados do endereço:
                  </Typography>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(addressData, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <Separator />

      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h4" className="text-sm font-medium mb-2">
          📚 Características dos Schemas Demonstrados:
        </Typography>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li><strong>Validação de E-mail:</strong> Formato automático com Zod</li>
          <li><strong>Validação de Senha:</strong> Comprimento mínimo configurável</li>
          <li><strong>Regex para CEP:</strong> Aceita formatos com e sem hífen</li>
          <li><strong>Enum para Estados:</strong> Lista predefinida de valores válidos</li>
          <li><strong>Campos Opcionais:</strong> Complemento não é obrigatório</li>
          <li><strong>Validações de Comprimento:</strong> Mínimo para campos obrigatórios</li>
        </ul>
      </div>

      <div className="rounded-lg border bg-blue-50 p-4">
        <Typography variant="h4" className="text-sm font-medium text-blue-800 mb-2">
          💡 Como Criar Seus Próprios Schemas:
        </Typography>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1 ml-4">
          <li>Defina o tipo de dados esperado (string, number, boolean)</li>
          <li>Adicione validações específicas (min, max, regex, email)</li>
          <li>Use <code>.optional()</code> para campos não obrigatórios</li>
          <li>Use <code>.refine()</code> para validações customizadas</li>
          <li>Use <code>.enum()</code> para valores predefinidos</li>
          <li>Combine schemas com <code>.object()</code> para formulários complexos</li>
        </ol>
      </div>
    </div>
  );
}
