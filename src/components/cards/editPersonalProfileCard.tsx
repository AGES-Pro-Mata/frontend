"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export function EditPersonalProfileCard() {
    const { control, register, formState: { errors } } = useFormContext();

    return (
        <div className="w-full rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="mb-1 text-2xl font-semibold tracking-tight">
                Informações pessoais
            </h2>
            <hr className="mb-6" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* Nome Completo */}
                <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    {/* ADICIONADO: Validação nativa do react-hook-form */}
                    <Input
                        id="fullName"
                        placeholder="Seu nome completo"
                        {...register("fullName", { required: "Nome completo é obrigatório" })}
                    />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message as string}</p>}
                </div>

                {/* Endereço */}
                <div className="space-y-2">
                    <Label htmlFor="addressLine">Endereço *</Label>
                    <Input
                        id="addressLine"
                        placeholder="Sua rua, avenida, etc."
                        {...register("addressLine", { required: "Endereço é obrigatório" })}
                    />
                    {errors.addressLine && <p className="text-sm text-red-500">{errors.addressLine.message as string}</p>}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                        id="phone"
                        placeholder="(55) 99999-9999"
                        {...register("phone", { required: "Telefone é obrigatório" })}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message as string}</p>}
                </div>

                {/* País */}
                <div className="space-y-2">
                    <Label htmlFor="country">País *</Label>
                    <Input
                        id="country"
                        placeholder="Brasil"
                        {...register("country", { required: "País é obrigatório" })}
                    />
                    {errors.country && <p className="text-sm text-red-500">{errors.country.message as string}</p>}
                </div>

                {/* Gênero */}
                <FormField
                    control={control}
                    name="gender"
                    // ADICIONADO: 'rules' para validação em componentes com FormField
                    rules={{ required: "Gênero é obrigatório" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gênero *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Selecione seu gênero" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="MALE">Masculino</SelectItem>
                                    <SelectItem value="FEMALE">Feminino</SelectItem>
                                    <SelectItem value="OTHER">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* CEP/ZIP CODE */}
                <div className="space-y-2">
                    <Label htmlFor="zip">CEP/ZIP CODE *</Label>
                    <Input
                        id="zip"
                        placeholder="98460-000"
                        {...register("zip", { required: "CEP é obrigatório" })}
                    />
                    {errors.zip && <p className="text-sm text-red-500">{errors.zip.message as string}</p>}
                </div>

                {/* Cidade */}
                <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                        id="city"
                        placeholder="Sua cidade"
                        {...register("city", { required: "Cidade é obrigatória" })}
                    />
                    {errors.city && <p className="text-sm text-red-500">{errors.city.message as string}</p>}
                </div>

                {/* Número */}
                <div className="space-y-2">
                    <Label htmlFor="number">Número *</Label>
                    <Input
                        id="number"
                        placeholder="123"
                        {...register("number", { required: "Número é obrigatório" })}
                    />
                    {errors.number && <p className="text-sm text-red-500">{errors.number.message as string}</p>}
                </div>
            </div>
        </div>
    );
}