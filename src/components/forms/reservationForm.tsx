import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { TextInput } from "@/components/inputs/textInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/buttons/defaultButton";
import { maskCpf, maskPhone, isValidCpf } from "@/lib/utils";

const userSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, "O nome completo é obrigatório."),
    phone: z.string().min(14, "O telefone é obrigatório (mínimo 14 caracteres)."),
    birthDate: z.string().min(10, "A data de nascimento é obrigatória."),
    cpf: z.string().refine(isValidCpf, "O CPF informado é inválido."),
    gender: z.enum(["masculino", "feminino", "outro"], {
        message: "Por favor, selecione um gênero.",
    }),
});

const reservationSchema = z.object({
    users: z.array(userSchema),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
    initialData: ReservationFormData;
    isEditable: boolean;
    onSubmit: (data: ReservationFormData) => void;
}

export function ReservationForm({
                                    initialData,
                                    isEditable,
                                    onSubmit,
                                }: ReservationFormProps) {
    const form = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        mode: "onBlur",
        defaultValues: initialData,
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "users",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-x-4 gap-y-0 items-start">
                                <FormField
                                    control={form.control}
                                    name={`users.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome *</FormLabel>
                                            <FormControl>
                                                <TextInput className="border-gray-900 mb-0" placeholder="Nome completo" disabled={!isEditable} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`users.${index}.phone`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone *</FormLabel>
                                            <FormControl>
                                                <TextInput
                                                    className="border-gray-900 mb-0"
                                                    placeholder="(XX) XXXXX-XXXX"
                                                    disabled={!isEditable}
                                                    {...field}
                                                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`users.${index}.birthDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Nascimento *</FormLabel>
                                            <FormControl>
                                                <TextInput className="border-gray-900 mb-0" placeholder="DD/MM/AAAA" disabled={!isEditable} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`users.${index}.cpf`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF *</FormLabel>
                                            <FormControl>
                                                <TextInput
                                                    className="border-gray-900 mb-0"
                                                    placeholder="000.000.000-00"
                                                    disabled={!isEditable}
                                                    {...field}
                                                    onChange={(e) => field.onChange(maskCpf(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`users.${index}.gender`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gênero *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!isEditable}>
                                                <FormControl className="border-gray-900 mb-0">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="masculino">Masculino</SelectItem>
                                                    <SelectItem value="feminino">Feminino</SelectItem>
                                                    <SelectItem value="outro">Outro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    {isEditable && (
                        <Button type="submit" label="Salvar Alterações" variant="primary" className="w-48" />
                    )}
                </div>
            </form>
        </Form>
    );
}