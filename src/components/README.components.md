# 📚 Documentação dos Componentes UI

Este arquivo contém a documentação de uso dos componentes UI do projeto, baseados no Shadcn/UI.

---

## 📝 Form - Componente de Formulário

O componente `Form` do Shadcn/UI fornece uma interface consistente e acessível para formulários, integrando-se perfeitamente com React Hook Form e validação Zod.

### 💡 Tipagem avançada do useForm com Zod

Quando seu schema usa z.coerce ou transforms, alinhe os genéricos do React Hook Form para evitar valores "unknown" e melhorar a inferência:

```typescript
const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: {
    // ...
  },
});
```

### 🏗️ Estrutura Básica

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// 1. Schema de validação
const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("E-mail inválido"),
});

type FormData = z.infer<typeof formSchema>;

// 2. Hook do formulário
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    nome: "",
    email: "",
  },
});

// 3. Função de submit
const onSubmit = (data: FormData) => {
  console.log(data);
};

// 4. Estrutura do formulário
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="nome"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input placeholder="Seu nome" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### 🎯 Tipos de Campos

#### Campo de Texto Simples

```typescript
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
```

#### Campo de E-mail

```typescript
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
```

#### Campo Numérico

```typescript
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
```

Nota quando usar z.coerce.number(): converta a string do input para número no onChange para manter a tipagem consistente, e considere alinhar os genéricos do useForm com o Zod.

```typescript
// Schema com coerção numérica
const schema = z.object({
  idade: z.coerce.number().min(18),
})

// Tipagem alinhada entre input e output do Zod (opcional, recomendado)
const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
  resolver: zodResolver(schema),
})

// Campo numérico com conversão
<FormField
  control={form.control}
  name="idade"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Idade *</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          value={field.value as number | undefined}
          onChange={(e) =>
            field.onChange(
              e.currentTarget.value === "" ? undefined : Number(e.currentTarget.value)
            )
          }
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### Campo de Seleção (Select)

```typescript
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
```

#### Campo de Texto Longo (Textarea)

```typescript
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
```

#### Campo Checkbox

```typescript
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
```

### 🔧 Funcionalidades Avançadas

#### Estados do Formulário

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);

  try {
    // Simular envio para API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Sucesso
    console.log('Dados enviados:', data);
    form.reset(); // Reset do formulário

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    setIsSubmitting(false);
  }
};

// Botão com estado de loading
<Button
  type="submit"
  disabled={isSubmitting}
  className="flex-1"
>
  {isSubmitting ? "Enviando..." : "Enviar Formulário"}
</Button>
```

#### Reset do Formulário

```typescript
const handleReset = () => {
  form.reset();
  // Limpar outros estados se necessário
};

<Button
  type="button"
  variant="outline"
  onClick={handleReset}
  disabled={isSubmitting}
>
  Limpar
</Button>
```

#### Validação Customizada

```typescript
const onSubmit = async (data: FormData) => {
  try {
    // Validação adicional se necessário
    if (data.idade < 18) {
      form.setError("idade", {
        type: "manual",
        message: "Idade mínima é 18 anos",
      });
      return;
    }

    // Envio do formulário
    await submitForm(data);
  } catch (error) {
    // Tratamento de erro global
    form.setError("root", {
      type: "manual",
      message: "Erro ao enviar formulário. Tente novamente.",
    });
  }
};
```

### 🎨 Estilização e Layout

#### Grid Responsivo

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FormField name="nome" ... />
  <FormField name="sobrenome" ... />
</div>
```

#### Campos com Estilo Personalizado

```typescript
<FormItem className="custom-form-item">
  <FormLabel className="text-lg font-semibold">Nome</FormLabel>
  <FormControl>
    <Input
      className="border-2 border-blue-200 focus:border-blue-500"
      {...field}
    />
  </FormControl>
</FormItem>
```

### 📱 Acessibilidade

O componente Form do Shadcn/UI já inclui:

- **Labels associados** aos campos
- **Descrições** para orientar o usuário
- **Mensagens de erro** claras
- **Navegação por teclado**
- **Suporte a leitores de tela**

### 🚨 Tratamento de Erros

#### Validação de Campos com Feedback Visual

```typescript
<FormField
  name="telefone"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Telefone *</FormLabel>
      <FormControl>
        <Input
          placeholder="(11) 99999-9999"
          {...field}
          className={fieldState.error ? "border-red-500" : ""}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 🔄 Integração com APIs

#### Envio de Dados

```typescript
const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar dados");
    }

    const result = await response.json();
    console.log("Sucesso:", result);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    setIsSubmitting(false);
  }
};
```

#### Upload de Arquivos

```typescript
<FormField
  name="avatar"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Foto de Perfil</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              field.onChange(file);
            }
          }}
        />
      </FormControl>
      <FormDescription>
        Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 📚 Exemplos de Schemas

#### Formulário de Login

```typescript
const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  lembrar: z.boolean().default(false),
});
```

#### Formulário de Endereço

```typescript
const addressSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  logradouro: z.string().min(3, "Logradouro deve ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  estado: z.enum([
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ]),
});
```

### 🎯 Boas Práticas

1. **Validação Consistente**: Use mensagens de erro claras e específicas
2. **Feedback Visual**: Mostre estados de loading e sucesso
3. **Acessibilidade**: Sempre inclua labels e descrições
4. **Performance**: Use `useCallback` para funções de submit
5. **Tratamento de Erros**: Implemente fallbacks para falhas de API
6. **Validação em Tempo Real**: Use Zod para validação automática
7. **Estados de Loading**: Desabilite campos durante o envio
8. **Reset Limpo**: Sempre limpe o formulário após sucesso

### 🔗 Links Úteis

- [Documentação do Shadcn/UI Form](https://ui.shadcn.com/docs/components/form)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---
