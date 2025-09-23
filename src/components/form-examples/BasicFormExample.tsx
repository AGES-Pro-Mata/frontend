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

// Schema de validação básico
const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("E-mail inválido"),
});

type FormData = z.infer<typeof formSchema>;

export function BasicFormExample() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Dados do formulário:", data);
    alert(
      `Formulário enviado com sucesso!\nNome: ${data.nome}\nE-mail: ${data.email}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h3" className="text-lg font-semibold mb-2">
          📋 Estrutura Básica
        </Typography>
        <p className="text-sm text-muted-foreground">
          Este exemplo demonstra a estrutura básica do componente Form com:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-4">
          <li>Schema de validação com Zod</li>
          <li>Hook do formulário com React Hook Form</li>
          <li>Campos de texto e e-mail</li>
          <li>Validação em tempo real</li>
        </ul>
      </div>

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
                <FormDescription>Digite seu nome completo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormDescription>Digite um e-mail válido.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Enviar Formulário
          </Button>
        </form>
      </Form>

      <div className="rounded-lg border bg-muted p-4">
        <Typography variant="h4" className="text-sm font-medium mb-2">
          💡 Como usar:
        </Typography>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li>Defina o schema de validação com Zod</li>
          <li>Configure o hook useForm com zodResolver</li>
          <li>Use o componente Form com os campos FormField</li>
          <li>Implemente a função onSubmit para processar os dados</li>
        </ol>
      </div>
    </div>
  );
}
